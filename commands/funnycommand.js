const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    category: 'utility',
    type: 'instant',
    cooldown: 10,
    data: new SlashCommandBuilder()
        .setName('funnycommand')
        .setDescription('Technically for YouTube and for testing'),
    async execute(interaction) {
        await interaction.reply({ content: 'Yeah most people code this is definitely coding haha ok i\'ll stop' });
    }
}