const { SlashCommandBuilder, ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle, ActionRow, ButtonBuilder, ButtonStyle, ComponentType, Events, userMention } = require('discord.js');

const showQuizModal = new ActionRowBuilder()
    .addComponents(
        new ButtonBuilder()
            .setCustomId('show-quiz-modal')
            .setLabel('Press to guess!')
            .setStyle(ButtonStyle.Primary)
    )

module.exports = {
    data: new SlashCommandBuilder()
        .setName('quiz')
        .setDescription('Poses an arithmetic question to everyone in the channel!'),
    category: 'minigames',
    cooldown: 60,
    async execute(interaction, client) {
        let num1 = Math.ceil(Math.random() * 100);
        let num2 = Math.ceil(Math.random() * 100);
        let answer = num1 + num2;

        const quizModal = new ModalBuilder()
            .setTitle(`What is ${num1} + ${num2}?`)
            .setCustomId('quiz-modal')
            .addComponents(
                new ActionRowBuilder()
                    .addComponents(
                        new TextInputBuilder()
                            .setCustomId('quiz-guess')
                            .setLabel('Your Guess (has to be a number)')
                            // .setMaxLength((100 + 100).toString().length)
                            .setPlaceholder(0)
                            .setStyle(TextInputStyle.Short)
                            .setRequired(true)
                    )
            );
        
        await interaction.reply({ content: 'FLASH QUIZ (everyone has 20 seconds to guess)', components: showQuizModal });

        const filter = i => (i.customId == 'show-quiz-modal');
        const collector = interaction.channel.createMessageComponentCollector({ filter, time: 20000, componentType: ComponentType.Button });

        async function checkGuess(i) {
            if (!i.isModalSubmit()) return;

            const user_guess = i.getTextInputValue('quiz-guess');
            if (Number.isInteger(user_guess) && parseInt(user_guess, 10) > 0 && parseInt(user_guess, 10) == answer) {
                collector.end(i.user.id);
                await i.reply({ content: 'Congratulations! You got the answer right!', ephemeral: true });
            } else {
                await i.reply({ content: 'Sorry, that\'s not the right answer', ephemeral: true });
            }
        }

        client.on(Events.InteractionCreate, checkGuess);

        collector.on('collect', async i => {
            await i.showModal(quizModal);
        });

        collector.on('end', async (collected, reason) => {
            client.removeListener(Events.InteractionCreate, checkGuess);

            if (collected.size === 0) { // if nobody responded
                await interaction.editReply({ content: `Nobody responded to the quiz :(`, components: [] });
            } else if (reason == 'time') { // if ppl responded but it timed out without being ended on line 47 
                await interaction.editReply({ content: `Sorry. Nobody guessed the sum of ${num1} and ${num2} (which was ${answer}). Good job to everybody who tried, though!` });
            } else { // somebody got it correct
                await interaction.editReply({ content: `Congratulations to ${userMention(reason)} for correctly guessing ${answer} as the sum of ${num1} and ${num2}!`, components: [] });
            }
        });
    }
}