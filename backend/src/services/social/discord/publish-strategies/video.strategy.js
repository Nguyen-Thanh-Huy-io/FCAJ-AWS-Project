const DiscordPublishStrategy = require('./publish.strategy');
const discordGateway = require('../discord.gateway');

class DiscordVideoPublishStrategy extends DiscordPublishStrategy {
  async publish(webhookUrl, postData) {
    return await discordGateway.sendVideo(webhookUrl, postData.mediaUrl, postData.caption);
  }
}

module.exports = DiscordVideoPublishStrategy;
