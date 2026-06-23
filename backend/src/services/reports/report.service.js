const fs = require('fs');
const path = require('path');
const reportRepository = require('../../repositories/workspace/report.repository');
const analyticsFacade = require('./analytics.facade');
const reportStrategyFactory = require('./strategies/report-strategy.factory');
const prisma = require('../../config/prisma');
const { REPORT_FORMATS, REPORT_FREQUENCIES } = require('../../utils/constants');

class ReportService {
  /**
   * Helper to parse date range strings from UI to Date objects
   * @param {string} dateRangeStr 
   * @returns {{dateFrom: Date, dateTo: Date}}
   */
  parseDateRange(dateRangeStr) {
    const dateTo = new Date();
    let dateFrom = new Date();

    switch (dateRangeStr) {
      case 'Tháng này':
        dateFrom.setDate(1);
        dateFrom.setHours(0, 0, 0, 0);
        break;
      case 'Tháng trước':
        dateFrom.setMonth(dateFrom.getMonth() - 1);
        dateFrom.setDate(1);
        dateFrom.setHours(0, 0, 0, 0);
        
        dateTo.setDate(0); // Last day of previous month
        dateTo.setHours(23, 59, 59, 999);
        break;
      case '7 ngày qua':
        dateFrom.setDate(dateTo.getDate() - 7);
        dateFrom.setHours(0, 0, 0, 0);
        break;
      case '30 ngày qua':
      default:
        dateFrom.setDate(dateTo.getDate() - 30);
        dateFrom.setHours(0, 0, 0, 0);
        break;
    }

    return { dateFrom, dateTo };
  }

  /**
   * Generate an instant custom report
   * @param {string} brandId 
   * @param {string} userId 
   * @param {Object} payload 
   */
  async generateInstantReport(brandId, userId, payload) {
    const { title, format, dateRange, platforms, isWhiteLabel, brandLogoUrl, brandColorHex } = payload;

    // 1. Fetch Brand Info
    const brand = await prisma.brand.findUnique({
      where: { id: brandId }
    });

    if (!brand) {
      throw new Error('Thương hiệu không tồn tại.');
    }

    // 2. Parse date range
    const { dateFrom, dateTo } = this.parseDateRange(dateRange);

    // 3. Get aggregated analytics data via Facade
    const aggregatedData = await analyticsFacade.getAggregatedData(
      brandId, 
      dateFrom, 
      dateTo, 
      platforms
    );

    // 4. Get generator strategy via Factory
    const strategy = reportStrategyFactory.getStrategy(format);

    // 5. Generate file buffer
    const { buffer, contentType, extension } = await strategy.generate(
      title,
      brand,
      aggregatedData,
      {
        isWhiteLabel,
        brandLogoUrl,
        brandColorHex
      }
    );

    // 6. Ensure upload directory exists and save file
    const reportsDir = path.join(__dirname, '../../../uploads/reports');
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }

    const fileName = `report_${brandId}_${Date.now()}.${extension}`;
    const filePath = path.join(reportsDir, fileName);
    fs.writeFileSync(filePath, buffer);

    // Calculate file size string
    const sizeInKb = Math.round(buffer.length / 1024);
    const sizeStr = sizeInKb > 1000 ? `${(sizeInKb / 1024).toFixed(1)} MB` : `${sizeInKb} KB`;

    // 7. Save Report Record to Database
    const dbFormat = format === 'Excel' ? REPORT_FORMATS.CSV : format;

    const reportRecord = await reportRepository.create({
      brandId,
      createdByUserId: userId,
      title,
      description: `Báo cáo phân tích dữ liệu khoảng thời gian: ${dateRange}.`,
      dateFrom,
      dateTo,
      includedPlatforms: JSON.stringify(platforms),
      includedSections: JSON.stringify(['Overview', 'Channels', 'TopPosts']),
      isWhiteLabel: !!isWhiteLabel,
      brandLogoUrl: brandLogoUrl || null,
      brandColorHex: brandColorHex || null,
      format: dbFormat,
      fileUrl: `/uploads/reports/${fileName}`,
      generatedAt: new Date()
    });

    // Add virtual file size to record for UI convenience
    return {
      ...reportRecord,
      size: sizeStr
    };
  }

  /**
   * Fetch all reports for a brand
   * @param {string} brandId 
   */
  async getReportsByBrand(brandId) {
    const reports = await reportRepository.findManyByBrand(brandId);
    
    // Enrich with file size and process formats
    return reports.map(r => {
      const reportsDir = path.join(__dirname, '../../../uploads/reports');
      let sizeStr = 'Unknown';
      if (r.fileUrl) {
        const fileName = path.basename(r.fileUrl);
        const filePath = path.join(reportsDir, fileName);
        if (fs.existsSync(filePath)) {
          const stats = fs.statSync(filePath);
          const sizeInKb = Math.round(stats.size / 1024);
          sizeStr = sizeInKb > 1000 ? `${(sizeInKb / 1024).toFixed(1)} MB` : `${sizeInKb} KB`;
        }
      }
      
      let platforms = [];
      try {
        platforms = JSON.parse(r.includedPlatforms);
      } catch (e) {
        platforms = [r.includedPlatforms];
      }

      return {
        id: r.id,
        title: r.title,
        type: r.format === REPORT_FORMATS.CSV ? 'Excel' : r.format, // Match frontend type
        size: sizeStr,
        date: r.generatedAt ? new Date(r.generatedAt).toLocaleDateString('vi-VN') : new Date(r.createdAt).toLocaleDateString('vi-VN'),
        creator: r.creator?.name || 'Hệ thống',
        downloads: 0,
        platforms,
        fileUrl: r.fileUrl
      };
    });
  }

  /**
   * Delete a report
   * @param {string} id 
   * @param {string} brandId 
   */
  async deleteReport(id, brandId) {
    const report = await reportRepository.findById(id);
    if (!report) {
      throw new Error('Báo cáo không tồn tại.');
    }

    if (report.brandId !== brandId) {
      throw new Error('Bạn không có quyền xóa báo cáo này.');
    }

    // Delete physical file
    if (report.fileUrl) {
      const reportsDir = path.join(__dirname, '../../../uploads/reports');
      const fileName = path.basename(report.fileUrl);
      const filePath = path.join(reportsDir, fileName);
      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
        } catch (e) {
          console.error(`[ReportService] Error deleting physical file ${filePath}:`, e);
        }
      }
    }

    // Delete record from DB
    await reportRepository.delete(id);
    return true;
  }
}

const reportService = new ReportService();
module.exports = reportService;
