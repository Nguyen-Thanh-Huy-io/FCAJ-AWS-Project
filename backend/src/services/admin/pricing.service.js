const planRepository = require('../../repositories/admin/plan.repository');
const planLimitRepository = require('../../repositories/admin/plan-limit.repository');
const { ERROR_MESSAGES } = require('../../utils/constants');

/**
 * PricingService - Business Logic Layer
 * Handles pricing logic and validates business rules
 * Single Responsibility: Business rules and validation
 * Open/Closed: Easy to extend with new pricing strategies
 */
class PricingService {
  /**
   * Get all pricing plans for admin dashboard
   * @returns {Promise<Object>} formatted pricing data
   */
  async getAllPricingPlans() {
    const plans = await planRepository.findAll();
    
    if (!plans || plans.length === 0) {
      return {
        plans: [],
        summary: {
          totalPlans: 0,
          activePlans: 0,
          inactivePlans: 0,
          totalSubscriptions: 0
        }
      };
    }

    // Format plans with calculated stats
    const formattedPlans = plans.map(plan => ({
      id: plan.id,
      name: plan.name,
      price: {
        amount: parseFloat(plan.priceAmount),
        currency: plan.currency
      },
      billingCycle: plan.billingCycle,
      description: plan.description,
      isActive: plan.isActive,
      limits: this._formatPlanLimit(plan.planLimit),
      subscriptionCount: plan.subscriptions?.length || 0,
      createdAt: plan.createdAt
    }));

    // Calculate summary statistics
    const summary = {
      totalPlans: formattedPlans.length,
      activePlans: formattedPlans.filter(p => p.isActive).length,
      inactivePlans: formattedPlans.filter(p => !p.isActive).length,
      totalSubscriptions: formattedPlans.reduce((sum, p) => sum + p.subscriptionCount, 0)
    };

    return {
      plans: formattedPlans,
      summary
    };
  }

  /**
   * Get single plan details
   * @param {string} planId - plan ID
   * @returns {Promise<Object>} plan with detailed info
   */
  async getPlanDetails(planId) {
    const plan = await planRepository.findById(planId);
    
    if (!plan) {
      const error = new Error('Plan not found');
      error.status = 404;
      throw error;
    }

    const stats = await planRepository.getSubscriptionStats(planId);

    return {
      id: plan.id,
      name: plan.name,
      price: {
        amount: parseFloat(plan.priceAmount),
        currency: plan.currency
      },
      billingCycle: plan.billingCycle,
      description: plan.description,
      isActive: plan.isActive,
      limits: this._formatPlanLimit(plan.planLimit),
      subscriptionStats: stats,
      createdAt: plan.createdAt
    };
  }

  /**
   * Create new pricing plan
   * @param {Object} planData - { name, priceAmount, currency, billingCycle, description, planLimitId }
   * @returns {Promise<Object>} created plan
   */
  async createPlan(planData) {
    // Validate input
    this._validatePlanData(planData);

    // Check if plan already exists
    const existingPlan = await planRepository.findByNameAndCycle(
      planData.name,
      planData.billingCycle
    );

    if (existingPlan) {
      const error = new Error(`Plan "${planData.name}" for ${planData.billingCycle} already exists`);
      error.status = 409;
      throw error;
    }

    // Verify plan limit exists
    const planLimit = await planLimitRepository.findById(planData.planLimitId);
    if (!planLimit) {
      const error = new Error('Plan limit not found');
      error.status = 400;
      throw error;
    }

    // Create plan
    const createdPlan = await planRepository.create({
      name: planData.name,
      priceAmount: parseFloat(planData.priceAmount),
      currency: planData.currency,
      billingCycle: planData.billingCycle,
      description: planData.description || null,
      planLimitId: planData.planLimitId,
      isActive: true
    });

    return this._formatPlanResponse(createdPlan);
  }

  /**
   * Update pricing plan
   * @param {string} planId - plan ID
   * @param {Object} updateData - fields to update
   * @returns {Promise<Object>} updated plan
   */
  async updatePlan(planId, updateData) {
    // Verify plan exists
    const plan = await planRepository.findById(planId);
    if (!plan) {
      const error = new Error('Plan not found');
      error.status = 404;
      throw error;
    }

    // Validate price if being updated
    if (updateData.priceAmount !== undefined) {
      if (updateData.priceAmount < 0) {
        const error = new Error('Price must be greater than or equal to 0');
        error.status = 400;
        throw error;
      }
      updateData.priceAmount = parseFloat(updateData.priceAmount);
    }

    // Validate plan limit if being changed
    if (updateData.planLimitId) {
      const planLimit = await planLimitRepository.findById(updateData.planLimitId);
      if (!planLimit) {
        const error = new Error('Plan limit not found');
        error.status = 400;
        throw error;
      }
    }

    // Update plan
    const updatedPlan = await planRepository.update(planId, updateData);
    return this._formatPlanResponse(updatedPlan);
  }

  /**
   * Deactivate plan
   * @param {string} planId - plan ID
   * @returns {Promise<Object>} deactivated plan
   */
  async deactivatePlan(planId) {
    const plan = await planRepository.findById(planId);
    if (!plan) {
      const error = new Error('Plan not found');
      error.status = 404;
      throw error;
    }

    if (!plan.isActive) {
      const error = new Error('Plan is already deactivated');
      error.status = 400;
      throw error;
    }

    return planRepository.delete(planId);
  }

  /**
   * Get pricing analytics and revenue stats
   * @returns {Promise<Object>} analytics data
   */
  async getPricingAnalytics() {
    const plans = await planRepository.findAll();
    
    const analytics = {
      monthlyRevenue: 0,
      annualRevenue: 0,
      subscriptionsByPlan: {},
      revenueByPlan: {}
    };

    for (const plan of plans) {
      if (!plan.isActive) continue;

      const subscriptionCount = plan.subscriptions?.length || 0;
      const planPrice = parseFloat(plan.priceAmount);
      
      analytics.subscriptionsByPlan[plan.name] = subscriptionCount;

      if (plan.billingCycle === 'MONTHLY') {
        analytics.monthlyRevenue += planPrice * subscriptionCount;
        analytics.revenueByPlan[plan.name] = {
          monthly: planPrice * subscriptionCount,
          annual: (planPrice * 12) * subscriptionCount
        };
      } else if (plan.billingCycle === 'ANNUAL') {
        analytics.annualRevenue += planPrice * subscriptionCount;
        analytics.revenueByPlan[plan.name] = {
          monthly: (planPrice / 12) * subscriptionCount,
          annual: planPrice * subscriptionCount
        };
      }
    }

    return analytics;
  }

  /**
   * Get all plan limits for selection when creating/editing plans
   * @returns {Promise<Array>} plan limits
   */
  async getAllPlanLimits() {
    return await planLimitRepository.findAll();
  }

  // ============= Private Helper Methods =============

  /**
   * Format plan limit object
   * @private
   */
  _formatPlanLimit(limit) {
    return {
      maxBrands: limit.maxBrands,
      maxSocialProfiles: limit.maxSocialProfiles,
      maxPostsPerMonth: limit.maxPostsPerMonth,
      maxLivePlatforms: limit.maxLivePlatforms,
      maxStreamQuality: limit.maxStreamQuality,
      maxTeamSeats: limit.maxTeamSeats,
      allowCustomRoles: limit.allowCustomRoles,
      allowApprovalWorkflow: limit.allowApprovalWorkflow
    };
  }

  /**
   * Format plan response
   * @private
   */
  _formatPlanResponse(plan) {
    return {
      id: plan.id,
      name: plan.name,
      price: {
        amount: parseFloat(plan.priceAmount),
        currency: plan.currency
      },
      billingCycle: plan.billingCycle,
      description: plan.description,
      isActive: plan.isActive,
      limits: this._formatPlanLimit(plan.planLimit),
      createdAt: plan.createdAt
    };
  }

  /**
   * Validate plan data
   * @private
   */
  _validatePlanData(data) {
    if (!data.name || !data.name.trim()) {
      throw new Error('Plan name is required');
    }

    if (data.priceAmount === undefined || data.priceAmount === null) {
      throw new Error('Price amount is required');
    }

    if (typeof data.priceAmount !== 'number' && isNaN(parseFloat(data.priceAmount))) {
      throw new Error('Price amount must be a valid number');
    }

    if (parseFloat(data.priceAmount) < 0) {
      throw new Error('Price amount must be greater than or equal to 0');
    }

    if (!data.currency || !data.currency.trim()) {
      throw new Error('Currency is required');
    }

    if (!data.billingCycle) {
      throw new Error('Billing cycle is required');
    }

    const validCycles = ['MONTHLY', 'ANNUAL'];
    if (!validCycles.includes(data.billingCycle.toUpperCase())) {
      throw new Error(`Billing cycle must be one of: ${validCycles.join(', ')}`);
    }

    if (!data.planLimitId) {
      throw new Error('Plan limit ID is required');
    }
  }
}

module.exports = new PricingService();
