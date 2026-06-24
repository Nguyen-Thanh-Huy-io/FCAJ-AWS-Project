const DiscordPublishStrategy = require('./publish.strategy');
const discordGateway = require('../discord.gateway');

class DiscordTextPublishStrategy extends DiscordPublishStrategy {
  async publish(webhookUrl, postData) {
    return await discordGateway.sendMessage(webhookUrl, postData.caption);
  }
}

module.exports = DiscordTextPublishStrategy;
