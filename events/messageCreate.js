const { Events, ChannelType } = require('discord.js');

const config = require('../config.json');
const logger = require('../utils/logger');
const moment = require('moment');

module.exports = {
    name: Events.MessageCreate,
    async execute(message) {
        logger.info(`Message Created by ${message.author.username}: ${message.content}`);

        const guildId = message.guildId;
        const client = message.client;
        const channels = client.guilds.cache.get(guildId).channels;
        const promises = [];

        let messageAppearances = 1;
        channels.cache.each((channel) => {
            // Look for duplicate messages in each channel

            if (config.excludedChannels.includes(channel.id)) {
                // Exclude the matching channels in the config
                logger.debug(`Channel: ${channel.name} is excluded in the config.`)
                return;
            }

            if (channel.type !== ChannelType.GuildText) {
                // This is not a text channel so we do nothing;
                logger.debug(`Channel: ${channel.name} is not a text channel.`);
                return;
            }

            logger.debug(`Looking for duplicate messages in channel: ${channel.name}`);
            promises.push(channel.messages.fetch({
                    limit: config.maximumCommentLimit,
                }).then((messages) => {
                    const messagesFromUser = messages.filter((m) => {
                        return (
                            m.author.id === message.author.id && // Only grab messages from the same user
                            moment(new Date(m.createdTimestamp)).diff(moment(new Date(message.createdTimestamp)), 'minutes') < config.maximumTimespanForMessages // Only grab messages within the specified time range
                        );
                    });

                    if (messagesFromUser.length === 0) {
                        logger.debug(`${message.author.username} has no recent messages in this channel.`);
                        // The user does not have any recent messages in this channel
                        return;
                    }

                    messagesFromUser.forEach((userMessage) => {
                        if (userMessage.content == message.content && userMessage.id != message.id) {
                            // The original message is not spam until we find more instances of the same message
                            logger.debug(`Found spam!`);
                            messageAppearances++;
                            // This message has appeared multiple times in quick succession.
                            // Delete the message
                            deleteMessage(userMessage);
                        }
                    });
                    logger.debug(`Message Appearance so far: ${messageAppearances}`);
                }).catch((error) => {
                    logger.error(error);
                })
            );
        });

        // We wait until all the promises are resolved so we don't spam with moderators with multiple messages.
        Promise.all(promises)
            .then(() => {
                // If this message has appeared multiple time, we consider it spam
                logger.debug(`Total duplicate messages: ${messageAppearances}`);
                if (messageAppearances > 1) {
                    logger.debug(`${message.author.username} has sent the message "${message.content}" ${messageAppearances} times in ${config.maximumTimespanForMessages} minutes.`);
                    // Delete the message
                    deleteMessage(message);

                    // Timeout the user
                    timeoutAuthor(message, messageAppearances);

                    // Send a message to each server moderator so they stay informed
                    informModerators(message, messageAppearances);
                }
            })
            .catch((error) => {
                logger.error(error);
            })
    }
}

function deleteMessage(message) {
    message.delete()
    .then((msg) => {
        logger.debug(`Deleted message from ${msg.author.username}`);
    }).catch((error) => {
        logger.error(error);
    })
}

function timeoutAuthor(message, messageAppearances) {
    logger.info(`Trying to timeout the author`);
    message.guild.members.fetch(message.author)
    .then((user) => {
        if (!user.manageable) {
            // The spam is from a user with higher permissions then the bot. We can't give them a timeout;
            logger.debug(`The author is a higher role. I can't give them a timeout`);
        } else {
            user.timeout(config.timeoutDuration * 60 * 1000, `${message.author} has sent the message "${message.content}" ${messageAppearances} times in ${config.maximumTimespanForMessages} minutes.`)
                .then((member) => {
                    logger.info(`${member.displayName} has received a timeout for ${config.timeoutDuration} minutes.`);
                }).catch((error) => {
                    logger.error(error);
                });
        }
    }).catch((error) => {
        logger.error(error);
    });
}

function informModerators(message, messageAppearances) {
    logger.info(`Informing the moderators`);
    message.guild.roles.cache.each((role, _rolekey) => {
        logger.debug(`Checking Role: ${role.name}`);
        if (config.moderatorRoles.includes(role.name)) {
            logger.debug(`Informing users`);
            role.members.each((member, _memberKey) => {
                message.guild.members.fetch(message.author)
                    .then((author) => {
                        if (!author.manageable) {
                            member.send(`${message.author} has sent the message "${message.content}" ${messageAppearances} times recently. They have higher permissions then me so I can't give them a timeout.`);
                        } else {
                            member.send(`${message.author} has sent the message "${message.content}" ${messageAppearances} times recently. I've given them a timeout for ${config.timeoutDuration} minutes and deleted the messages. You can use /pardon to remove their timeout if I made a mistake.`);
                        }
                    }).catch((error) => {
                        logger.error(error);
                    });
            });
        }
    });
}