const { version } = require('../config.json')
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

let versionEmbed = new EmbedBuilder()
    .addFields(
        { name: "Version", value: version }
    );

module.exports = {
    data: new SlashCommandBuilder()
        .setName('version')
        .setDescription('Gets the version of the bot!'),
    category: 'utility',
    cooldown: 10,
    async execute(interaction) {
        await interaction.reply({ embeds: [versionEmbed], ephemeral: true });
    }
}