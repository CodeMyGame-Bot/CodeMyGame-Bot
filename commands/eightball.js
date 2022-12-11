const { SlashCommandBuilder } = require("discord.js");

Array.prototype.choice = () => this[Math.floor(Math.random() * this.length)];

const answers = ["As I see it, yes.",
    "Ask again later.",
    "Better not tell you now.",
    "Cannot predict now.",
    "Concentrate and ask again.",
    "Don't count on it.",
    "It is certain.",
    "It is decidedly so.",
    "Most likely.",
    "My reply is no.",
    "My sources say no.",
    "Outlook not so good.",
    "Outlook good.",
    "Reply hazy, try again.",
    "Signs point to yes.",
    "Very doubtful.",
    "Without a doubt.",
    "Yes.",
    "Yes — definitely.",
    "You may rely on it."];

// (disclaimer: do not treat the bot\'s response with any seriousness; this is just a fun command)
module.exports = {
    data: new SlashCommandBuilder()
        .setName('eightball')
        .setDescription('Enter a question that the 8-Ball can answer!')
        .addStringOption(option =>
            option
                .setName('question')
                .setDescription('The question to ask')
                .setMaxLength(1000)
                .setRequired(true)
        ),
    category: 'minigames',
    cooldown: 10,
    async execute(interaction) {
        await interaction.reply({ content: "Wrote your question? Thought about it? Okay... one second.", ephemeral: true });
        await new Promise(r => setTimeout(r, 2000));
        await interaction.editReply(answers.choice());
    }
} 