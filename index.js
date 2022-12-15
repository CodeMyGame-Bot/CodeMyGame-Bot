const { Collection, Client, GatewayIntentBits, REST, Events, PresenceUpdateStatus, ActivityType, EmbedBuilder, Routes } = require('discord.js');
require('dotenv').config();
const { clientIds, dev } = require('./config.json');
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

console.log(`Running ${dev ? 'dev' : 'official'} bot`);

client.commands = new Collection();
const commands = [];
const commandPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(path.join(commandPath, file));

    if ('data' in command && 'execute' in command) {
        console.log(`${command.data.name} is being added to list of commands...`);
        client.commands.set(command.data.name, command);
        commands.push(command.data.toJSON());
    } else {
        console.warn(`Command at path ${path.join(commandPath, file)} is missing 'data' or 'execute' field. This command might not work correctly.`);
    }
}

let rest;

if (dev) {
    rest = new REST({ version: '10' }).setToken(process.env.dev_token);
} else {
    rest = new REST({ version: '10' }).setToken(process.env.official_token);
}

(async () => {
    try {
        if (dev) {
            console.log('Started updating application (/) commands for dev bot');
            await rest.put(
                Routes.applicationCommands(clientIds.dev),
                { body: commands }
            );
        } else {
            console.log('Started updating application (/) commands for official bot');
            await rest.put(
                Routes.applicationCommands(clientIds.official),
                { body: commands }
            );
        }

        console.log(`Successfully updated application (/) commands!`);
    } catch (error) {
        console.error(error);
    }
})();

const cooldowns = new Collection();

client.once(Events.ClientReady, async () => {
    client.user.setPresence({ status: PresenceUpdateStatus.Online, activities: [{ name: 'CodeMyGame code me', type: ActivityType.Watching }] })
    console.log("Bot is ready!");
});

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

if (dev) {
    client.login(process.env.dev_token);
} else {
    client.login(process.env.official_token);
}
