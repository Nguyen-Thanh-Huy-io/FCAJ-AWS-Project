const prisma = require('../../config/prisma');

class OwnerStrategy {
  async canAccess(userId, brandId) {
    const brand = await prisma.brand.findFirst({
      where: { id: brandId, ownerId: userId, deletedAt: null }
    });
    return !!brand;
  }
}

class DefaultRoleStrategy {
  constructor() {
    this.matrix = {
      ADMIN: {
        VIEW_ANALYTICS: true,
        CREATE_POSTS: true,
        APPROVE_POSTS: true,
        MANAGE_CONNECTIONS: true,
        MANAGE_TEAM: true,
        MANAGE_ROLES: true,
      },
      USER: { // USER represents Member
        VIEW_ANALYTICS: true,
        CREATE_POSTS: true,
        APPROVE_POSTS: false,
        MANAGE_CONNECTIONS: false,
        MANAGE_TEAM: false,
        MANAGE_ROLES: false,
      },
      ANALYST: {
        VIEW_ANALYTICS: true,
        CREATE_POSTS: false,
        APPROVE_POSTS: false,
        MANAGE_CONNECTIONS: false,
        MANAGE_TEAM: false,
        MANAGE_ROLES: false,
      }
    };
  }

  async canAccess(role, permissionKey) {
    const rolePermissions = this.matrix[role];
    if (!rolePermissions) return false;
    return !!rolePermissions[permissionKey];
  }
}

class CustomRoleStrategy {
  async canAccess(customRoleId, permissionKey) {
    if (!customRoleId) return false;
    const permission = await prisma.customRolePermission.findUnique({
      where: {
        roleId_permissionKey: {
          roleId: customRoleId,
          permissionKey
        }
      }
    });
    return permission ? permission.isAllowed : false;
  }
}

class AuthorizationFacade {
  constructor() {
    this.ownerStrategy = new OwnerStrategy();
    this.defaultRoleStrategy = new DefaultRoleStrategy();
    this.customRoleStrategy = new CustomRoleStrategy();
  }

  /**
   * Check if a user has a specific permission in a brand
   */
  async checkPermission(userId, brandId, permissionKey) {
    if (!userId || !brandId || !permissionKey) {
      return false;
    }

    // 1. Owner Strategy: Check if user is the brand owner
    const isOwner = await this.ownerStrategy.canAccess(userId, brandId);
    if (isOwner) {
      return true;
    }

    // 2. Fetch the user's membership in the brand
    const membership = await prisma.team.findUnique({
      where: {
        brandId_userId: { brandId, userId }
      }
    });

    if (!membership || membership.status !== 'ACTIVE') {
      return false;
    }

    // 3. Custom Role Strategy
    if (membership.customRoleId) {
      return this.customRoleStrategy.canAccess(membership.customRoleId, permissionKey);
    }

    // 4. Default Role Strategy
    return this.defaultRoleStrategy.canAccess(membership.role, permissionKey);
  }

  /**
   * Alias for checkPermission
   */
  async hasPermission(userId, brandId, permissionKey) {
    return this.checkPermission(userId, brandId, permissionKey);
  }

  /**
   * Check if a user has access to a brand (is owner or active member)
   */
  async checkBrandAccess(userId, brandId) {
    if (!userId || !brandId) return false;
    
    // Check if owner
    const isOwner = await this.ownerStrategy.canAccess(userId, brandId);
    if (isOwner) return true;

    // Check membership
    const membership = await prisma.team.findUnique({
      where: {
        brandId_userId: { brandId, userId }
      }
    });

    return !!membership && membership.status === 'ACTIVE';
  }
}

module.exports = new AuthorizationFacade();
