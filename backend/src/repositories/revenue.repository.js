const prisma = require('../config/prisma');

class RevenueRepository {
  /**
   * Get subscription counts by plan
   */
  async getSubscriptionCounts() {
    const activeSubs = await prisma.subscription.groupBy({
      by: ['planId'],
      where: { status: 'ACTIVE' },
      _count: { _all: true }
    });
    return activeSubs;
  }

  /**
   * Get recent transactions (Invoices)
   */
  async getRecentInvoices(limit = 10) {
    return await prisma.invoice.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        subscription: {
          include: {
            plan: true,
            brand: {
              include: {
                owner: {
                  select: { name: true, email: true }
                }
              }
            }
          }
        }
      }
    });
  }

  /**
   * Get revenue aggregation for MRR calculation
   */
  async getActiveSubscriptionRevenue() {
    return await prisma.subscription.findMany({
      where: { status: 'ACTIVE' },
      include: {
        plan: {
          select: { priceAmount: true, billingCycle: true }
        }
      }
    });
  }
}

module.exports = new RevenueRepository();
