const prisma = require('../config/prisma');

class UserRepository {
  async findByEmail(email) {
    return await prisma.user.findUnique({
      where: { email },
      include: { accounts: true, role: true }
    });
  }

  async findById(id) {
    return await prisma.user.findUnique({
      where: { id },
      include: { accounts: true, role: true }
    });
  }

  async createUser(userData, accountData) {
    return await prisma.user.create({
      data: {
        ...userData,
        role: {
          connectOrCreate: {
            where: { name: 'MANAGER' },
            create: { 
              name: 'MANAGER', 
              description: 'Workspace Owner who can manage brands and invite members' 
            }
          }
        },
        accounts: {
          create: accountData
        }
      },
      include: { role: true }
    });
  }

  async updateStatus(email, status, verifiedAt) {
    return await prisma.user.update({
      where: { email },
      data: { status, verifiedAt },
      include: { role: true }
    });
  }

  async updateLocalPassword(email, passwordHash) {
    return await prisma.userAccount.updateMany({
      where: {
        provider: 'LOCAL',
        user: { email }
      },
      data: { passwordHash }
    });
  }

  /**
   * Get user with password hash for login
   */
  async findByEmailWithPassword(email) {
    const user = await prisma.user.findUnique({
      where: { email },
      include: { 
        accounts: true,
        role: true
      }
    });

    if (user && user.accounts && user.accounts.length > 0) {
      // Find LOCAL account for password
      const localAccount = user.accounts.find(acc => acc.provider === 'LOCAL');
      return {
        ...user,
        passwordHash: localAccount?.passwordHash || null
      };
    }

    return user;
  }

  /**
   * Update user profile (fullName, avatarUrl)
   */
  async updateProfile(userId, profileData) {
    return await prisma.user.update({
      where: { id: userId },
      data: profileData
    });
  }
}

module.exports = new UserRepository();
