/**
 * FacebookCompetitorService
 * Xử lý toàn bộ logic liên quan đến Competitor tracking cho Facebook Pages.
 *
 * Flow:
 *  searchPages()  → Gateway.searchFacebookPages (Graph API /search)
 *  addCompetitor() → Gateway.getPublicPageInfo → competitorRepository.upsert
 *  getCompetitors() → competitorRepository.getCompetitors
 *  deleteCompetitor() → competitorRepository.deleteCompetitor
 *
 * SOLID compliance:
 *  - SRP: chỉ chịu trách nhiệm về competitor logic (tách khỏi analytics)
 *  - OCP: mở rộng bằng cách thêm method mới, không sửa cũ
 *  - DIP: inject gateway và repository qua require (có thể mock trong test)
 */
const facebookGateway = require('./facebook.gateway');
const competitorRepository = require('../../../repositories/social/competitor.repository');
const socialAccountRepository = require('../../../repositories/social/social-account.repository');
const { PLATFORMS } = require('../../../utils/constants');

const PLATFORM = PLATFORMS.FACEBOOK;

class FacebookCompetitorService {
  /**
   * Lấy App Access Token từ App credentials.
   * App Access Token = APP_ID|APP_SECRET (không cần user login).
   */
  _getAppAccessToken() {
    const appId = process.env.FACEBOOK_APP_ID;
    const appSecret = process.env.FACEBOOK_APP_SECRET;
    if (!appId || !appSecret) {
      throw new Error('FACEBOOK_APP_ID or FACEBOOK_APP_SECRET is not configured');
    }
    return `${appId}|${appSecret}`;
  }

  /**
   * Lấy access token bất kỳ từ social account của brand (dùng để search nếu cần user token).
   * Fallback về App Access Token nếu không có user account.
   */
  async _resolveAccessToken(brandId) {
    try {
      const account = await socialAccountRepository.findByBrandAndPlatform(brandId, PLATFORM);
      if (account?.accessToken && !account.accessToken.startsWith('mock-')) {
        return account.accessToken;
      }
    } catch (_) { /* ignore */ }
    return this._getAppAccessToken();
  }

  /**
   * Tìm kiếm Facebook Pages công khai.
   * @param {string} brandId
   * @param {string} query
   * @returns {Array<{pageId, title, thumbnail, followersCount, category}>}
   */
  async searchPages(brandId, query) {
    if (!query || query.trim().length < 2) {
      return [];
    }
    const accessToken = await this._resolveAccessToken(brandId);
    return facebookGateway.searchFacebookPages(accessToken, query.trim());
  }

  /**
   * Thêm một Facebook Page làm competitor.
   * Tự động fetch thông tin page từ Graph API rồi lưu vào DB.
   * @param {string} brandId
   * @param {string} pageId - Facebook Page ID
   * @returns {Object} Competitor record
   */
  async addCompetitor(brandId, pageId) {
    if (!brandId || !pageId) {
      throw new Error('brandId and pageId are required');
    }

    const accessToken = await this._resolveAccessToken(brandId);
    const pageInfo = await facebookGateway.getPublicPageInfo(pageId, accessToken);

    const competitorData = {
      competitorHandle:      pageInfo.pageId,
      competitorDisplayName: pageInfo.displayName,
      competitorAvatarUrl:   pageInfo.avatarUrl,
      competitorProfileUrl:  pageInfo.profileUrl,
      followersCount:        pageInfo.followersCount,
    };

    // upsert: nếu đã có thì cập nhật, chưa có thì tạo mới
    return competitorRepository.upsertCompetitor(brandId, PLATFORM, competitorData);
  }

  /**
   * Lấy danh sách tất cả competitors của brand trên Facebook.
   * @param {string} brandId
   * @returns {Array}
   */
  async getCompetitors(brandId) {
    return competitorRepository.getCompetitors(brandId, PLATFORM);
  }

  /**
   * Xoá competitor theo id.
   * @param {string} id
   */
  async deleteCompetitor(id) {
    return competitorRepository.deleteCompetitor(id);
  }
}

module.exports = new FacebookCompetitorService();
