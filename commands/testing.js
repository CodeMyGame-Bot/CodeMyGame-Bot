const moment = require("moment");
const { MessageActionRow, MessageButton, MessageSelectMenu } = require('discord.js');
const Discord = require('discord.js');

module.exports = {
    name: "testing",
    cooldown: 60,
    description: "I'll just dump some js here, hope it works!",
    execute(message, args, extraarguments) {
        //const waittime = 10000
        //message.channel.send("```js\n//How to dm\nmessage.author.send(\"How are you?\")\n//How to mention\n<@user-id-here>```");
        //message.reply("```js\n//If you have any questions, use this command and your question will be answered```")
        /*function waitForMessage(retryCount) {
            message.channel.awaitMessages(m => m.author.id == message.author.id, {max: 1, time: waittime}).then(collected => {
                // only accept messages by the user who sent the command
                // accept only 1 message, and return the promise after 30000ms = 30s

                // first (and, in this case, only) message of the collection
                message.channel.send(collected.first().content)
                if(retryCount < 10){
                    test(retryCount+1)
                }
            }).catch(() => {
                if(retryCount < 10){
                    test(retryCount+1)
                }
            });
        }
        async function test(retryCount) {
            message.channel.send("Enter something: "+ retryCount)
            waitForMessage(retryCount)
        }
        test(0)*/
        const waittime = 10000;
        let thisdudejustdidntreply = false;
        let parameters = [];
        let prefix = process.env.prefix
        async function playMusic() {
            let connection;
            if (message.member.voice.channel) {
                connection = await message.member.voice.channel.join();
            } else {
                message.channel.send("Not in a voice channel :(");
            }
            // Create a dispatcher
            const dispatcher = connection.play('Music Idea 1.m4a');

            dispatcher.on('start', () => {
                console.log('Music Idea 1.m4a is now playing!');
            });

            dispatcher.on('finish', () => {
                console.log('Music Idea 1.m4a has finished playing!');
                connection.disconnect();
            });

            // Always remember to handle errors appropriately!
            dispatcher.on('error', console.error);

        }
        class messAround {
            constructor(name, type, color, age) {
                this.name = name;
                this.type = type;
                this.color = color;
                this.age = age;
            }
            returnName() {
                return this.name;
            }
            returnType() {
                return this.type;
            }
            returnColor() {
                return this.color;
            }
            returnAge() {
                return this.age;
            }
        }
        function waitForMessage(retryCount) {
            message.channel.awaitMessages(m => m.author.id == message.author.id, {max: 1, time: waittime}).then(collected => {
                // only accept messages by the user who sent the command
                // accept only 1 message, and return the promise after 30000ms = 30s

                // first (and, in this case, only) message of the collection
                parameters.push(collected.first().content);
                if(retryCount < 3) {
                    test(retryCount+1)
                } else {
                    if (thisdudejustdidntreply == false) {
                        testClass = new messAround(parameters[0], parameters[1], parameters[2], parameters[3]);
                        message.channel.send("Name: " + testClass.returnName());
                        message.channel.send("Type: " + testClass.returnType());
                        message.channel.send("Color: " + testClass.returnColor());
                        message.channel.send("Age: " + testClass.returnAge());
                    } else {
                        message.channel.send("You were supposed to reply");
                        message.channel.send("Ok now you have to restart the whole command :(");
                        testClass = null;
                    }
                }
            }).catch(() => {
                thisdudejustdidntreply = true
            });
        }
        async function test(retryCount) {
            //questions = ["Name: ", "Type: ", "Color: ", "Age: "];
            //message.channel.send(questions[retryCount]);
            //waitForMessage(retryCount);
            let msgs = message.channel.messages.cache.sort();
            let msgdiff = parseInt(message.channel.lastMessage.createdTimestamp, 10) - parseInt(message.channel.messages.cache.sort().first().createdTimestamp, 10);
            message.channel.send(msgdiff.toString());
        }
        async function discordTimestampTest() {
            let day = moment("2021-6-6 20:13", "YYYY/MM/DD H:mm").valueOf();
            console.log(day)
            message.channel.send(`<t:${day}:R>`)
        }
        /*async function slashcommandstest() {
            if (!client.application?.owner) await client.application?.fetch();
            if (message.author.id === client.application?.owner.id) {
                const data = {
                    name: 'awesome',
                    description: 'Replies with Pong!',
                };

                const command = await message.guild.commands.create(data);
                console.log("DON")
                console.log(command);
            }
        }*/
        async function buttonstest() {
            const row = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setCustomId('fight')
					.setLabel('fight')
					.setStyle('PRIMARY'),
                new MessageButton()
					.setCustomId('shield')
					.setLabel('shield')
					.setStyle('SUCCESS'),
                new MessageButton()
					.setCustomId('end')
					.setLabel('end')
					.setStyle('DANGER'),
		    );
            //message.channel.send({ content: "Choose an option!", components: [row] })
            /*client.on('interactionCreate', async interaction => {
                //await interaction.defer();
                if (interaction.customId == 'fight') {
                    await interaction.reply({ content: 'You decide to fight.', components: []});
                } else if (interaction.customId = 'shield') {
                    await interaction.reply({ content: 'You decide to shield', components: []});
                } else if (interaction.customId = 'end') {
                    await interaction.reply({ content: 'You decide to end', components: []});
                }
            });*/
        }
        async function deployslashcommand() {
            if (message.author.id === extraarguments["client"].application.owner.id) {
                let commanddev = ""
                if (process.env.dev === "true") {
                    commanddev = "dev"
                }
                const data = [{
                    name: `eightball${commanddev}`,
                    description: 'Enter a question that the 8ball can answer!',
                    options: [{
                        name: 'eightballq',
                        type: 'STRING',
                        description: '8ball question!',
                        required: true,
                    }],
                }, {
                    name: `pingo${commanddev}`,
                    description: "Replies with bot ping status",
                }, {
                    name: `random${commanddev}`,
                    description: "Returns a random number using the given max limit",
                    options: [{
                        name: 'max',
                        type: 'INTEGER',
                        description: 'Max limit of random number (min is 0 by default)',
                        required: true,
                    }],
                }, {
                    name: `areac${commanddev}`,
                    description: "Computes the area of a circle given the radius",
                    options: [{
                        name: 'radius',
                        type: 'STRING',
                        description: 'The radius of the given circle',
                        required: true,
                    }],
                }, {
                    name: `circumference${commanddev}`,
                    description: "Computes the circumference (perimeter) of a circle given the radius",
                    options: [{
                        name: 'radius',
                        type: 'STRING',
                        description: 'The radius of the given circle',
                        required: true,
                    }],
                }, {
                    name: `areat${commanddev}`,
                    description: "Computes the area of a triangle given base and height",
                    options: [{
                        name: 'base',
                        type: 'STRING',
                        description: 'The base of the given triangle',
                        required: true,
                    }, {
                        name: 'height',
                        type: 'STRING',
                        description: 'The height of the given triangle',
                        required: true,
                    }],
                }, {
                    name: `hex${commanddev}`,
                    description: "Converts two hexadecimals to a binary byte",
                    options: [{
                        name: 'hexadecimal',
                        type: 'STRING',
                        description: 'Two consecutive hexadecimal numbers (0-9, A-F)',
                        required: true,
                    }],
                }, {
                    name: `setdesc${commanddev}`,
                    description: "Sets your profile's description [PRIVATE]",
                    options: [{
                        name: 'profiledescription',
                        type: 'STRING',
                        description: 'Description for your profile [PRIVATE]',
                        required: true,
                    }],
                }, {
                    name: `getdesc${commanddev}`,
                    description: "Gets your profile's description [PRIVATE]",
                }, {
                    name: `profile${commanddev}`,
                    description: "Displays your profile [PRIVATE]",
                }, {
                    name: `bal${commanddev}`,
                    description: "Balances!"
                }, {
                    name: `devlook${commanddev}`,
                    description: "A look into the future features of the bot!"
                }, {
                    name: `progress${commanddev}`,
                    description: "Just a simple progress bar!",
                    options: [{
                        name: 'noofbars',
                        type: 'INTEGER',
                        description: 'Number of progress bars',
                        required: true,
                    }, {
                        name: 'waittime',
                        type: 'INTEGER',
                        description: 'How long to wait between each ',
                        required: true,
                    }]
                }, {
                    name: `rich${commanddev}`,
                    description: "Get your money count here! GLOBAL leaderboard (trying to make it only server-wide)"
                }, {
                    name: `timestampconvert${commanddev}`,
                    description: "Converting ISO dates to Unix timestamps",
                    options: [{
                        name: 'date',
                        type: 'STRING',
                        description: "The ISO-conforming date",
                        required: true,
                    }]
                }, {
                    name: `version${commanddev}`,
                    description: "It'll just tell you the version of the bot!" 
                }];
                let command;
                let d = new Date();
                console.log("I GOT HERE!");
                console.log(process.env.dev);
                console.log(process.env.dev == "false")
                console.log(typeof process.env.dev);
                if (process.env.dev === "true") {
                    console.log(`DEV COMMANDS DEPLOYING ${d}`)
                    command = await message.guild.commands.set(data);
                } else if (process.env.dev == "false" || process.env.dev == false) {
                    console.log("ello got here too")
                    console.log(`DEPLOYMENT COMMAND DEPLOYING ${d}`)
                    command = await extraarguments["client"].application.commands.set(data);
                }
                console.log(command);
            } 
        }
        if(args[0] == "test") {
            test(0);
        } else if (args[0] == "playMusic") {
            playMusic();
        } else if (args[0] == "timestamp") {
            discordTimestampTest();
        } /*else if (args[0] == "slashcommands") {
            slashcommandstest();
        }*/ else if (args[0] == "buttons") {
            buttonstest();
        } else if (args[0] == "deploycommand") {
            deployslashcommand();
        } else {
            message.channel.send("INVALID");
        }
    }
}
