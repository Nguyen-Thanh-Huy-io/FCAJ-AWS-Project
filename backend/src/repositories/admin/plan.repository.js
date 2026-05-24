const prisma = require('../../config/prisma');

/**
 * Plan Repository - Data Access Layer
 * Handles all database operations for Plan model
 * Single Responsibility: Database queries only
 */
class PlanRepository {
  /**
   * Get all plans with their limits
   * @returns {Promise<Array>} plans with limits
   */
  async findAll() {
    return prisma.plan.findMany({
      include: {
        planLimit: true,
        subscriptions: {
          select: {
            id: true,
            userId: true,
            startDate: true,
            endDate: true,
            status: true
          }
        }
      },
      orderBy: { createdAt: 'asc' }
    });
  }

  /**
   * Get plan by ID
   * @param {string} id - plan ID
   * @returns {Promise<Object>} plan with limits
   */
  async findById(id) {
    return prisma.plan.findUnique({
      where: { id },
      include: {
        planLimit: true,
        subscriptions: {
          select: {
            id: true,
            userId: true,
            status: true
          }
        }
      }
    });
  }

  /**
   * Get plan by name and billing cycle
   * @param {string} name - plan name
   * @param {string} billingCycle - MONTHLY or ANNUAL
   * @returns {Promise<Object>} plan
   */
  async findByNameAndCycle(name, billingCycle) {
    return prisma.plan.findUnique({
      where: {
        name_billingCycle: {
          name,
          billingCycle
        }
      },
      include: {
        planLimit: true
      }
    });
  }

  /**
   * Create new plan
   * @param {Object} planData - { name, priceAmount, currency, billingCycle, description, planLimitId }
   * @returns {Promise<Object>} created plan
   */
  async create(planData) {
    return prisma.plan.create({
      data: planData,
      include: {
        planLimit: true
      }
    });
  }

  /**
   * Update plan
   * @param {string} id - plan ID
   * @param {Object} updateData - fields to update
   * @returns {Promise<Object>} updated plan
   */
  async update(id, updateData) {
    return prisma.plan.update({
      where: { id },
      data: updateData,
      include: {
        planLimit: true
      }
    });
  }

  /**
   * Delete plan (soft delete via isActive)
   * @param {string} id - plan ID
   * @returns {Promise<Object>} updated plan
   */
  async delete(id) {
    return prisma.plan.update({
      where: { id },
      data: { isActive: false },
      include: {
        planLimit: true
      }
    });
  }

  /**
   * Get plans by activity status
   * @param {boolean} isActive - true for active plans
   * @returns {Promise<Array>} filtered plans
   */
  async findByStatus(isActive) {
    return prisma.plan.findMany({
      where: { isActive },
      include: {
        planLimit: true
      },
      orderBy: { priceAmount: 'asc' }
    });
  }

  /**
   * Get subscription statistics for a plan
   * @param {string} planId - plan ID
   * @returns {Promise<Object>} subscription stats
   */
  async getSubscriptionStats(planId) {
    const subscriptions = await prisma.subscription.findMany({
      where: { planId },
      include: { user: { select: { id: true, email: true } } }
    });

    return {
      total: subscriptions.length,
      active: subscriptions.filter(s => s.status === 'ACTIVE').length,
      expired: subscriptions.filter(s => s.status === 'EXPIRED').length,
      cancelled: subscriptions.filter(s => s.status === 'CANCELLED').length,
      subscriptions
    };
  }
}

module.exports = new PlanRepository();
