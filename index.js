/*
* unnecessary dependencies for now
- "chalk": "^4.1.1",
        "ffmpeg-static": "^4.4.0",
        "libsodium-wrappers": "^0.7.9",
        "sequelize": "^6.6.5",
        "sqlite3": "^4.2.0"

*/

const { Collection, Client, GatewayIntentBits, Embed, ContextMenuCommandBuilder } = require('discord.js');
require('dotenv').config()
const fs = require('fs');

//removed "token" from imports in config.json, and removed token from config.json

//TESTING : remove prefix
//const { version, unstable_test_release } = require('./config.json');
const Sequelize = require('sequelize');

let prefix = process.env.prefix

// const client = new Discord.Client({ intents: ['GUILDS', 'GUILD_MESSAGES'], partials: ['CHANNEL'] });
const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent
    ],
  });

client.commands = new Collection();
client.slashcommands = new Collection();
testingcommandslist = []

const sequelize = new Sequelize('database', 'user', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	storage: 'database.sqlite',
});

const baloncesto = sequelize.define('balances', {
    name: {
        type: Sequelize.STRING,
        unique: true,
    },
    balance: Sequelize.FLOAT
})

//IN DEV
const userinfo = sequelize.define('profile', {
    name: {
        type: Sequelize.STRING,
        unique: true,
    },
    description: Sequelize.STRING,
    //notes: Sequelize.STRING,  
})

//for now, can only add to bottom, however, use uidorder later if user can add to anywhere in the list
const todolist = sequelize.define('todo', {
    id: {
        type: Sequelize.STRING,
        primaryKey: true,
    },
    order: Sequelize.INTEGER,
    /*uidorder: {
        type: Sequelize.STRING,
        unique: true,
    },*/
    whattodo: Sequelize.STRING,
});

const fun_commands_regex = {
    "adder": /asf/
}

/*const prefixes = sequelize.define('prefix', {
    guildid: {
        type: Sequelize.STRING,
        unique: true,
    },
    prefix: Sequelize.STRING
})*/

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
const slashCommandFiles = fs.readdirSync('./slashcommands').filter(file => file.endsWith('.js'));

for (let file of commandFiles) {
    let command = require(`./commands/${file}`);

    client.commands.set(command.name, command);
    testingcommandslist.push(command.name, command.description)
}

for (let file of slashCommandFiles) {
    let slashcommand = require(`./slashcommands/${file}`);

    client.slashcommands.set(slashcommand.name, slashcommand);
}

const cooldowns = new Collection();
const interactioncooldowns = new Collection();
//let guildprefix = "";
//let prefix = "";
async function setCatchString() {
    if (!client.application.owner) await client.application.fetch();
    catchstring = `Sorry, something weird happened ;c. Contact ${client.application.owner.username} ${client.application.owner.username} to notify them of this error.`;
    return catchstring;
}
let catcherrorreply;
//error ID implementation, if multiple errors come in and you need to identify which one came from which person

client.once('ready', async () => {
    baloncesto.sync()
    userinfo.sync()
    console.log(client.guilds.cache.map(g => g.name).join(", "));
    catcherrorreply = await setCatchString();
});

client.login(process.env.token);

client.on('messageCreate', async message => { //make it so that commands only issued in servers except profile and stuff
    if (message.author.bot) {
        return;
    } else if (!await baloncesto.findOne({ where: { name: message.author.username } })) {
        const baloncestoadded = await baloncesto.create({
            name: message.author.username,
            balance: 500
        });
    } else if (!await userinfo.findOne({ where: { name: message.author.username } })) {
        const userinfoadded = await userinfo.create({
            name: message.author.username,
            description: "",
            notes: "",
        });
    }

    const extracommandslist = ["addSpace", "pyramid", ""]

    if (message.content === "print sample error") {
        console.log("sample error requested")
        message.channel.send("I am sorry, but an exception has occured at line <line> and has caused the program to crash. Please refer to our help desk at <telephone #> or at <website link> for more information on how to fix this.")
        return;
    } 

    if (!message.content.startsWith(prefix)) return; // || message.author.bot) return;
    /*if (await prefixes.findOne({where: { guildid: message.channel.guild.id }})) {
        guildprefix = await prefixes.findOne({where: { guildid: message.channel.guild.id }})
        prefix = guildprefix.get('prefix');
    } else {
        prefix = prefixarchived
    }*/

    let args = message.content.slice(prefix.length).trim().split(/ +/);
    let command = args.shift().toLowerCase();

    //TASK: move funcommands to commands/ file system organizer
    async function funcommands() {
        if (message.content.includes("+") && message.content.startsWith(prefix) && !client.commands.has(command)) {
            let addends = message.content.slice(prefix.length).trim().split("+");
            let addend1 = addends[0]
            let addend2 = addends[1]
            let addend1test = parseInt(addends[0], 10);
            let addend2test = parseInt(addends[1], 10);
            let sum = addend1test + addend2test;
            let sum_message = await message.reply({ content: addends[0] + " plus " + addends[1] + " equals " + sum + "." });
        } else if (message.content.includes("-") && message.content.startsWith(prefix) && !client.commands.has(command)) {
            let addends = message.content.slice(prefix.length).trim().split("-");
            let one = parseInt(addends[0], 10);
            let two = parseInt(addends[1], 10);
            let difference = one - two;
            message.reply({ content: addends[0] + " minus " + addends[1] + " equals " + difference + "." });
        } else if (message.content.includes("*") && message.content.startsWith(prefix) && !client.commands.has(command)) {
            let addends = message.content.slice(prefix.length).trim().split("*");
            let one = parseInt(addends[0], 10);
            let two = parseInt(addends[1], 10);
            let product = one * two;
            let multiply_message = await message.reply({ content: addends[0] + " times " + addends[1] + " equals " + product + "." });
            if (isNaN(sum)) {
                if (isNaN(one) && !isNaN(two)) {
                    let tempstr = "";
                    let stringo = addends[0]
                    let iterator = two;
                    for (let i = 0; i < iterator; i++) {
                        tempstr = tempstr + stringo
                        if (tempstr.length > 1990) {
                            message.reply(tempstr)
                            tempstr = ""
                            break;
                        }
                    }
                    message.channel.send("If you did not get a multiplied message, it is probably because the message that resulted exceeds the Discord limit of 2000 characters per message")
                    message.reply(tempstr);
                    multiply_message.delete();

                } else {
                    message.channel.send("NaN is Not a Number, meaning you probably added a non-number to a number (a string to a number)");
                }
            }
        } else if (message.content.includes("/") && message.content.startsWith(prefix) && !client.commands.has(command)) {
            let addends = message.content.slice(prefix.length).trim().split("/");
            let one = parseInt(addends[0], 10);
            let two = parseInt(addends[1], 10);
            if (two === 0) {
                message.channel.send("I. am. absolutely. done.");
                return;
            }
            let quotient = one / two;
            message.reply(addends[0] + " divided by " + addends[1] + " equals " + quotient + ".");
        } 
    }
    funcommands()

    /*if (command == "setprefix") {
        prefix = args[0]
        message.channel.send("Set prefix!")
    }*/
    //profile commands
    /*if (command == "setdesc" && message.channel.type === "dm") {
        let desc = args.join(" ")
        const affectedRows = await userinfo.update({ description: desc }, { where: { name: message.author.username } });
        return client.users.cache.get(message.author.id).send(`Description updated to ${desc}`);
    } else if (command == "getdesc") {
        let userdesc = await userinfo.findOne({ where: { name: message.author.username }});
        return client.users.cache.get(message.author.id).send(userdesc.get("description"));
    //} else if (command == "todolist") {
    //    let todolistorder = todolist.findAll({ attributes: ['order'] })
    //    let todoliststr = todolist.findAll({ attributes: })
    } else if (command == "profile") {
        let profilebal = await baloncesto.findOne({ where: { name: message.author.username }});
        let profiledesc = await userinfo.findOne({ where: { name: message.author.username }});
        let profileDisplay = new Discord.MessageEmbed()
        .addFields(
            { name: "Balance", value: `${profilebal} coins` },
            { name: "Description", value: profiledesc}
        )
        //...
        return client.users.cache.get(message.author.id).send({ embeds: [profileDisplay] })
    }*/ 


    if (!client.commands.has(command)) return;

    if (!cooldowns.has(command)) {
        cooldowns.set(command, new Collection());
    }
    
    let now = Date.now();
    let timestamps = cooldowns.get(client.commands.get(command).name);
    let cooldownAmount = (client.commands.get(command).cooldown || 3) * 1000;
    
    if (timestamps.has(message.author.id) && message.author.id != client.application.owner.id) { //TESTING FIX: Removes owner from the cooldown list
        let expirationTime = timestamps.get(message.author.id) + cooldownAmount;

        if (now < expirationTime) {
            let timeLeft = (expirationTime - now) / 1000;
            let expirationEmbed = new Discord.MessageEmbed()
                .setTitle(`Wait ${timeLeft.toFixed(1)} seconds`)
                .setDescription(`We have a small cooldown, just so the bot is all okay. Wait ${timeLeft.toFixed(1)} seconds, thanks :)`)
                .setImage(message.author.displayAvatarURL())
                .setTimestamp()
                .setFooter("This bot is 'very' big")
            return message.channel.send({ embeds: [expirationEmbed]} )
        }
    }
    if (message.author.id != client.application.owner.id) { //TESTING FIX: Removes owner from the cooldown list
        timestamps.set(message.author.id, now);
        setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
    }

    //if (command == "progress") {
    //    let args = message.content.slice(prefix.length).trim().split(", ");
    //    args.shift()
    //}

    try {
        //if (command == "chatbot") {
        //    return;
        //}
        let extraarguments = {"baloncesto": baloncesto, "client": client};
        client.commands.get(command).execute(message, args, extraarguments); //message, args, baloncesto, client
        //TESTING FIX: use dictionaries instead of passing variables for extra arguments (message and args are deemed "vital" for all files)
        //message, args, 
        //testing fix: remove client.commands (because no command uses it currently)
    } catch (error) {
        //message.reply("Error: " + error)
        message.reply("Error")
        console.log(error)
    }
});

client.on('messageDelete', messageDelete => {
    //console.log("HI")
    //if (messageDelete.mentions.members.first() && messageDelete.guild.id === 766063242194845746 && !((messageDelete.mentions.members.size == 1) && (messageDelete.mentions.users.map(t => t.username) == messageDelete.author.username))) {
    //console.log(typeof messageDelete.guild.id)
    if (messageDelete.mentions.members.first() && messageDelete.guild.id === "766063242194845746" && !((messageDelete.mentions.members.size == 1) && (messageDelete.mentions.users.map(t => t.username) == messageDelete.author.username))) {
        let mentionslist = `Person who pinged: ${messageDelete.author.username} ${messageDelete.author.discriminator}\nID: ${messageDelete.author.id}\n`
        if (messageDelete.mentions.everyone) {
            mentionslist += `\n**The message pinged everyone**\n\n`
        }
        mentionslist += `**The message pinged:**\n`
        mentionslist += messageDelete.mentions.users.map(t => t.username).join(", ")
        mentionslist += `\n\nThese were the messages (REMEMBER, if this message has any inappropriate language, we are not to blame. We are simply transmitting information to make sure that you can identify the person that ghost pinged):\nPrevious Message: ${messageDelete}`
        console.log(mentionslist) 
        return client.users.cache.get("713467569725767841").send(mentionslist);
    }
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) {
        return;
    }

    if (!interactioncooldowns.has(interaction.commandName)) {
        interactioncooldowns.set(interaction.commandName, new Collection());
    }
    
    let inow = Date.now();
    let itimestamps = interactioncooldowns.get(interaction.commandName); //client.commands.get(interaction.commandName).name
    let icooldownAmount = 5 * 1000
    
    if (itimestamps.has(interaction.user.id) && interaction.user.id != client.application.owner.id) {
        let iexpirationTime = itimestamps.get(interaction.user.id) + icooldownAmount;

        if (inow < iexpirationTime) {
            let itimeLeft = (iexpirationTime - inow) / 1000;
            let iexpirationEmbed = new Discord.MessageEmbed()
                .setTitle(`Wait ${itimeLeft.toFixed(1)} seconds`)
                .setDescription(`We have a small cooldown, just so the bot is all okay. Wait ${itimeLeft.toFixed(1)} seconds, thanks :)`)
                .setImage(interaction.user.displayAvatarURL())
                .setTimestamp()
                .setFooter("This bot is 'very' big")
            return interaction.reply({ embeds: [iexpirationEmbed], ephemeral: true });
        }
    }
    if (interaction.user.id != client.application.owner.id) { //TESTING FIX: Removes owner from the cooldown list
        itimestamps.set(interaction.user.id, inow);
        setTimeout(() => itimestamps.delete(interaction.user.id), icooldownAmount);
    }

    let icommand; //testing fix: slice dev off so that we don't have to add dev to if/else when using dev bot
    //testing fix also entails introducing icommand instead of using interaction.commandName
    if (interaction.commandName.endsWith('dev')) {
        icommand = interaction.commandName.slice(0, -3);
    } else {
        icommand = interaction.commandName
    }

    //if (!interaction.isCommand()) return;
    //funcommands migrations
    if (icommand === 'areac') { //add dev to end when devving
        try {
            await interaction.reply(`**Radius provided**: ${interaction.options.get('radius').value} \n**Formula for circle area**: πr² \n**Final Area**: ${(Math.PI * (Math.pow(parseFloat(interaction.options.get('radius').value), 2))).toFixed(2)} square units`)
        } catch (error) {
            if (!client.application.owner) await client.application.fetch();
            await interaction.reply(catcherrorreply);
            console.log(error)
        }
    } else if (icommand === 'circumference') { //add dev to end when devving
        try {
            await interaction.reply(`**Radius provided**: ${interaction.options.get('radius').value} \n**Formula for circumference (circle perimeter)**: 2πr \n**Final Circumference**: ${(2 * Math.PI * parseFloat(interaction.options.get('radius').value)).toFixed(2)} units`);
        } catch (error) {
            if (!client.application.owner) await client.application.fetch();
            await interaction.reply(catcherrorreply);
            console.log(error)
        } 
    } else if (icommand === 'areat') { //add dev to end when devving
        try {
            await interaction.reply(`**Base provided**: ${parseFloat(interaction.options.get('base').value)} \n**Height provided**: ${parseFloat(interaction.options.get('height').value)} \n**Formula for circle area**: ½bh  \n**Final Area**: ${(0.5 * (parseFloat(interaction.options.get('base').value) * parseFloat(interaction.options.get('height').value)))} square units`)
        } catch (error) {
            if (!client.application.owner) await client.application.fetch();
            await interaction.reply(catcherrorreply);
            console.log(error)
        }
    }
    //profile commands
    else if (icommand === 'setdesc') { //add dev to end when devving
        try { 
            let desc = interaction.options.get('profiledescription').value
            let affectedRows = await userinfo.update({ description: desc }, { where: { name: interaction.member.user.username } });
            await interaction.reply({ content: `Description updated to ${desc}`, ephemeral: true})
        } catch (error) {
            if (!client.application.owner) await client.application.fetch();
            await interaction.reply({ content: catcherrorreply, ephemeral: true });
            console.log(error)
        }
    } else if (icommand === 'getdesc') { //add dev to end when devving
        try {
            let userdesc = await userinfo.findOne({ where: { name: interaction.member.user.username }});
            await interaction.reply({ content: userdesc.get("description") });
        } catch (error) {
            if (!client.application.owner) await client.application.fetch();
            await interaction.reply({ content: catcherrorreply, ephemeral: true });
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
            if (!client.application.owner) await client.application.fetch();
            await interaction.reply({ content: catcherrorreply, ephemeral: true });
            console.log(error)
        }
    }

    try {
        let extraslashargs = {"baloncesto": baloncesto, "client": client}
        client.slashcommands.get(icommand).execute(interaction, extraslashargs);
    } catch (error) {
        //message.reply("Error: " + error)
        interaction.reply("Error")
        console.log(error)
    }
});

//add message edit when possible, so checks for mentions in message edits too
/*client.on('messageUpdate', (oldMessage, newMessage) => {
    if (oldMessage.mentions.members.first() && oldMessage.guild.id === "766063242194845746" && !((oldMessage.mentions.members.size == 1) && (oldMessage.mentions.users.map(t => t.username) == oldMessage.author.username))) {
        let mentionslist = `Person who pinged: ${oldMessage.author.username} ${oldMessage.author.discriminator}\nID: ${oldMessage.author.id}\n`
        if (oldMessage.mentions.everyone) {
            mentionslist += `\n**The message pinged everyone**\n\n`
        }
        mentionslist += `**The message pinged:**\n`
        mentionslist += oldMessage.mentions.users.map(t => t.username).join(", ")
        mentionslist += `\n\nThese were the messages (REMEMBER, if this message has any inappropriate language, we are not to blame. We are simply transmitting information to make sure that you can identify the person that ghost pinged)\nPrevious Message: ${oldMessage.content}\nNew Message: ${newMessage.content}`
        return client.users.cache.get(oldMessage.guild.ownerID).send(mentionslist);
    }
})*/