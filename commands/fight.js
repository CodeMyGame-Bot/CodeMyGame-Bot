const Discord = require("discord.js")
module.exports = {
    name: "fight",
    cooldown: 60,
    description: "Fight!",
    async execute(message, args, extraarguments) {
        /*if (!message.guild.me.hasPermission("MANAGE_MESSAGES")) {
            message.channel.send("Missing perms")
            return;
        }*/
        /*fight*/let player1health = 100;
        let player1defense = 0;
        let player2 = getUserFromMention(args[0])
        if (!player2) {
            message.channel.send("mention your opponent")
            return;
        } else if (player2.id == message.author.id) {
            message.channel.send("lol you picked yourself")
            return;
        } 
        if (player2.bot) {
            message.channel.send("how do you think a bot's gonna respond???")
            return;
        }
        let player2health = 100;
        let player2defense = 0;

        //let counter = 0;
        let dealt = 0;
        let defenseincrease = 0;
        let statsembed = new Discord.MessageEmbed()
        .addFields(
            { name: `${message.author.username}'s health`, value: `${player1health}` },
            { name: `${player2.username}'s health`, value: `${player1health}`},
            { name: `${message.author.username}'s shield`, value: `${player1defense}`},
            { name: `${player2.username}'s shield`, value: `${player2defense}`}
        )
        let statsmessage = await message.channel.send("STATS GO HERE");
        let sentmessage;
        //let buttonchecker = new Discord.InteractionCollector(client, {channel: message.channel, interactionType: "MESSAGE_COMPONENT"})

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
        /*const fightrow = new Discord.MessageActionRow()
			.addComponents(
				new Discord.MessageButton()
					.setCustomId('fight')
					.setLabel('fight')
					.setStyle('PRIMARY'),
                new Discord.MessageButton()
					.setCustomId('shield')
					.setLabel('shield')
					.setStyle('SUCCESS'),
                new Discord.MessageButton()
					.setCustomId('end')
					.setLabel('end')
					.setStyle('DANGER'),
        );
        async function awaitMessages(retryCount) {
            if (retryCount % 2 != 0) {
                sentmessage = await message.channel.send({ content: `Here are your choices, ${message.author.username}`, components: [fightrow]})
                //player 1
                buttonchecker.on('collect', (buttono) => {
                    if (buttono.user.id == message.author.id) {
                        if (buttono.customId == 'fight') {
                            dealt = Math.floor(Math.random() * 30)
                            if (player2defense > 0) {
                                dealt = dealt / Math.floor(player2defense / 10)
                            }
                            player2health -= dealt
                            statsembed = new Discord.MessageEmbed()
                            .addFields(
                                { name: `${message.author.username}'s health`, value: `${player1health}` },
                                { name: `${player2.username}'s health`, value: `${player2health}`},
                                { name: `${message.author.username}'s shield`, value: `${player1defense}`},
                                { name: `${player2.username}'s shield`, value: `${player2defense}`}
                            )
                            .setFooter(`${message.author.username} dealt **${dealt}** damage!`)
                            runloop(retryCount+1)
                        } else if (buttono.customId == 'shield') {
                            if (player1defense >= 50) {
                                statsembed = new Discord.MessageEmbed()
                                .addFields(
                                    { name: `${message.author.username}'s health`, value: `${player1health}` },
                                    { name: `${player2.username}'s health`, value: `${player2health}`},
                                    { name: `${message.author.username}'s shield`, value: `${player1defense}`},
                                    { name: `${player2.username}'s shield`, value: `${player2defense}`}
                                )
                                .setFooter(`${player1defense}'s defense is at the max!`)
                                runloop(retryCount + 1)
                            }
                            player1defense += 10
                            statsembed = new Discord.MessageEmbed()
                            .addFields(
                                { name: `${message.author.username}'s health`, value: `${player1health}` },
                                { name: `${player2.username}'s health`, value: `${player2health}`},
                                { name: `${message.author.username}'s shield`, value: `${player1defense}`},
                                { name: `${player2.username}'s shield`, value: `${player2defense}`}
                            )
                            .setFooter(`${message.author.username} increased their defense by 10 points!`)
                            runloop(retryCount+1)
                        } else if (buttono.customId == "end") {
                            message.channel.send(`${message.author.username} chose to end the game lol`)
                            return;
                        } else {
                            runloop(retryCount)
                        }
                        buttono.reply({ content: 'Button received', ephemeral: true });
                    }
                });
            } else if (retryCount % 2 == 0) {
                sentmessage = await message.channel.send({ content: `Here are your choices, ${player2.username}`, components: [fightrow]})
                //player 2
                buttonchecker.on('collect', (buttono) => {
                    if (buttono.customId == "fight") {
                        dealt = Math.floor(Math.random() * 30)
                        if (player1defense > 0) {
                            dealt = dealt / Math.floor(player1defense / 10)
                        }
                        player1health -= dealt 
                        statsembed = new Discord.MessageEmbed()
                        .addFields(
                            { name: `${message.author.username}'s health`, value: `${player1health}` },
                            { name: `${player2.username}'s health`, value: `${player2health}`},
                            { name: `${message.author.username}'s shield`, value: `${player1defense}`},
                            { name: `${player2.username}'s shield`, value: `${player2defense}`}
                        )
                        .setFooter(`${player2.username} dealt **${dealt}** damage!`)
                        runloop(retryCount+1)
                    } else if (buttono.customId == "shield") {
                        if (player2defense >= 50) {
                            statsembed = new Discord.MessageEmbed()
                            .addFields(
                                { name: `${message.author.username}'s health`, value: `${player1health}` },
                                { name: `${player2.username}'s health`, value: `${player2health}`},
                                { name: `${message.author.username}'s shield`, value: `${player1defense}`},
                                { name: `${player2.username}'s shield`, value: `${player2defense}`}
                            )
                            .setFooter(`${player1defense}'s defense is at the max!`)
                            runloop(retryCount + 1)
                        }
                        player2defense += 10
                        statsembed = new Discord.MessageEmbed()
                        .addFields(
                            { name: `${message.author.username}'s health`, value: `${player1health}` },
                            { name: `${player2.username}'s health`, value: `${player2health}`},
                            { name: `${message.author.username}'s shield`, value: `${player1defense}`},
                            { name: `${player2.username}'s shield`, value: `${player2defense}`}
                        )
                        .setFooter(`${player2.username} increased their defense by 10 points!`)
                        runloop(retryCount+1)
                    } else if (buttono.customId == "end") {
                        message.channel.send(`${player2.username} chose to end the game lol`)
                    } else {
                        //message.channel.send("That's not an option!")
                        //collected.first().delete()
                        //sentmessage.delete()
                        //statsmessage.delete()
                        runloop(retryCount)
                    }
                    buttono.reply({ content: 'Button received', ephemeral: true });
                })
            }
        }
        function runloop(retryCount) {
            let statsmessage = message.channel.send({ embeds: [statsembed] })
            if ((player1health <= 0) || (player2health <= 0)) {
                return;
                //move end message here because i think it's bugging out
            }
            awaitMessages(retryCount)
        }
            runloop(0, message)
            if (player1health <= 0) {
                //player 2 won
                return message.channel.send(`${player2} won with ${player2health} HEALTH!`)
            } else if (player2health <= 0) {
                //player 1 won
                return message.channel.send(`${message.author} won with ${player1health} HEALTH!`)
            }*/
        async function awaitMessages(retryCount) { 
            if (retryCount % 2 != 0) {
                sentmessage = await message.channel.send(`Here are your choices, ${message.author.username}\n\`fight\` | \`shield\` | \`end\``)
                //player 1
                message.channel.awaitMessages(m => m.author.id == message.author.id, { max: 1, time: 30000 }).then(collected => {
                    if (collected.first().content.toLowerCase() == "fight") {
                        dealt = Math.floor(Math.random() * 30)
                        if (player2defense > 0) {
                            dealt = dealt / Math.floor(player2defense / 10)
                        }
                        //dealt = dealt - (Math.floor(player2defense/dealt)*(player2defense/10))
                        //message.channel.send(`${message.author.username} dealt **${dealt}** DAMAGE!`)
                        player2health -= dealt
                        //collected.first().delete()
                        //sentmessage.delete()
                        //statsmessage.delete()
                        statsembed = new Discord.MessageEmbed()
                        .addFields(
                            { name: `${message.author.username}'s health`, value: `${player1health}` },
                            { name: `${player2.username}'s health`, value: `${player2health}`},
                            { name: `${message.author.username}'s shield`, value: `${player1defense}`},
                            { name: `${player2.username}'s shield`, value: `${player2defense}`}
                        )
                        .setFooter(`${message.author.username} dealt **${dealt}** damage!`)
                        runloop(retryCount+1, collected.first())
                    } else if (collected.first().content.toLowerCase() == "shield") {
                        if (player1defense >= 50) {
                            //message.channel.send("your defense is at the max");
                            statsembed = new Discord.MessageEmbed()
                            .addFields(
                                { name: `${message.author.username}'s health`, value: `${player1health}` },
                                { name: `${player2.username}'s health`, value: `${player2health}`},
                                { name: `${message.author.username}'s shield`, value: `${player1defense}`},
                                { name: `${player2.username}'s shield`, value: `${player2defense}`}
                            )
                            .setFooter(`${player1defense}'s defense is at the max!`)
                            runloop(retryCount + 1, collected.first())
                        }
                        //defenseincrease = Math.floor(Math.random() * 20);
                        //message.channel.send(`${player2.username} increased their defense by **${defenseincrease}**!`)
                        //message.channel.send(`${message.author.username} increased their defense by **10**!`)
                        //collected.first().delete()
                        //sentmessage.delete()
                        //statsmessage.delete()
                        player1defense += 10
                        statsembed = new Discord.MessageEmbed()
                        .addFields(
                            { name: `${message.author.username}'s health`, value: `${player1health}` },
                            { name: `${player2.username}'s health`, value: `${player2health}`},
                            { name: `${message.author.username}'s shield`, value: `${player1defense}`},
                            { name: `${player2.username}'s shield`, value: `${player2defense}`}
                        )
                        .setFooter(`${message.author.username} increased their defense by 10 points!`)
                        //player1defense += defenseincrease
                        runloop(retryCount+1, collected.first())
                    } else if (collected.first().content.toLowerCase() == "end") {
                        message.channel.send(`${message.author.username} chose to end the game lol`)
                        return;
                    } else {
                        //collected.first().delete()
                        //sentmessage.delete()
                        //statsmessage.delete()
                        //message.channel.send("That's not an option!")
                        runloop(retryCount, collected.first())
                    }
                }).catch((error) => {
                    console.log(error);
                    message.channel.send(`${message.author.username} probably didn't respond in time :/`)
                    return;
                })
            } else if (retryCount % 2 == 0) {
                sentmessage = await message.channel.send(`Here are your choices, ${player2.username}\n\`fight\` | \`shield\` | \`end\``)
                //player 2
                message.channel.awaitMessages(m => m.author.id == player2.id, { max: 1, time: 30000 }).then(collected => {
                    if (collected.first().content.toLowerCase() == "fight") {
                        dealt = Math.floor(Math.random() * 30)
                        if (player1defense > 0) {
                            dealt = dealt / Math.floor(player1defense / 10)
                        }
                        //dealt = dealt - (Math.floor(player2defense/dealt)*(player2defense/10))
                        //message.channel.send(`${player2.username} dealt **${dealt}** DAMAGE!`)
                        player1health -= dealt 
                        //collected.first().delete()
                        //sentmessage.delete()
                        //statsmessage.delete()
                        statsembed = new Discord.MessageEmbed()
                        .addFields(
                            { name: `${message.author.username}'s health`, value: `${player1health}` },
                            { name: `${player2.username}'s health`, value: `${player2health}`},
                            { name: `${message.author.username}'s shield`, value: `${player1defense}`},
                            { name: `${player2.username}'s shield`, value: `${player2defense}`}
                        )
                        .setFooter(`${player2.username} dealt **${dealt}** damage!`)
                        runloop(retryCount+1, collected.first())
                    } else if (collected.first().content.toLowerCase() == "shield") {
                        if (player2defense >= 50) {
                            //message.channel.send("your defense is at the max");
                            statsembed = new Discord.MessageEmbed()
                            .addFields(
                                { name: `${message.author.username}'s health`, value: `${player1health}` },
                                { name: `${player2.username}'s health`, value: `${player2health}`},
                                { name: `${message.author.username}'s shield`, value: `${player1defense}`},
                                { name: `${player2.username}'s shield`, value: `${player2defense}`}
                            )
                            .setFooter(`${player1defense}'s defense is at the max!`)
                            runloop(retryCount + 1)
                        }
                        //defenseincrease = Math.floor(Math.random() * 20);
                        //message.channel.send(`${player2.username} increased their defense by **${defenseincrease}**!`)
                        //message.channel.send(`${player2.username} increased their defense by **10**!`)
                        //player1defense += defenseincrease
                        player2defense += 10
                        //collected.first().delete()
                        //sentmessage.delete()
                        //statsmessage.delete()
                        statsembed = new Discord.MessageEmbed()
                        .addFields(
                            { name: `${message.author.username}'s health`, value: `${player1health}` },
                            { name: `${player2.username}'s health`, value: `${player2health}`},
                            { name: `${message.author.username}'s shield`, value: `${player1defense}`},
                            { name: `${player2.username}'s shield`, value: `${player2defense}`}
                        )
                        .setFooter(`${player2.username} increased their defense by 10 points!`)
                        runloop(retryCount+1, collected.first())
                    } else if (collected.first().content.toLowerCase() == "end") {
                        message.channel.send(`${player2.username} chose to end the game lol`)
                    } else {
                        //message.channel.send("That's not an option!")
                        //collected.first().delete()
                        //sentmessage.delete()
                        //statsmessage.delete()
                        runloop(retryCount, collected.first())
                    }
                }).catch((error) => {
                    console.log(error);
                    message.channel.send(`${player2.username} probably didn't respond in time`)
                    return;
                })
            }
        }
        function runloop(retryCount, msg) {
            //statsmessage.edit(statsembed)
            let statsmessage = msg.channel.send({ embeds: [statsembed] })
            if ((player1health <= 0) || (player2health <= 0)) {
                return;
                //move end message here because i think it's bugging out
            }
            awaitMessages(retryCount)
            //await new Promise(r => setTimeout(r, 1000))
        }
        //message.channel.send("hey. you've stumbled on a command that hasn't been devved yet. check back later!");
        //while ((player1health > 0) && (player2health > 0)) {
        runloop(0, message)
        //}
        if (player1health <= 0) {
            //player 2 won
            return message.channel.send(`${player2} won with ${player2health} HEALTH!`)
        } else if (player2health <= 0) {
            //player 1 won
            return message.channel.send(`${message.author} won with ${player1health} HEALTH!`)
        }
    }
}