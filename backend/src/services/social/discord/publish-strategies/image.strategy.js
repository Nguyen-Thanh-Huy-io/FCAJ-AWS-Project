const DiscordPublishStrategy = require('./publish.strategy');
const discordGateway = require('../discord.gateway');

class DiscordImagePublishStrategy extends DiscordPublishStrategy {
  async publish(webhookUrl, postData) {
    return await discordGateway.sendPhoto(webhookUrl, postData.mediaUrl, postData.caption);
  }
}

module.exports = DiscordImagePublishStrategy;
