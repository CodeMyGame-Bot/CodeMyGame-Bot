const Discord = require('discord.js');
//change to dm message soon so ppl cant pls snipe and get the other person's choice
// - update, rps start from dm, then ask opponent in chat,
// also upcoming projects, tictactoe and chopsticks, punch and defend games
module.exports = {
    name: "rpsbot",
    cooldown: 3,
    description: "ROCK, PAPER, SCISSORS! but with the bot lol",
    execute(message, args) {  
        const filter = m => m.author.id == message.author.id;
        //message.channel.send(`Do you choose rock, paper, or scissors, ${message.author}`);

        let person1choice = ""

        message.channel.send("ROCK. PAPER. SCISSORS!!!")
        const waittime = 15000;
        function waitForMessage(retryCount, thefilter) {
            message.channel.awaitMessages(thefilter, {max: 1}).then(collected => {
            if (retryCount == 0) {
                if (collected.first().content.toLowerCase() == "rock") {
                    person1choice = collected.first().content.toLowerCase()
                } else if (collected.first().content.toLowerCase() == "paper") {
                    person1choice = collected.first().content.toLowerCase()
                } else if (collected.first().content.toLowerCase() == "scissors") {
                    person1choice = collected.first().content.toLowerCase()
                } else {
                    message.channel.send("invalid response, retry the game")
                    collected.first().delete()
                    return;
                }
            }
            collected.first().delete()
            winCheck()
            return;
            }).catch((error) => {
                console.error(error)
                message.channel.send("ERROR")
                return;
            });
        }   
        async function winCheck() {
            const rpslist = ["rock", "paper", "scissors"]
            let compchoice = rpslist[Math.ceil(Math.random()*2)]
            let wonembed = new Discord.MessageEmbed()
                .setTitle("Rock, Paper, Scissors! Game")
                .addFields(
                    { name: `${message.author.username}'s choice`, value: "```" + person1choice + "```" },
                    { name: `Computer's choice`, value: "```" + compchoice + "```" }
                )
            if (person1choice == "rock" && compchoice == "rock") {
                wonembed.setFooter("TIE!")
            } else if (person1choice == "rock" && compchoice == "paper") {
                wonembed.setFooter("Computer won!")
            } else if (person1choice == "rock" && compchoice == "scissors") {
                wonembed.setFooter(`${message.author.username} won!`)
            } else if (person1choice == "paper" && compchoice == "rock") {
                wonembed.setFooter(`${message.author.username} won!`)
            } else if (person1choice == "paper" && compchoice == "paper") {
                wonembed.setFooter("TIE!")
            } else if (person1choice == "paper" && compchoice == "scissors") {
                wonembed.setFooter("Computer won!")
            } else if (person1choice == "scissors" && compchoice == "rock") {
                wonembed.setFooter("Computer won!")
            } else if (person1choice == "scissors" && compchoice == "paper") {
                wonembed.setFooter(`${message.author.username} won!`)
            } else if (person1choice == "scissors" && compchoice == "scissors") {
                wonembed.setFooter("TIE!")
            }
            message.channel.send({ embeds: [wonembed] })
        }
        async function runLoop(retryCount) {
            if (retryCount == 0) {
                message.channel.send(`Do you choose rock, paper, or scissors, ${message.author}?`)
                waitForMessage(retryCount, filter)    
            }
        }
        runLoop(0)
    }
}
