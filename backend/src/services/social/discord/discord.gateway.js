const { DISCORD_API } = require('../../../utils/constants');

class DiscordGateway {
  // ─── Private helper ────────────────────────────────────────────────────────

  _botHeaders() {
    const botToken = process.env.DISCORD_BOT_TOKEN;
    if (!botToken) throw new Error('DISCORD_BOT_TOKEN is not configured');
    return {
      Authorization: `Bot ${botToken}`,
      'Content-Type': 'application/json'
    };
  }

  async _request(method, path, body = null) {
    const url = `${DISCORD_API.BASE_URL}${path}`;
    const options = { method, headers: this._botHeaders() };
    if (body) options.body = JSON.stringify(body);
    const response = await fetch(url, options);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Discord API ${method} ${path} failed [${response.status}]: ${errorText}`);
    }
    // 204 No Content
    if (response.status === 204) return null;
    return response.json();
  }

  // ─── Webhook ───────────────────────────────────────────────────────────────

  /**
   * Xác thực Webhook URL (GET metadata từ Discord)
   */
  async validateWebhook(webhookUrl) {
    if (!webhookUrl) throw new Error('Webhook URL is required');
    const response = await fetch(webhookUrl, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    if (!response.ok) {
      throw new Error(`Discord Webhook verification failed [${response.status}]`);
    }
    const data = await response.json();
    return {
      id: data.id,
      name: data.name,
      guild_id: data.guild_id,
      channel_id: data.channel_id
    };
  }

  /**
   * Gửi tin nhắn văn bản qua Webhook
   */
  async sendMessage(webhookUrl, text) {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: text })
    });
    if (!response.ok && response.status !== 204) {
      const errorMsg = await response.text();
      throw new Error(`Failed to send Discord message [${response.status}]: ${errorMsg}`);
    }
    return { id: `discord-msg-${Date.now()}` };
  }

  /**
   * Gửi ảnh (embed) qua Webhook
   */
  async sendPhoto(webhookUrl, photoUrl, caption) {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: caption || '',
        embeds: [{ image: { url: photoUrl } }]
      })
    });
    if (!response.ok && response.status !== 204) {
      const errorMsg = await response.text();
      throw new Error(`Failed to send Discord photo [${response.status}]: ${errorMsg}`);
    }
    return { id: `discord-photo-${Date.now()}` };
  }

  /**
   * Gửi video qua Webhook (Discord tự embed link video)
   */
  async sendVideo(webhookUrl, videoUrl, caption) {
    const content = caption ? `${caption}\n${videoUrl}` : videoUrl;
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content })
    });
    if (!response.ok && response.status !== 204) {
      const errorMsg = await response.text();
      throw new Error(`Failed to send Discord video [${response.status}]: ${errorMsg}`);
    }
    return { id: `discord-video-${Date.now()}` };
  }

  // ─── Guild ─────────────────────────────────────────────────────────────────

  /**
   * Lấy thông tin Guild (Server)
   */
  async getGuildInfo(guildId) {
    return this._request('GET', `/guilds/${guildId}`);
  }

  /**
   * Lấy thông tin Guild kèm số lượng thành viên
   */
  async getGuildWithCounts(guildId) {
    return this._request('GET', `/guilds/${guildId}?with_counts=true`);
  }

  /**
   * Lấy danh sách text/news channels của Guild
   */
  async getGuildChannels(guildId) {
    const channels = await this._request('GET', `/guilds/${guildId}/channels`);
    return channels.filter(c =>
      c.type === DISCORD_API.CHANNEL_TYPES.TEXT ||
      c.type === DISCORD_API.CHANNEL_TYPES.NEWS
    );
  }

  // ─── Channel ───────────────────────────────────────────────────────────────

  /**
   * Tạo Webhook cho channel được chọn
   */
  async createWebhook(channelId, name) {
    return this._request('POST', `/channels/${channelId}/webhooks`, { name });
  }

  /**
   * Lấy danh sách tin nhắn từ Channel
   */
  async getChannelMessages(channelId, limit = DISCORD_API.MESSAGE_LIMIT) {
    return this._request('GET', `/channels/${channelId}/messages?limit=${limit}`);
  }

  /**
   * Gửi reply cho một tin nhắn trong Channel
   */
  async sendChannelReply(channelId, parentMessageId, text) {
    return this._request('POST', `/channels/${channelId}/messages`, {
      content: text,
      message_reference: {
        message_id: parentMessageId,
        channel_id: channelId,
        fail_if_not_exists: false
      }
    });
  }

  // ─── DM ────────────────────────────────────────────────────────────────────

  /**
   * Tạo/Lấy DM Channel với một user cụ thể (Bot DM)
   */
  async createDMChannel(recipientId) {
    return this._request('POST', '/users/@me/channels', { recipient_id: recipientId });
  }

  /**
   * Build avatar URL từ user ID và avatar hash
   */
  buildAvatarUrl(userId, avatarHash) {
    if (!avatarHash) return null;
    return `${DISCORD_API.CDN_AVATAR}/${userId}/${avatarHash}.png`;
  }
}

module.exports = new DiscordGateway();
