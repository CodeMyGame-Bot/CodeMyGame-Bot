const { SystemChannelFlags } = require("discord.js");

module.exports = {
    name: "guessinggame",
    cooldown: 60,
    description: "A simple guessing game using discord.js! v2.0.0 UPDATE: HINTS!!!",
    execute(message, args) {
        message.channel.send("Guessing Game v2.1.0 (fixed a bug with hints)!")
        const waittime = 15000;
        let finished = false;
        let hints = 3;
        let guesses = [];
        hintGuesses = [0, 0];
        function getRandomInt(max) {
            return Math.floor(Math.random() * Math.floor(max));
        }
        compNum = getRandomInt(101)
        function waitForMessage(retryCount) {
            message.channel.awaitMessages(m => m.author.id == message.author.id, { max: 1, time: waittime }).then(collected => {
                // only accept messages by the user who sent the command
                // accept only 1 message, and return the promise after 30000ms = 30s

                // first (and, in this case, only) message of the collection
                if (collected.first().content == "hint") {
                    retryCount = retryCount - 1;
                    if (retryCount < 5) {
                        message.channel.send("Too early to use a hint!");
                    } else if (hints == 0) {
                        message.channel.send("Ran out of hints!");
                    } else {
                        hints = hints - 1;
                        try {
                            distance = Math.abs(parseInt(hintGuesses[1], 10) - compNum);
                        } catch (error) {
                            console.error(error)
                        }
                        console.log(distance);
                        if (distance < 5) {
                            message.channel.send("SUUPER HOT (5)");
                        } else if (distance < 10) {
                            message.channel.send("hot (10)");
                        } else if (distance < 20) {
                            message.channel.send("warm (20)");
                        } else if (distance < 30) {
                            message.channel.send("cool (30)");
                        } else if (distance < 50) {
                            message.channel.send("Chilly (50)");
                        } else if (distance < 80) {
                            message.channel.send("SUUUUPER chilly (80)");
                        } 
                    }
                }
                if (parseInt(collected.first().content, 10) == compNum) {
                    guesses = guesses + collected.first().content
                    hintGuesses[0] = 0
                    hintGuesses[1] = 0
                    finished = true;
                } else if (parseInt(collected.first().content, 10) > compNum) {
                    guesses = guesses + collected.first().content + ", "
                    hintGuesses[0] = hintGuesses[1]
                    hintGuesses[1] = collected.first().content
                    message.reply("Too high!");
                } else if (parseInt(collected.first().content, 10) < compNum) {
                    guesses = guesses + collected.first().content + ", "
                    hintGuesses[0] = hintGuesses[1]
                    hintGuesses[1] = collected.first().content
                    message.reply("Too low!");
                }

                if (retryCount < 10) {
                    if (finished == true) {
                        message.channel.send("Good job! The number was " + compNum);
                        message.channel.send("Your guesses: " + guesses);
                    } else {
                        runLoop(retryCount + 1)
                    }
                } else {
                    message.channel.send("Good try! The number was: " + retryCount);
                }
            }).catch((error) => {
                console.log(error)
                if (retryCount < 10) {
                    message.channel.send("Lost a guess!")
                    runLoop(retryCount + 1)
                }
            });
        }
        async function runLoop(retryCount) {
            message.reply("Guess a number between 1 and 100 (Guess Count: " + retryCount + "): ")
            waitForMessage(retryCount)
        }
        runLoop(0)
        /*const waittime = 5000;
        let guessed = false;
        function getRandomInt(max) {
            return Math.floor(Math.random() * Math.floor(max));
        }
        compNum = getRandomInt(101)
        message.channel.send("IN DEVELOPMENT")
        async function guess() {
            for (let i = 0; i < 10; i++) {
                if (guessed == true) {
                    break;
                }
                message.reply("Guess a number between 1 and 100")
                    await new Promise(r => setTimeout(r, waittime))
                message.channel.awaitMessages(m => m.author.id == message.author.id, {max: 1, time: waittime}).then(collected => {
                        // only accept messages by the user who sent the command
                        // accept only 1 message, and return the promise after 30000ms = 30s

                        // first (and, in this case, only) message of the collection
                        if (parseInt(collected.first().content, 10) == compNum) {
                            message.reply("Good job! The number was: " + compNum + ".");
                            let guessed = true;
                        } else if (parseInt(collected.first().content, 10) > compNum) {
                            message.reply("Too high!")
                        } else if (parseInt(collected.first().content, 10) < compNum) {
                            message.reply("Too low!")
                        }
                        else {
                            message.reply("Error.")
                        }
                }).catch(() => {
                    message.reply("Well you didn't reply within " + (waittime/1000) + " seconds. Lost a guess.");
                });
            }
            if (guessed = false) {
                message.reply("Good try! The number was " + compNum + ".");
            }
        }*/
    }
}