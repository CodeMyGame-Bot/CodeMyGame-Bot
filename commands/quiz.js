const Discord = require('discord.js');

module.exports = {
    name: "quiz",
    cooldown: 30,
    description: "Quick quiz for everyone in the server!",
    async execute(message, args) {
        let num1 = Math.ceil(Math.random() * 100);
        let num2 = Math.ceil(Math.random() * 100);
        let sum = num1 + num2;
        
        const filter = inputo => parseInt(inputo, 10) == sum;

        let quizembed = new Discord.MessageEmbed()
            .setTitle(`FLASH QUIZ | What is ${num1} + ${num2}?`);
        let quizmsg = await message.channel.send({ embeds: [quizembed] });

        message.channel.awaitMessages(filter, { max: 1, time: 15000, errors: ['time'] })
            .then(collected => {
                quizmsg.edit("QUIZ OVER");
                quizembed = new Discord.MessageEmbed()
                    .setTitle(`Flash Quiz Over`)
                    .addField(`Winner: ${collected.first().author.username}`, `Number: ${sum}`);
                message.channel.send({ embeds: [quizembed] })
            })
            .catch((error) => {
                message.channel.send('No responses? ok bye');
                console.log(error);
            });
    }
}