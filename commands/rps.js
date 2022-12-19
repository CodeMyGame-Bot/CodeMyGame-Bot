const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, userMention, ComponentType, EmbedBuilder } = require('discord.js');

const prompt_timeout = 10;
const play_time = 15;

const choices = ['rock', 'paper', 'scissors'];

const confirm_play = new ActionRowBuilder()
    .addComponents(
        new ButtonBuilder()
            .setCustomId('accept')
            .setLabel('Accept')
            .setStyle(ButtonStyle.Success),
        new ButtonBuilder()
            .setCustomId('deny')
            .setLabel('Deny')
            .setStyle(ButtonStyle.Danger)
    );

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

async function rps_game(interaction, button, opponent) {
    let user_choice = opponent_choice = null;

    await button.update({ content: `${userMention(interaction.user.id)} and ${userMention(opponent.id)}, enter your choices. You have ${play_time} seconds`, components: [rps_row] });

    const filter = i => ([interaction.user.id, opponent.id].includes(i.user.id) && choices.includes(i.customId));
    const collector = interaction.channel.createMessageComponentCollector({ filter, time: play_time * 1000, componentType: ComponentType.Button });
    
    collector.on('collect', async i => {
        if (i.user.id === interaction.user.id) {
            if (user_choice) {
                await i.reply({ content: 'You\'ve already submitted your guess!', ephemeral: true });
            } else {
                user_choice = i.customId;
                await i.reply({ content: 'Received your guess!', ephemeral: true });
            }
        } else if (i.user.id === opponent.id) {
            if (opponent_choice) {
                await i.reply({ content: 'You\'ve already submitted your guess!', ephemeral: true });
            } else {
                opponent_choice = i.customId;
                await i.reply({ content: 'Received your guess!', ephemeral: true });
            }
        }

        if (user_choice && opponent_choice) {
            collector.stop();
        }
    });

    collector.on('end', async (collected, reason) => { 
        if (reason === 'time') {
            await interaction.editReply({ content: 'Both players didn\'t respond in time', components: [] });
        } else {
            const game_info = {
                'user': {
                    'obj': interaction.user,
                    'choice': user_choice
                },
                'opponent': {
                    'obj': opponent,
                    'choice': opponent_choice
                }
            };

            const win_info = game_info[calc_rps_win(game_info)].obj;

            const wonembed = new EmbedBuilder()
                .setTitle(win_info === 'It\'s a tie' ? win_info : `Congratulations ${win_info.username}!`)
                .setColor(0x00FF00)
                .addFields(
                    { name: `${interaction.user.username}'s choice`, value: `\`\`\`${user_choice}\`\`\`` },
                    { name: `${opponent.username}'s choice`, value: `\`\`\`${opponent_choice}\`\`\`` },
                )
                .setFooter({ text: `Game between ${interaction.user.username} and ${opponent.username}` });
            
            await interaction.editReply({ content: '', embeds: [wonembed], components: [] });
        }
    })
}

/**
 * rps_win (used with wrapper calc_rps_win below) will return whether the user or opponent won
 * excludes scenarios where result is a tie; handled by calc_rps_win
 */
const rps_win = {
    'rock': {
        'paper': 'opponent',
        'scissors': 'user'
    }, 'paper': {
        'rock': 'user',
        'scissors': 'opponent'
    }, 'scissors': {
        'rock': 'opponent',
        'paper': 'user'
    }
};

// wraps rps_win in a function
const calc_rps_win = results => // user's choice and opponent's choice
    (results.user.choice === results.opponent.choice // if user's choice equals opponent's choice
        ? 'It\'s a tie!' // it's a tie
        : rps_win[results.user.choice][results.opponent.choice] // otherwise, return whether the user or opponent won
    );

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rps')
        .setDescription('Play rock, paper, scissors with another user!')
        .addUserOption(option =>
            option
                .setName('opponent')
                .setDescription('Who you\'re playing against!')
                .setRequired(true)
        ),
    category: 'minigames',
    cooldown: 60,
    async execute(interaction) {
        const opponent = interaction.options.getUser('opponent');

        if (opponent.bot) {
           return await interaction.reply({ content: 'You have to play rock, paper, scissors with another **user**, not a *bot*...', ephemeral: true });
        }

        await interaction.reply({ content: `${userMention(opponent.id)}, would you like to play Rock, Paper, Scissors with ${userMention(interaction.user.id)}? This message will time out in ${prompt_timeout} seconds`, components: [confirm_play] });
        
        const filter = i => i.user.id === opponent.id && ['accept', 'deny'].includes(i.customId);
        const collector = interaction.channel.createMessageComponentCollector({ filter, time: prompt_timeout * 1000, componentType: ComponentType.Button, max: 1 });

        collector.on('collect', async i => {
            if (i.customId === 'accept') {
                rps_game(interaction, i, opponent);
            } else if (i.customId === 'deny') {
                return await interaction.editReply({ content: `Sorry ${userMention(interaction.user.id)}, the person you mentioned can't play Rock, Paper, Scissors right now`, components: [] });
            }
        });
    }
}
