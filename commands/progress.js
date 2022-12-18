const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

let loader_states = ['-', '\\', '|', '/'];

let nextState = currState => loader_states[(loader_states.indexOf(currState) + 1) % loader_states.length];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('progress')
        .setDescription('Make a progress bar! (might not be time-accurate due to network limits)')
        .addIntegerOption(option =>
            option
                .setName('bars')
                .setDescription('The number of bars in the progress bar')
                .setMinValue(1)
                .setMaxValue(100)
                .setRequired(true)
        )
        .addIntegerOption(option =>
            option
                .setName('time')
                .setDescription('Time between each advance of the progress bar (in milliseconds)')
                .setMinValue(500)
                .setMaxValue(1000)
                .setRequired(true)
        ),
    category: 'utility',
    cooldown: 60,
    async execute(interaction) {
        let [bars, timer] = [interaction.options.getInteger('bars'), interaction.options.getInteger('time')];
        let progresso = ' ';
        let loader = '-';

        let progressEmbed = new EmbedBuilder()
            .setTitle('Progress Bar')
            .setDescription(progresso);
        
        await interaction.reply({ embeds: [progressEmbed] });
        
        let start = new Date().toUTCString();

        for (let x = 0; x < bars + 1; x++) {
            progresso = '[' + '#'.repeat(x) + '-'.repeat(bars - x) + ']';
            
            progressEmbed.setDescription(progresso);
            progressEmbed.setFooter({ text: `${Number.parseFloat((x / bars) * 100).toFixed(1)}% ${loader}` });
            
            loader = nextState(loader);
            
            await interaction.editReply({ embeds: [progressEmbed] })
            await new Promise(r => setTimeout(r, timer));
        }

        let end = new Date().toUTCString();
        
        progressEmbed.setFooter({ text: `Started progress bar on ${start}\nCompleted progress bar on ${end}` });
        
        await interaction.editReply({ embeds: [progressEmbed] });
    }
}
