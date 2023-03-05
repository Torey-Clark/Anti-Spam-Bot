const { Events } = require('discord.js');

const logger = require('../utils/logger');

module.exports = {
    name: Events.ClientReady,
    once: true,
    execute(client) {
        logger.info(`Bot is ready! Logged in as ${client.user.tag}`);
        client.user.setPresence({
            activities: [{
                name: ` - Watching for Spam`
            }],
            status: 'online',
        });
    }
}