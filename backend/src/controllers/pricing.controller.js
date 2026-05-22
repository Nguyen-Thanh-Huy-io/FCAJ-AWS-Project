const pricingService = require('../services/pricing.service');

/**
 * PricingController - HTTP Request Handler Layer
 * Single Responsibility: Handle HTTP requests/responses
 * Dependency Injection: Receives service as dependency
 */
class PricingController {
  /**
   * GET /admin/pricing
   * Get all pricing plans
   */
  async getPricingPlans(req, res) {
    try {
      const data = await pricingService.getAllPricingPlans();
      
      res.status(200).json({
        message: 'Pricing plans retrieved successfully',
        data
      });
    } catch (error) {
      res.status(error.status || 500).json({
        message: error.message || 'Failed to retrieve pricing plans'
      });
    }
  }

  /**
   * GET /admin/pricing/:planId
   * Get single plan details
   */
  async getPlanDetails(req, res) {
    try {
      const { planId } = req.params;

      if (!planId || !planId.trim()) {
        return res.status(400).json({ message: 'Plan ID is required' });
      }

      const plan = await pricingService.getPlanDetails(planId);
      
      res.status(200).json({
        message: 'Plan details retrieved successfully',
        data: plan
      });
    } catch (error) {
      const statusCode = error.status || 500;
      res.status(statusCode).json({
        message: error.message || 'Failed to retrieve plan details'
      });
    }
  }

  /**
   * POST /admin/pricing
   * Create new plan
   */
  async createPlan(req, res) {
    try {
      const { name, priceAmount, currency, billingCycle, description, planLimitId } = req.body;

      const plan = await pricingService.createPlan({
        name,
        priceAmount,
        currency,
        billingCycle,
        description,
        planLimitId
      });

      res.status(201).json({
        message: 'Plan created successfully',
        data: plan
      });
    } catch (error) {
      const statusCode = error.status || 500;
      res.status(statusCode).json({
        message: error.message || 'Failed to create plan'
      });
    }
  }

  /**
   * PATCH /admin/pricing/:planId
   * Update plan
   */
  async updatePlan(req, res) {
    try {
      const { planId } = req.params;
      const updateData = req.body;

      if (!planId || !planId.trim()) {
        return res.status(400).json({ message: 'Plan ID is required' });
      }

      if (!updateData || Object.keys(updateData).length === 0) {
        return res.status(400).json({ message: 'No data to update' });
      }

      const plan = await pricingService.updatePlan(planId, updateData);

      res.status(200).json({
        message: 'Plan updated successfully',
        data: plan
      });
    } catch (error) {
      const statusCode = error.status || 500;
      res.status(statusCode).json({
        message: error.message || 'Failed to update plan'
      });
    }
  }

  /**
   * DELETE /admin/pricing/:planId
   * Deactivate plan
   */
  async deactivatePlan(req, res) {
    try {
      const { planId } = req.params;

      if (!planId || !planId.trim()) {
        return res.status(400).json({ message: 'Plan ID is required' });
      }

      const plan = await pricingService.deactivatePlan(planId);

      res.status(200).json({
        message: 'Plan deactivated successfully',
        data: plan
      });
    } catch (error) {
      const statusCode = error.status || 500;
      res.status(statusCode).json({
        message: error.message || 'Failed to deactivate plan'
      });
    }
  }

  /**
   * GET /admin/pricing/analytics/revenue
   * Get pricing analytics and revenue stats
   */
  async getPricingAnalytics(req, res) {
    try {
      const analytics = await pricingService.getPricingAnalytics();

      res.status(200).json({
        message: 'Pricing analytics retrieved successfully',
        data: analytics
      });
    } catch (error) {
      res.status(error.status || 500).json({
        message: error.message || 'Failed to retrieve pricing analytics'
      });
    }
  }
}

module.exports = new PricingController();
