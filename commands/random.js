const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('random')
        .setDescription('Returns a random number!')
        .addIntegerOption(option => 
            option
                .setName('max')
                .setDescription('Maximum limit to find a random number in')
                .setMinValue(-Number.MAX_SAFE_INTEGER)
                .setMaxValue(Number.MAX_SAFE_INTEGER)
                .setRequired(true)
        ),
    category: 'utility',
    cooldown: 10,
    async execute(interaction) {
        // check if min is > max; if min === max, return min/max instead of doing math.random

        let therandomstring = `
        Min limit: 0 (by default)\n
Max limit: ${interaction.options.get('max').value}\n
Random number: ${Math.floor(Math.random() * interaction.options.get('max').value, 10)}`;

        await interaction.reply({ content: therandomstring });
    }
}