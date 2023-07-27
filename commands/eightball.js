const { SlashCommandBuilder } = require('discord.js');

Array.prototype.choice = function() {
    return this[Math.floor(Math.random() * this.length)];
}

const answers = ['As I see it, yes.',
    'Ask again later.',
    'Better not tell you now.',
    'Cannot predict now.',
    'Concentrate and ask again.',
    'Don\'t count on it.',
    'It is certain.',
    'It is decidedly so.',
    'Most likely.',
    'My reply is no.',
    'My sources say no.',
    'Outlook not so good.',
    'Outlook good.',
    'Reply hazy, try again.',
    'Signs point to yes.',
    'Very doubtful.',
    'Without a doubt.',
    'Yes.',
    'Yes — definitely.',
    'You may rely on it.'];

module.exports = {
    category: 'minigames',
    type: 'instant',
    cooldown: 10,
    data: new SlashCommandBuilder()
        .setName('eightball')
        .setDescription('Enter a question that the 8-Ball can answer (don\'t take the bot\'s answer seriously!)')
        .addStringOption(option =>
            option
                .setName('question')
                .setDescription('The question to ask')
                .setMaxLength(1000)
                .setRequired(true)
        ),
    async execute(interaction) {
        await interaction.reply({ content: 'Wrote your question? Thought about it? Okay... one second.', ephemeral: true });
        await new Promise(r => setTimeout(r, 2000));
        await interaction.editReply({ content: `The answer to your question '${interaction.options.getString('question')}' is '${answers.choice()}'` });
    }
} 