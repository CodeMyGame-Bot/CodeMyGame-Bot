const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require('discord.js');
const Discord = require('discord.js');

const choices = ["rock", "paper", "scissors"];

const rps_row = new ActionRowBuilder()
    .addComponents(
        new ButtonBuilder()
            .setCustomId('rock')
            .setLabel('Rock')
            .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
            .setCustomId('paper')
            .setLabel('Paper')
            .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
            .setCustomId('scissors')
            .setLabel('Scissors')
            .setStyle(ButtonStyle.Primary)
    );

/**
 * rps_win (used with wrapper calc_rps_win below) will return whether the USER won or lost
 * excludes scenarios where result is a tie; handled by calc_rps_win
 */

const rps_win = {
    'rock': {
        'paper': 'You lost!',
        'scissors': 'You won!'
    }, 'paper': {
        'rock': 'You won!',
        'scissors': 'You lost!'
    }, 'scissors': {
        'rock': 'You lost!',
        'paper': 'You won!'
    }
};

// wraps rps_win in a function
const calc_rps_win = choices => (choices.user == choices.computer ? 'It\'s a tie!' : rps_win[choices.user][choices.computer]);

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rps-bot')
        .setDescription('Play rock, paper, scissors with the bot!'),
    category: 'minigames',
    cooldown: 10,
    async execute(interaction) {
        let comp_choice = choices[Math.floor(Math.random() * choices.length)];
        await interaction.reply({ content: 'I\'ve selected my choice. Now you choose! You have 10 seconds', components: [rps_row] });
        
        const filter = i => choices.includes(i.customId) && (i.user.id == interaction.user.id);
        const collector = interaction.channel.createMessageComponentCollector({ filter, time: 10000, componentType: ComponentType.Button, max: 1 });
        
        collector.on('collect', async i => {
            if (i.customId === comp_choice) {
                await i.update({ content: `It's a tie!`, components: [] });
            } else {
                await i.update({ content: `${calc_rps_win({
                    'user': i.customId,
                    'computer': comp_choice
                })}`, components: [] });
            }
        });
    }
}
