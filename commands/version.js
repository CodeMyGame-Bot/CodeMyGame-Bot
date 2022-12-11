const { version, unstable_test_release } = require('../config.json')
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

let versionEmbed = new EmbedBuilder()
    .addFields(
        { name: "Version", value: version },
        { name: "Unstable test Release", value: unstable_test_release }
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