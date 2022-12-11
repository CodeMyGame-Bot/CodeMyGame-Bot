const { Collection, Client, GatewayIntentBits, REST, Events, PresenceUpdateStatus, ActivityType, EmbedBuilder } = require('discord.js');
require('dotenv').config();
// const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { clientId } = require('./config.json');
const fs = require('node:fs');
const path = require('node:path');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ],
});

// let prefix = process.env.prefix;

client.commands = new Collection();
const commands = [];
const commandPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(path.join(commandPath, file));

    if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
        commands.push(command.data.toJSON());
    } else {
        console.warn(`Comamnd at path ${path.join(commandPath, file)} is missing 'data' or 'execute' field. This command might not work correctly.`);
    }
}

const rest = new REST({ version: '9' }).setToken(process.env.token);


(async () => {
    try {
        console.log('Started updating application (/) commands');

        await rest.put(
            Routes.applicationCommands(clientId),
            { body: commands }
        );

        console.log(`Successfully updated application (/) commands!`);
    } catch (error) {
        console.error(error);
    }
})();

const cooldowns = new Collection();
// const interactioncooldowns = new Collection();

client.once(Events.ClientReady, async () => {
    client.user.setPresence({ status: PresenceUpdateStatus.Online, activities: [{ name: 'CodeMyGame code me', type: ActivityType.Watching }] })
    console.log("Bot is ready!");
});

// client.on(Events.MessageCreate, async message => {
//     if (message.author.bot) {
//         return;
//     }

//     if (!message.content.startsWith(prefix)) return;

//     let args = message.content.slice(prefix.length).trim().split(/ +/);
//     let command = args.shift().toLowerCase();

//     //TASK: move funcommands to commands/ file system organizer
//     /*async function funcommands() {
//         if (message.content.includes("+") && message.content.startsWith(prefix) && !client.commands.has(command)) {
//             let addends = message.content.slice(prefix.length).trim().split("+");
//             let addend1 = addends[0]
//             let addend2 = addends[1]
//             let addend1test = parseInt(addends[0], 10);
//             let addend2test = parseInt(addends[1], 10);
//             let sum = addend1test + addend2test;
//             let sum_message = await message.reply({ content: addends[0] + " plus " + addends[1] + " equals " + sum + "." });
//         } else if (message.content.includes("-") && message.content.startsWith(prefix) && !client.commands.has(command)) {
//             let addends = message.content.slice(prefix.length).trim().split("-");
//             let one = parseInt(addends[0], 10);
//             let two = parseInt(addends[1], 10);
//             let difference = one - two;
//             message.reply({ content: addends[0] + " minus " + addends[1] + " equals " + difference + "." });
//         } else if (message.content.includes("*") && message.content.startsWith(prefix) && !client.commands.has(command)) {
//             let addends = message.content.slice(prefix.length).trim().split("*");
//             let one = parseInt(addends[0], 10);
//             let two = parseInt(addends[1], 10);
//             let product = one * two;
//             let multiply_message = await message.reply({ content: addends[0] + " times " + addends[1] + " equals " + product + "." });
//             if (isNaN(sum)) {
//                 if (isNaN(one) && !isNaN(two)) {
//                     let tempstr = "";
//                     let stringo = addends[0]
//                     let iterator = two;
//                     for (let i = 0; i < iterator; i++) {
//                         tempstr = tempstr + stringo
//                         if (tempstr.length > 1990) {
//                             message.reply(tempstr)
//                             tempstr = ""
//                             break;
//                         }
//                     }
//                     message.channel.send("If you did not get a multiplied message, it is probably because the message that resulted exceeds the Discord limit of 2000 characters per message")
//                     message.reply(tempstr);
//                     multiply_message.delete();

//                 } else {
//                     message.channel.send("NaN is Not a Number, meaning you probably added a non-number to a number (a string to a number)");
//                 }
//             }
//         } else if (message.content.includes("/") && message.content.startsWith(prefix) && !client.commands.has(command)) {
//             let addends = message.content.slice(prefix.length).trim().split("/");
//             let one = parseInt(addends[0], 10);
//             let two = parseInt(addends[1], 10);
//             if (two === 0) {
//                 message.channel.send("I. am. absolutely. done.");
//                 return;
//             }
//             let quotient = one / two;
//             message.reply(addends[0] + " divided by " + addends[1] + " equals " + quotient + ".");
//         }
//     }
//     funcommands()*/

    

//     /*if (command == "setprefix") {
//         prefix = args[0]
//         message.channel.send("Set prefix!")
//     }*/
//     //profile commands
//     /*if (command == "setdesc" && message.channel.type === "dm") {
//         let desc = args.join(" ")
//         const affectedRows = await userinfo.update({ description: desc }, { where: { name: message.author.username } });
//         return client.users.cache.get(message.author.id).send(`Description updated to ${desc}`);
//     } else if (command == "getdesc") {
//         let userdesc = await userinfo.findOne({ where: { name: message.author.username }});
//         return client.users.cache.get(message.author.id).send(userdesc.get("description"));
//     //} else if (command == "todolist") {
//     //    let todolistorder = todolist.findAll({ attributes: ['order'] })
//     //    let todoliststr = todolist.findAll({ attributes: })
//     } else if (command == "profile") {
//         let profilebal = await baloncesto.findOne({ where: { name: message.author.username }});
//         let profiledesc = await userinfo.findOne({ where: { name: message.author.username }});
//         let profileDisplay = new Discord.MessageEmbed()
//         .addFields(
//             { name: "Balance", value: `${profilebal} coins` },
//             { name: "Description", value: profiledesc}
//         )
//         //...
//         return client.users.cache.get(message.author.id).send({ embeds: [profileDisplay] })
//     }*/ 

//     if (!client.commands.has(command)) return;

//     if (!cooldowns.has(command)) {
//         cooldowns.set(command, new Collection());
//     }

//     let timestamps = cooldowns.get(client.commands.get(command).name);

//     if (!client.application.owner) await client.application.fetch();
    
//     if (timestamps.has(message.author.id)) {
//         let now = Date.now();
//         let cooldownAmount = (client.commands.get(command).cooldown || 2) * 1000; 
//         let expirationTime = timestamps.get(message.author.id) + cooldownAmount;

//         if (now < expirationTime) {
//             let timeLeft = (expirationTime - now) / 1000;
//             let expirationEmbed = new Discord.MessageEmbed()
//                 .setTitle(`Wait ${timeLeft.toFixed(1)} seconds`)
//                 .setDescription(`We have a small cooldown, just so the bot is all okay. Wait ${timeLeft.toFixed(1)} seconds, thanks :)`)
//                 .setImage(message.author.displayAvatarURL())
//                 .setTimestamp()
//                 .setFooter('This bot is \'very\' big')
//             return message.channel.send({ embeds: [expirationEmbed]} )
//         }
//     }

//     if (!client.application.owner) await client.application.fetch();

//     timestamps.set(message.author.id, now);
//     setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

//     try {
//         let extraarguments = {'client': client};
//         client.commands.get(command).execute(message, args, extraarguments); //message, args, baloncesto, client
//     } catch (error) {
//         message.reply('Error');
//         console.log(error);
//     }
// });

client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) {
        return;
    }

    if (!cooldowns.has(interaction.commandName)) {
        cooldowns.set(interaction.commandName, new Collection());
    }
    
    let now = Date.now();
    let timestamps = cooldowns.get(interaction.commandName);
    let cooldownAmount = (client.commands.get(interaction.commandName) || 10) * 1000;
    
    if (timestamps.has(interaction.user.id)) {
        let expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;

        if (now < expirationTime) {
            let timeLeft = (iexpirationTime - inow) / 1000;
            let expirationEmbed = new EmbedBuilder()
                .setTitle(`Wait ${timeLeft.toFixed(1)} seconds`)
                .setDescription(`We have a small cooldown, just so the bot is all okay. Please wait ${timeLeft.toFixed(1)} seconds, thanks :)`)
                .setImage(interaction.user.displayAvatarURL())
                .setTimestamp()
                .setFooter('This bot is \'very\' big');
            return interaction.reply({ embeds: [expirationEmbed], ephemeral: true });
        }
    }

    /* 
    //profile commands
    if (icommand === 'setdesc') { //add dev to end when devving
        try { 
            let desc = interaction.options.get('profiledescription').value
            let affectedRows = await userinfo.update({ description: desc }, { where: { name: interaction.member.user.username } });
            await interaction.reply({ content: `Description updated to ${desc}`, ephemeral: true})
        } catch (error) {
            console.log(error)
        }
    } else if (icommand === 'getdesc') { //add dev to end when devving
        try {
            let userdesc = await userinfo.findOne({ where: { name: interaction.member.user.username }});
            await interaction.reply({ content: userdesc.get("description") });
        } catch (error) {
            console.log(error)
        }
    } else if (icommand === 'profile') { //add dev to end when devving
        try {
            let profilebal = await baloncesto.findOne({ where: { name: interaction.user.username }});
            let profiledesc = await userinfo.findOne({ where: { name: interaction.user.username }});
            let profileDisplay = new Discord.MessageEmbed()
                .addFields(
                    { name: "Balance", value: `${profilebal.balance} coins` },
                    { name: "Description", value: profiledesc.description}
                );
                await interaction.reply({ embeds: [profileDisplay], ephemeral: true });
        } catch (error) {
            console.log(error)
        }
    }*/

    try {
        const commandExists = client.commands.get(interaction.commandName);
        if (!commandExists) {
            interaction.reply('You invoked a command that is no longer supported. CodeMyGame must\'ve forgotten to refresh his slash commands :/.');
        } else {
            client.commands.get(interaction.commandName).execute(interaction, client);
        }
    } catch (error) {
        interaction.reply('An error occured while trying to handle your interaction');
        console.error(error);
    }
});

client.login(process.env.token);