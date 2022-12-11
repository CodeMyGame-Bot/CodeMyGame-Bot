module.exports = {
    name: "eightball",
    async execute(interaction) {
        const answers = ["As I see it, yes.", //fix entails: changing "interaction.commandName" -> "icommand"
            "Ask again later.",
            "Better not tell you now.",
            "Cannot predict now.",
            "Concentrate and ask again.",
            "Don’t count on it.",
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
            "Yes – definitely.",
            "You may rely on it."];
        function getRandomIndex(length) {
            return Math.floor(Math.random() * length);
        }
        await interaction.reply({ content: "Wrote your question? Thought about it? Okay... one second.", ephemeral: true });
        await new Promise(r => setTimeout(r, 2000));
        await interaction.editReply(answers[getRandomIndex(answers.length)]);
    }
} 