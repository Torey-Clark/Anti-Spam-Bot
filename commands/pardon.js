const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

const logger = require('../utils/logger');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pardon')
        .setDescription('Removes the timeout from a user')
        .addUserOption((option) => {
            return option.setName('user')
                .setDescription('The user to pardon')
                .setRequired(true);
        })
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
    async execute(interaction) {
        logger.info(`Execution "pardon" command`);
        const user = interaction.options.getUser('user');
        interaction.guild.members.fetch(user)
            .then((member) => {
                // Remove the timeout from the user
                member.timeout(null);
                interaction.reply(`${user.username} has been pardoned.`);
            }).catch((error) => {
                logger.error(error);
            });
    }
}