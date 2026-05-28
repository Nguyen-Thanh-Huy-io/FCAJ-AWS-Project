const socialAccountRepository = require('../../repositories/social/social-account.repository');
const { ANALYTICS } = require('../../utils/constants');

/**
 * Tạo một ES6 Proxy bọc quanh các Social Analytics Service để tối ưu hóa việc gọi API bằng cơ chế Caching.
 * Nếu tài khoản vừa được đồng bộ trong vòng COOLDOWN_HOURS giờ, trả về trực tiếp dữ liệu từ DB.
 * 
 * @param {object} realService - Social Analytics Service thật (ví dụ: facebook-analytics.service)
 * @returns {Proxy}
 */
function createSyncCacheProxy(realService) {
  return new Proxy(realService, {
    get(target, prop, receiver) {
      if (prop === 'syncChannelMetrics') {
        return async function (socialAccountId, startDate, endDate, force = false) {
          const account = await socialAccountRepository.findById(socialAccountId);
          if (!account) {
            throw new Error('Social account not found');
          }

          // Kiểm tra xem có yêu cầu bắt buộc (force refresh) hay không
          if (force) {
            console.log(`[SyncCacheProxy] Force refresh requested. Skipping cooldown for account ${socialAccountId} (${account.platform})...`);
            return target.syncChannelMetrics(socialAccountId, startDate, endDate);
          }

          // Tính toán Cooldown
          const cooldownMs = ANALYTICS.COOLDOWN_HOURS * 60 * 60 * 1000;
          const lastSync = account.lastSyncAt ? new Date(account.lastSyncAt).getTime() : 0;
          const hasCooldownPassed = Date.now() - lastSync >= cooldownMs;

          if (!hasCooldownPassed) {
            console.log(`[SyncCacheProxy] Serving cached data for account ${socialAccountId} (${account.platform}). Cooldown active until ${new Date(lastSync + cooldownMs).toLocaleString()}`);
            return account; // findById đã chứa thông tin tài khoản kèm analytics mới nhất trong DB
          }

          console.log(`[SyncCacheProxy] Cooldown passed. Triggering real sync for account ${socialAccountId} (${account.platform})...`);
          return target.syncChannelMetrics(socialAccountId, startDate, endDate);
        };
      }
      return Reflect.get(target, prop, receiver);
    }
  });
}

module.exports = createSyncCacheProxy;
