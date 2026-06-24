const reportService = require('../../services/reports/report.service');
const asyncHandler = require('../../utils/async-handler');

class ReportController {
  /**
   * Fetch all reports for a brand
   */
  getReports = asyncHandler(async (req, res) => {
    const { brandId } = req.query;
    if (!brandId) {
      return res.status(400).json({ message: 'brandId là bắt buộc.' });
    }
    const reports = await reportService.getReportsByBrand(brandId);
    res.json({ reports });
  });

  /**
   * Generate an instant custom report
   */
  generateReport = asyncHandler(async (req, res) => {
    const { brandId } = req.query;
    const userId = req.user?.id;

    if (!brandId) {
      return res.status(400).json({ message: 'brandId là bắt buộc.' });
    }

    if (!userId) {
      return res.status(401).json({ message: 'Không thể xác thực người dùng.' });
    }

    const { title, format, dateRange, platforms, isWhiteLabel, brandLogoUrl, brandColorHex } = req.body;

    if (!title || !format || !dateRange || !platforms || !Array.isArray(platforms) || platforms.length === 0) {
      return res.status(400).json({ message: 'Dữ liệu yêu cầu không hợp lệ. Vui lòng kiểm tra lại.' });
    }

    const report = await reportService.generateInstantReport(brandId, userId, {
      title,
      format,
      dateRange,
      platforms,
      isWhiteLabel,
      brandLogoUrl,
      brandColorHex
    });

    res.status(201).json({ report });
  });

  /**
   * Delete a report
   */
  deleteReport = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { brandId } = req.query;

    if (!brandId) {
      return res.status(400).json({ message: 'brandId là bắt buộc.' });
    }

    await reportService.deleteReport(id, brandId);
    res.json({ message: 'Báo cáo đã được xóa thành công.' });
  });

  /**
   * Get live preview analytics data for interactive templates
   */
  getPreviewData = asyncHandler(async (req, res) => {
    const { brandId, dateRange, platforms } = req.query;
    if (!brandId) {
      return res.status(400).json({ message: 'brandId là bắt buộc.' });
    }

    const platformList = platforms ? platforms.split(',') : ['Facebook', 'YouTube'];
    const data = await reportService.getPreviewData(brandId, dateRange || '30 ngày qua', platformList);
    res.json({ data });
  });
}

module.exports = new ReportController();
