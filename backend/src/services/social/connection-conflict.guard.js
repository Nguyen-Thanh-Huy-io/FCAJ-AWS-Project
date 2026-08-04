const prisma = require('../../config/prisma');
const logger = require('../../utils/logger');

class ConnectionConflictError extends Error {
  constructor(type, channelName, platformAccountId, platform, existingBrandName) {
    super(`Conflict: Social account is already connected`);
    this.name = 'ConnectionConflictError';
    this.type = type; // 'DIFFERENT_OWNER' | 'SAME_OWNER'
    this.channelName = channelName;
    this.platformAccountId = platformAccountId;
    this.platform = platform;
    this.existingBrandName = existingBrandName;
  }
}

class ConnectionConflictGuard {
  /**
   * Check if a social account connection conflicts with an existing one.
   * 
   * @param {string} targetBrandId - The brand ID the user wants to connect the channel to.
   * @param {string} platform - The platform name (e.g., 'YOUTUBE', 'FACEBOOK', 'TIKTOK').
   * @param {string} platformAccountId - The unique ID of the channel/page from the platform.
   * @returns {Promise<{conflict: boolean, type?: 'DIFFERENT_OWNER'|'SAME_OWNER', existingAccount?: object}>}
   */
  async validateConflict(targetBrandId, platform, platformAccountId) {
    logger.debug('[ConflictGuard] Validating social connection', { targetBrandId, platform, platformAccountId });

    // 1. Fetch the target brand to identify its owner
    const targetBrand = await prisma.brand.findFirst({
      where: { id: targetBrandId, deletedAt: null }
    });

    if (!targetBrand) {
      throw new Error('Target brand not found or has been deleted');
    }

    // 2. Query for any existing active social accounts for the same platform and account ID
    const existingAccount = await prisma.socialAccount.findFirst({
      where: {
        platform,
        platformAccountId,
        isConnected: true
      },
      include: {
        brand: true
      }
    });

    if (!existingAccount) {
      logger.debug('[ConflictGuard] No conflict detected.');
      return { conflict: false };
    }

    // If it's already connected to the target brand itself, it's a simple reconnect/update token (No Conflict)
    if (existingAccount.brandId === targetBrandId) {
      logger.debug('[ConflictGuard] Channel already belongs to target brand. Reconnecting/updating token.');
      return { conflict: false };
    }

    const isSameOwner = existingAccount.brand.ownerId === targetBrand.ownerId;

    if (isSameOwner) {
      logger.warn('[ConflictGuard] Conflict detected: Channel belongs to another brand of the SAME owner', {
        existingBrandId: existingAccount.brandId,
        targetBrandId
      });
      return {
        conflict: true,
        type: 'SAME_OWNER',
        existingAccount
      };
    } else {
      logger.warn('[ConflictGuard] Conflict detected: Channel belongs to a different owner/workspace', {
        existingBrandOwnerId: existingAccount.brand.ownerId,
        targetBrandOwnerId: targetBrand.ownerId
      });
      return {
        conflict: true,
        type: 'DIFFERENT_OWNER',
        existingAccount
      };
    }
  }

  /**
   * Reassign a social account to a new brand.
   * Assumes verification of ownership was already done.
   */
  async reassignAccount(platform, platformAccountId, targetBrandId) {
    logger.info('[ConflictGuard] Reassigning social account', { platform, platformAccountId, targetBrandId });

    // Get the target brand's owner to verify authorization
    const targetBrand = await prisma.brand.findFirst({
      where: { id: targetBrandId, deletedAt: null }
    });

    if (!targetBrand) {
      throw new Error('Target brand not found');
    }

    // Find the existing active account
    const existingAccount = await prisma.socialAccount.findFirst({
      where: {
        platform,
        platformAccountId,
        isConnected: true
      },
      include: {
        brand: true
      }
    });

    if (!existingAccount) {
      throw new Error('Social account not found or not connected');
    }

    // Security check: Must have the same owner to allow reassignment
    if (existingAccount.brand.ownerId !== targetBrand.ownerId) {
      throw new Error('Unauthorized reassignment: Brands belong to different owners');
    }

    // Execute reassignment
    // Note: We update the brandId and also the associated model records if needed (Prisma cascading or updates)
    // Actually, in prisma, socialAccount has brandId. Moving it just updates the brandId.
    // Also, we should move the associated analytics records for this social account, but analytics references socialAccountId,
    // which remains the same! So moving the brandId on socialAccount is enough.
    // Let's also check if analytics have brandId. Yes, analytics table has brandId. Let's update analytics brandId too.
    
    await prisma.$transaction(async (tx) => {
      // 1. Update SocialAccount's brandId
      await tx.socialAccount.update({
        where: { id: existingAccount.id },
        data: {
          brandId: targetBrandId,
          updatedAt: new Date()
        }
      });

      // 2. Update all associated Analytics brandId
      await tx.analytics.updateMany({
        where: { socialAccountId: existingAccount.id },
        data: {
          brandId: targetBrandId
        }
      });
    });

    logger.info('[ConflictGuard] Reassignment successful', { accountId: existingAccount.id, oldBrandId: existingAccount.brandId, newBrandId: targetBrandId });
    return existingAccount;
  }
}

module.exports = {
  ConnectionConflictGuard: new ConnectionConflictGuard(),
  ConnectionConflictError
};
