module.exports = {
    name: "funstuff",
    cooldown: 60,
    description: "Click on a number, and it will give you the response based on what you reacted to! <BETA; it only tells you the first reaction you did, and only tells you if you reacted with the given reactions>",
    execute(message, args) {
        async function reaction() {
            message.react('0️⃣').then(() => message.react('1️⃣'))
            .then(() => message.react('2️⃣'))
            .then(() => message.react('3️⃣'))
            .then(() => message.react('4️⃣'))
            .then(() => message.react('5️⃣'))
            .then(() => message.react('6️⃣'))
            .then(() => message.react('7️⃣'))
            .then(() => message.react('8️⃣'))
            .then(() => message.react('9️⃣'))
        }
        reaction();
        const filter = (reaction, user) => {
            return ['0️⃣', '1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣'].includes(reaction.emoji.name) && user.id === message.author.id;
        };

        message.awaitReactions(filter, { max: 1, time: 60000, errors: ['time'] })
            .then(collected => {
                const reaction = collected.first();
                if (reaction.emoji.name == '0️⃣') {
                    message.reply("You reacted with a 0")
                }
                else if (reaction.emoji.name == '1️⃣') {
                    message.reply("You reacted with a 1")
                }
                else if (reaction.emoji.name == '2️⃣') {
                    message.reply("You reacted with a 2")
                }
                else if (reaction.emoji.name == '3️⃣') {
                    message.reply("You reacted with a 3")
                }
                else if (reaction.emoji.name == '4️⃣') {
                    message.reply("You reacted with a 4")
                }
                else if (reaction.emoji.name == '5️⃣') {
                    message.reply("You reacted with a 5")
                }
                if (reaction.emoji.name == '6️⃣') {
                    message.reply("You reacted with a 6")
                }
                if (reaction.emoji.name == '7️⃣') {
                    message.reply("You reacted with a 7")
                }
                else if (reaction.emoji.name == '8️⃣') {
                    message.reply("You reacted with a 8")
                }
                else if (reaction.emoji.name === '9️⃣') {
                    message.reply('you reacted with a 9.');
                }
            })
            .catch(collected => {
                message.reply('What did you react with...');
            });
        }
        
}