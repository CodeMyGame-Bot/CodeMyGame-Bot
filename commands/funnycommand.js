const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('funnycommand')
        .setDescription('Technically for YouTube and for testing'),
    category: 'utility',
    cooldown: 10,
    async execute(interaction) {
        await interaction.reply({ content: 'Yeah most people code this is definitely coding haha ok i\'ll stop', ephemeral: true });
    }
}