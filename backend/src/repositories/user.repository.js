const prisma = require('../config/prisma');

class UserRepository {
  async findByEmail(email) {
    return await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      include: { accounts: true, customRole: true }
    });
  }

  async findById(id) {
    return await prisma.user.findUnique({
      where: { id },
      include: { accounts: true, customRole: true }
    });
  }

  async createUser(userData, accountData) {
    return await prisma.user.create({
      data: {
        email: userData.email.toLowerCase(),
        name: userData.name || userData.fullName,
        avatarUrl: userData.avatarUrl,
        role: 'OWNER',
        passwordHash: accountData.passwordHash,
        isActive: userData.isActive !== undefined ? userData.isActive : false,
        isEmailVerified: false,
        accounts: {
          create: accountData
        }
      },
      include: { customRole: true, accounts: true }
    });
  }

  async updateStatus(email, status, verifiedAt) {
    // Map old status to new isEmailVerified and isActive
    const isEmailVerified = status === 'ACTIVE';
    const isActive = status === 'ACTIVE';
    
    return await prisma.user.update({
      where: { email: email.toLowerCase() },
      data: { 
        isEmailVerified,
        isActive,
        updatedAt: new Date()
      },
      include: { customRole: true, accounts: true }
    });
  }

  async updateLocalPassword(email, passwordHash) {
    const normalizedEmail = email.toLowerCase();
    
    return await prisma.user.update({
      where: { email: normalizedEmail },
      data: {
        passwordHash,
        accounts: {
          updateMany: {
            where: { provider: 'LOCAL' },
            data: { passwordHash }
          }
        }
      },
      include: { customRole: true, accounts: true }
    });
  }

  /**
   * Get user with password hash for login
   */
  async findByEmailWithPassword(email) {
    return await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      include: { 
        accounts: true,
        customRole: true
      }
    });
  }

  /**
   * Update user profile
   */
  async updateProfile(userId, profileData) {
    const updateData = {};
    
    // Map old field names to new ones
    if (profileData.fullName) updateData.name = profileData.fullName;
    if (profileData.name) updateData.name = profileData.name;
    if (profileData.avatarUrl !== undefined) updateData.avatarUrl = profileData.avatarUrl;
    if (profileData.phone !== undefined) updateData.phone = profileData.phone;
    if (profileData.address !== undefined) updateData.address = profileData.address;
    if (profileData.industry !== undefined) updateData.industry = profileData.industry;
    if (profileData.bio !== undefined) updateData.bio = profileData.bio;
    if (profileData.language) updateData.language = profileData.language;
    if (profileData.timezone) updateData.timezone = profileData.timezone;
    
    return await prisma.user.update({
      where: { id: userId },
      data: updateData,
      include: { customRole: true, accounts: true }
    });
  }
}

module.exports = new UserRepository();
