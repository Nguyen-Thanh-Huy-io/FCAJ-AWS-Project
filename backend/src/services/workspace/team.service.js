const jwt = require('jsonwebtoken');
const prisma = require('../../config/prisma');
const teamRepository = require('../../repositories/workspace/team.repository');
const QueryPipeline = require('../../core/query-pipeline/query.pipeline');
const TeamSearchFilter = require('./team/filters/search.filter');
const TeamRoleFilter = require('./team/filters/role.filter');
const TeamStatusFilter = require('./team/filters/status.filter');

class TeamService {
  constructor() {
    this.queryPipeline = new QueryPipeline([
      new TeamSearchFilter(),
      new TeamRoleFilter(),
      new TeamStatusFilter()
    ]);
  }

  /**
   * Get team members for a brand
   */
  async getTeamMembers(queryParams, brandId) {
    const { page = 1, limit = 50 } = queryParams;
    const safeLimit = Math.min(100, Math.max(1, parseInt(limit) || 50));
    const skip = (Math.max(1, parseInt(page) || 1) - 1) * safeLimit;

    // Apply filters
    const where = this.queryPipeline.apply({ brandId }, queryParams);
    const { members, total } = await teamRepository.findManyAndCount(where, { skip, take: safeLimit });

    return {
      data: members.map(m => this._formatTeamMember(m)),
      meta: { total, page: Math.max(1, parseInt(page) || 1), limit: safeLimit, totalPages: Math.ceil(total / safeLimit) }
    };
  }

  /**
   * Invite a new team member
   */
  async inviteMember({ email, role, brandId, invitedByUserId }) {
    const brand = await prisma.brand.findFirst({
      where: { id: brandId, deletedAt: null },
      include: {
        subscription: {
          include: {
            plan: {
              include: {
                planLimit: true
              }
            }
          }
        }
      }
    });

    if (!brand) {
      const error = new Error('Workspace/Brand không tồn tại.');
      error.status = 404;
      throw error;
    }

    const isAuthorized = await this._checkBrandAccess(brandId, invitedByUserId);
    if (!isAuthorized) {
      const error = new Error('Bạn không có quyền mời thành viên vào thương hiệu này.');
      error.status = 403;
      throw error;
    }

    // Check plan limits
    const currentSeatCount = await prisma.team.count({
      where: { brandId }
    });
    const maxSeats = brand.subscription?.plan?.planLimit?.maxTeamSeats || 5;
    if (currentSeatCount >= maxSeats) {
      const error = new Error(`Thương hiệu đã đạt giới hạn thành viên tối đa cho phép (${maxSeats} người). Vui lòng nâng cấp gói.`);
      error.status = 402;
      throw error;
    }

    // Map role
    let dbRole = 'USER';
    let customRoleId = null;

    // Check if role is custom role ID
    const customRole = await prisma.customRole.findFirst({
      where: { id: role, brandId }
    });

    if (customRole) {
      customRoleId = customRole.id;
      dbRole = 'USER'; // Default fallback role
    } else {
      if (role === 'Admin') dbRole = 'ADMIN';
      else if (role === 'Analyst') dbRole = 'ANALYST';
      else dbRole = 'USER';
    }

    // Find or create shell user
    let user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    let isNewUser = false;
    if (!user) {
      isNewUser = true;
      user = await prisma.user.create({
        data: {
          email: email.toLowerCase(),
          name: email.split('@')[0],
          passwordHash: '',
          role: 'USER',
          isActive: false,
          isEmailVerified: false
        }
      });
    }

    // Check if already in Team
    const existingTeam = await prisma.team.findUnique({
      where: {
        brandId_userId: {
          brandId,
          userId: user.id
        }
      }
    });

    if (existingTeam) {
      if (existingTeam.status === 'ACTIVE') {
        const error = new Error('Người dùng này đã là thành viên của thương hiệu.');
        error.status = 400;
        throw error;
      }
    }

    // Create or update team record
    let team;
    if (existingTeam) {
      team = await prisma.team.update({
        where: { id: existingTeam.id },
        data: {
          role: dbRole,
          customRoleId,
          invitedByUserId,
          invitedAt: new Date(),
          status: 'PENDING'
        }
      });
    } else {
      team = await prisma.team.create({
        data: {
          brandId,
          userId: user.id,
          role: dbRole,
          customRoleId,
          invitedByUserId,
          status: 'PENDING'
        }
      });
    }

    // Generate JWT Token (expires in 7 days)
    const token = jwt.sign(
      { teamId: team.id, email: user.email, brandId },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '7d' }
    );

    // Send invitation email
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const inviteUrl = `${frontendUrl}/invite?token=${token}`;
    const inviter = await prisma.user.findUnique({ where: { id: invitedByUserId } });

    try {
      const emailService = require('../core/email.service');
      await emailService.sendTeamInvitation(user.email, inviter.name, brand.name, inviteUrl);
    } catch (err) {
      console.error('Failed to send invite email:', err);
    }

    return {
      message: 'Đã gửi lời mời thành công',
      team: this._formatTeamMember(await teamRepository.findById(team.id)),
      token
    };
  }

  /**
   * Validate invitation token
   */
  async validateInvitation(token) {
    try {
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      const team = await teamRepository.findById(decoded.teamId);
      if (!team || team.status !== 'PENDING') {
        const error = new Error('Lời mời không hợp lệ hoặc đã được sử dụng.');
        error.status = 400;
        throw error;
      }

      const inviter = await prisma.user.findUnique({
        where: { id: team.invitedByUserId },
        select: { name: true }
      });

      return {
        email: team.user.email,
        brandName: team.brand.name,
        inviterName: inviter?.name || 'Ai đó',
        isNewUser: !team.user.passwordHash || team.user.passwordHash === ''
      };
    } catch (err) {
      const error = new Error(err.message || 'Token lời mời không hợp lệ hoặc đã hết hạn.');
      error.status = 400;
      throw error;
    }
  }

  /**
   * Accept team invitation
   */
  async acceptInvitation({ token, name, password }) {
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    } catch (err) {
      const error = new Error('Token lời mời không hợp lệ hoặc đã hết hạn.');
      error.status = 400;
      throw error;
    }

    const team = await teamRepository.findById(decoded.teamId);
    if (!team || team.status !== 'PENDING') {
      const error = new Error('Lời mời không tồn tại hoặc đã được xử lý.');
      error.status = 400;
      throw error;
    }

    const user = team.user;
    const isNewUser = !user.passwordHash;

    if (isNewUser) {
      if (!name || !password) {
        const error = new Error('Vui lòng điền đầy đủ họ tên và mật khẩu.');
        error.status = 400;
        throw error;
      }

      const bcrypt = require('bcryptjs');
      const passwordHash = await bcrypt.hash(password, 10);

      // Update user profile and activate account
      await prisma.user.update({
        where: { id: user.id },
        data: {
          name,
          passwordHash,
          isActive: true,
          isEmailVerified: true,
          accounts: {
            upsert: {
              where: {
                userId_provider: {
                  userId: user.id,
                  provider: 'LOCAL'
                }
              },
              update: { passwordHash },
              create: {
                provider: 'LOCAL',
                passwordHash
              }
            }
          }
        }
      });
    }

    // Accept team invitation
    await prisma.team.update({
      where: { id: team.id },
      data: {
        status: 'ACTIVE',
        acceptedAt: new Date()
      }
    });

    // Generate tokens for immediate login
    const tokenService = require('../auth/token.service');
    const updatedUser = await prisma.user.findUnique({
      where: { id: user.id }
    });
    const tokens = await tokenService.generateAndSaveTokens(updatedUser);

    return {
      message: 'Chấp nhận lời mời thành công',
      ...tokens,
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        role: updatedUser.role
      }
    };
  }

  /**
   * Update team member role
   */
  async updateMemberRole(id, role, operatorUserId) {
    const team = await teamRepository.findById(id);
    if (!team) {
      const error = new Error('Không tìm thấy thành viên.');
      error.status = 404;
      throw error;
    }

    const isAuthorized = await this._checkBrandAccess(team.brandId, operatorUserId);
    if (!isAuthorized) {
      const error = new Error('Bạn không có quyền quản lý thành viên của thương hiệu này.');
      error.status = 403;
      throw error;
    }

    // Map role
    let dbRole = 'USER';
    let customRoleId = null;

    // Check if role is custom role ID
    const customRole = await prisma.customRole.findFirst({
      where: { id: role, brandId: team.brandId }
    });

    if (customRole) {
      customRoleId = customRole.id;
      dbRole = 'USER'; // Default fallback role
    } else {
      if (role === 'Admin') dbRole = 'ADMIN';
      else if (role === 'Analyst') dbRole = 'ANALYST';
      else dbRole = 'USER';
    }

    const updated = await teamRepository.update(id, { role: dbRole, customRoleId });
    return this._formatTeamMember(updated);
  }

  /**
   * Remove member from team
   */
  async removeMember(id, operatorUserId) {
    const team = await teamRepository.findById(id);
    if (!team) {
      const error = new Error('Không tìm thấy thành viên.');
      error.status = 404;
      throw error;
    }

    const isAuthorized = await this._checkBrandAccess(team.brandId, operatorUserId);
    if (!isAuthorized) {
      const error = new Error('Bạn không có quyền xóa thành viên của thương hiệu này.');
      error.status = 403;
      throw error;
    }

    if (team.brand.ownerId === team.userId) {
      const error = new Error('Không thể xóa chủ sở hữu khỏi thương hiệu.');
      error.status = 400;
      throw error;
    }

    await teamRepository.delete(id);
    return { message: 'Đã xóa thành viên khỏi thương hiệu thành công' };
  }

  // ============= Private Helper Methods =============

  async _checkBrandAccess(brandId, userId) {
    const brand = await prisma.brand.findUnique({
      where: { id: brandId }
    });
    if (!brand) return false;
    if (brand.ownerId === userId) return true;

    const teamMember = await prisma.team.findFirst({
      where: { brandId, userId, status: 'ACTIVE', role: 'ADMIN' }
    });
    return !!teamMember;
  }

  _formatTeamMember(m) {
    return {
      id: m.id,
      userId: m.userId,
      name: m.user.name,
      email: m.user.email,
      avatar: m.user.avatarUrl,
      role: m.customRole ? m.customRole.name : this._formatRoleName(m.role),
      customRole: m.customRole ? {
        id: m.customRole.id,
        name: m.customRole.name,
        colorHex: m.customRole.colorHex
      } : null,
      status: m.status.toLowerCase(),
      joinedDate: m.acceptedAt 
        ? new Date(m.acceptedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) 
        : 'Pending',
      invitedBy: m.invitedBy?.name || 'System'
    };
  }

  _formatRoleName(role) {
    return role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
  }
}

module.exports = new TeamService();
