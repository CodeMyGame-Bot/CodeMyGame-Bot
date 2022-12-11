const Discord = require('discord.js');
// also upcoming projects, tictactoe and chopsticks, punch and defend games
// verified ->
// 
module.exports = {
    name: "rps",
    cooldown: 3,
    description: "ROCK, PAPER, SCISSORS!",
    async execute(message, args, extraarguments) {  
        let opponent = null
        const filter = m => (m.content.toLowerCase() == "rock" || m.content.toLowerCase() == "paper" || m.content.toLowerCase() == "scissors") && (m.author.id == message.author.id || m.author.id == opponent.id);
        if (args[0]) {
            try {
                opponent = getUserFromMention(args[0])
            } catch (error) {
                message.channel.send("ERRRORRRRR");
                return;
            }    
        } else {
            message.channel.send("Mention a person to battle tho -.-")
            return;
        }
        if (opponent.bot) {
            message.channel.send("CMON YOU CAN'T DO THIS TO ME!");
            return;
        }
        function getUserFromMention(mention) {
            if (!mention) return;
        
            if (mention.startsWith('<@') && mention.endsWith('>')) {
                mention = mention.slice(2, -1);
        
                if (mention.startsWith('!')) {
                    mention = mention.slice(1);
                }
        
                return extraarguments["client"].users.cache.get(mention);
            }
        }
        message.channel.send(`${message.author}, ${opponent}, the Rock, Paper, Scissors game is starting, get ready to send your choice...`);
        await new Promise(r => setTimeout(r, 2000));
        message.channel.send("Send your choice in 3")
        await new Promise(r => setTimeout(r, 1000));
        message.channel.send("Send your choice in 2")
        await new Promise(r => setTimeout(r, 1000));
        message.channel.send("Send your choice in 1")
        await new Promise(r => setTimeout(r, 1000));
        message.channel.send("GO!")
        message.channel.awaitMessages(filter, { max: 2, time: 15000, errors: ['time'] })
            .then(collected => {
                let responses = collected.map(u => u.author.id);
                let answers = collected.map(u => u.content);
                //TESTING FIX: make sure answers[0] is the message.author, answers[1] is the opponent
                if (responses[0] == message.author.id) { //message.author is first to send
                    //pass
                } else { //opponent is first to send
                    let opponentanswervar = answers[0]
                    let authoranswervar = answers[1]
                    answers[0] = authoranswervar
                    answers[1] = opponentanswervar
                }
                if (responses[0] == responses[1]) {
                    message.channel.send("Same person responded twice >:(")
                    return;
                }
                let wonembed = new Discord.MessageEmbed()
                //VERIFIED FIX: Add username instead of mentions
                .setTitle(`Game between ${message.author.username} and ${opponent.username}`)
                .addFields(
                    { name: `${message.author.username}'s choice`, value: "```" + answers[0] + "```" },
                    { name: `${opponent.username}'s choice`, value: "```" + answers[1] + "```" }
                )
                //answers[0] -> message.author.username
                //ansers[0] -> opponent.username
                if (answers[0] == "rock" && answers[1] == "rock") {
                    wonembed.setFooter("TIE!")
                } else if (answers[0] == "rock" && answers[1] == "paper") {
                    wonembed.setFooter(`${opponent.username} won!`)
                } else if (answers[0] == "rock" && answers[1] == "scissors") {
                    wonembed.setFooter(`${message.author.username} won!`)
                } else if (answers[0] == "paper" && answers[1] == "rock") {
                    wonembed.setFooter(`${message.author.username} won!`)
                } else if (answers[0] == "paper" && answers[1] == "paper") {
                    wonembed.setFooter("TIE!")
                } else if (answers[0] == "paper" && answers[1] == "scissors") {
                    wonembed.setFooter(`${opponent.username} won!`)
                } else if (answers[0] == "scissors" && answers[1] == "rock") {
                    wonembed.setFooter(`${opponent.username} won!`)
                } else if (answers[0] == "scissors" && answers[1] == "paper") {
                    wonembed.setFooter(`${message.author.username} won!`)
                } else if (answers[0] == "scissors" && answers[1] == "scissors") {
                    wonembed.setFooter("TIE!")
                }
                message.channel.send({ embeds: [wonembed] })
            })
            .catch(collected => {
                message.channel.send('No responses? Ok...');
            });
    }
}
