const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, userMention, PermissionsBitField, Events, ComponentType, EmbedBuilder } = require("discord.js");

const choices = ["rock", "paper", "scissors"];

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

/**
 * rps_win (used with wrapper calc_rps_win below) will return whether the user or opponent lost
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
    (results.user.choice == results.opponent.choice // if user's choice equals opponent's choice
        ? 'It\'s a tie!' // it's a tie
        : `${userMention( // otherwise, get the user mention of... (see line 59)
            results[ // the user who won
                rps_win[choices.user.choice][choices.opponent.choice]
            ]
            .id // ... said user's id
        )}`
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
    async execute(interaction, client) {
        const opponent = interaction.options.getUser('opponent');

        if (opponent.bot) {
           return await interaction.reply('You have to play rock, paper, scissors with another **user**, not a *bot*...');
        }

        async function rps_game(i) {
            let [user_choice, opponent_choice] = null;

            await interaction.editReply({ content: `${userMention(interaction.user.id)} and ${userMention(opponent.id)}, enter your choices. You have 15 seconds`, components: [rps_row] });

            const filter = i => ([interaction.user.id, opponent.id].includes(i.user.id) && choices.includes(i.customId));
            const collector = interaction.channel.createMessageComponentCollector({ filter, time: 15000, componentType: ComponentType.Button });
            
            collector.on('collect', async i => {
                switch (i.user.id) {
                    case interaction.user.id:
                        if (user_choice) {
                            await i.reply({ content: 'You\'ve already submitted your guess!', ephemeral: true });
                            return i.dispose();
                        }
                        user_choice = i.customId
                    case opponent.id:
                        if (opponent_choice) {
                            await i.reply({ content: 'You\'ve already submitted your guess!', ephemeral: true });
                            return i.dispose();
                        }
                        opponent_choice = i.customId
                }
            });

            collector.on('end', async (collected, reason) => {
                if (collected.size < 2) {
                    await interaction.editReply({ content: 'One or both players didn\'t respond in time', components: [] });
                } else {
                    const wonembed = new EmbedBuilder()
                        .setTitle(`Game between ${interaction.user.username} and ${opponent.username}`)
                        .setColor(0x00FF00)
                        .addFields(
                            { name: `${message.author.username}'s choice`, value: `\`\`\`${user_choice}\`\`\`` },
                            { name: `${opponent.username}'s choice`, value: `\`\`\`${opponent_choice}\`\`\`` },
                            { name: `${userMention(calc_rps_win({
                                'user': {
                                    'id': interaction.user.id,
                                    'choice': user_choice
                                },
                                'opponent': {
                                    'id': opponent.id,
                                    'choice': opponent_choice
                                }
                            }))}` }
                        );
                    
                    await interaction.editReply({ embeds: [wonembed] });
                }

                client.removeListener(this);
            })
        }

        await interaction.reply({ content: `${userMention(opponent.id)}, would you like to play Rock, Paper, Scissors with ${userMention(interaction.user.id)}? This message will time out in 10 seconds`, components: [confirm_play] });
        
        const filter = i => (i.user.id == opponent.id) && (['accept', 'deny'].includes(i.customId));
        const collector = interaction.channel.createMessageComponentCollector({ filter, time: 10000, componentType: ComponentType.Button, max: 1 });

        collector.on('collect', async i => {
            if (i.customId === 'accept') {
                rps_game();
            } else if (i.customId == 'deny') {
                return await interaction.editReply({ content: `Sorry ${userMention(interaction.user.id)}, the person you mentioned can't play Rock, Paper, Scissors right now`, components: [] });
            }
        });
        
        client.on(Events.InteractionCreate, rps_game);
    }
}
