const autoListService = require('../../services/workspace/auto-list.service');

class AutoListController {
  async getAutoLists(req, res) {
    try {
      const { brandId } = req.query;
      if (!brandId) return res.status(400).json({ message: 'brandId is required' });
      const data = await autoListService.getAutoLists(brandId);
      res.json({ data });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getAutoListDetails(req, res) {
    try {
      const { id } = req.params;
      const data = await autoListService.getAutoListDetails(id);
      res.json({ data });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async createAutoList(req, res) {
    try {
      const { brandId } = req.body;
      if (!brandId) return res.status(400).json({ message: 'brandId is required' });
      const data = await autoListService.createAutoList(brandId, req.body);
      res.status(201).json({ data });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async updateAutoList(req, res) {
    try {
      const { id } = req.params;
      const data = await autoListService.updateAutoList(id, req.body);
      res.json({ data });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async deleteAutoList(req, res) {
    try {
      const { id } = req.params;
      await autoListService.deleteAutoList(id);
      res.json({ message: 'AutoList deleted' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async toggleStatus(req, res) {
    try {
      const { id } = req.params;
      const data = await autoListService.toggleStatus(id);
      res.json({ data });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new AutoListController();
