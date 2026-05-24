const prisma = require('../../config/prisma');

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

  async findByProviderId(provider, providerId) {
    return await prisma.user.findFirst({
      where: {
        accounts: {
          some: {
            provider,
            providerId
          }
        }
      },
      include: { accounts: true, customRole: true }
    });
  }

  async updateProfile(userId, updateData) {
    return await prisma.user.update({
      where: { id: userId },
      data: updateData,
      include: { customRole: true, accounts: true }
    });
  }

  async upsertSocialUser(userData, accountData) {
    const { email, name, avatarUrl } = userData;
    const { provider, providerId } = accountData;

    // Try to find user by email first to link accounts
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      include: { accounts: true }
    });

    if (existingUser) {
      // Check if this provider account already exists
      const existingAccount = existingUser.accounts.find(acc => acc.provider === provider);
      
      if (!existingAccount) {
        // Link new social account to existing user
        await prisma.userAccount.create({
          data: {
            userId: existingUser.id,
            provider,
            providerId,
            lastLoginAt: new Date()
          }
        });
      } else {
        // Update existing account's lastLoginAt
        await prisma.userAccount.update({
          where: { id: existingAccount.id },
          data: { lastLoginAt: new Date() }
        });
      }

      // Update profile info if missing
      const user = await prisma.user.update({
        where: { id: existingUser.id },
        data: {
          name: existingUser.name || name,
          avatarUrl: existingUser.avatarUrl || avatarUrl,
          isActive: true,
          isEmailVerified: true,
          lastLoginAt: new Date()
        },
        include: { accounts: true, customRole: true }
      });

      return { user, isNew: false };
    }

    // Create new user if not exists
    const newUser = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        name: name,
        avatarUrl: avatarUrl,
        passwordHash: 'SOCIAL_AUTH_NO_PASSWORD',
        role: 'OWNER',
        isActive: true,
        isEmailVerified: true,
        lastLoginAt: new Date(),
        accounts: {
          create: {
            provider,
            providerId,
            lastLoginAt: new Date()
          }
        }
      },
      include: { accounts: true, customRole: true }
    });

    return { user: newUser, isNew: true };
  }
}

module.exports = new UserRepository();
