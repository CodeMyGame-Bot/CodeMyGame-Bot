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
        )
        .addIntegerOption(option =>
            option
                .setName('min')
                .setDescription('Minimum limit to find a random number in (defaults to 0 if not provided)')
                .setMinValue(-Number.MAX_SAFE_INTEGER)
                .setMaxValue(Number.MAX_SAFE_INTEGER)
                .setRequired(false)
        ),
    category: 'utility',
    cooldown: 10,
    async execute(interaction) {
        // check if min is > max; if min == max, return min/max instead of doing math.random
        let min = interaction.options.getInteger('min') || 0;

        await interaction.reply({ content: `Min limit: ${min}
Max limit: ${interaction.options.get('max').value}
        
        `
        })

        let therandomstring = `
        Min limit: 0 (by default)\n
Max limit: ${interaction.options.get('max').value}\n
Random number: ${Math.floor(Math.random() * interaction.options.get('max').value, 10)}`;
        await interaction.reply({ content: therandomstring, ephemeral: true });
        
    }
}