const load_start = Date.now();

let args = process.argv.slice(2);

let dev = parseInt(args[0], 10);

const { Collection, Client, GatewayIntentBits, REST, Events, PresenceUpdateStatus, ActivityType, EmbedBuilder, Routes } = require('discord.js');
require('dotenv').config();
const { clientIds } = require('./config.json');
const { effect } = require('./colors');
const fs = require('node:fs');
const path = require('node:path');

console.logDate = function(...args) {
    console.log(`${new Date().toUTCString()} |`, ...args)
}

console.warnDate = function(...args) {
    console.warn(`${new Date().toUTCString()} |`, ...args)
}

console.errorDate = function(...args) {
    console.error(`${new Date().toUTCString()} |`, ...args)
}

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ],
});

console.log('Bot Version:');
console.log('------------');
console.logDate(`Running ${dev ? effect('dev', 'BRIGHT_YELLOW') : effect('official', 'BRIGHT_BLUE')} bot`);
console.logDate(`Running bot version ${process.env.npm_package_version}`);

client.commands = new Collection();
const commands = [];
const commandPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandPath).filter(file => file.endsWith('.js'));

console.log();

console.log('Command Discovery');
console.log('-----------------');
for (const file of commandFiles) {
    const command = require(path.join(commandPath, file));

    if ('data' in command && 'execute' in command) {
        console.logDate(`${effect(`${command.data.name} is being added to list of commands...`, 'BRIGHT_GREEN')}`);
        client.commands.set(command.data.name, command);
        commands.push(command.data.toJSON());
    } else {
        console.warnDate(`${effect(`Command at path ${path.join(commandPath, file)} is missing 'data' or 'execute' field. This command might not work correctly.`, 'BRIGHT_RED')}`);
    }
}

console.log('\n');

let rest;

if (dev) {
    rest = new REST({ version: '10' }).setToken(process.env.dev_token);
} else {
    rest = new REST({ version: '10' }).setToken(process.env.official_token);
}

console.log('Command Registering');
console.log('-------------------');
(async () => {
    try {
        if (dev) {
            console.logDate(`${effect(`Started updating application (/) commands for dev bot`, 'BRIGHT_YELLOW')}`);
            await rest.put(
                Routes.applicationCommands(clientIds.dev),
                { body: commands }
            );
        } else {
            console.logDate(`${effect(`Started updating application (/) commands for official bot`, 'BRIGHT_BLUE')}`);
            await rest.put(
                Routes.applicationCommands(clientIds.official),
                { body: commands }
            );
        }

        console.logDate(`${effect(`Successfully updated application (/) commands! Registered commands in ${effect(Date.now() - load_start, 'BRIGHT_CYAN')} ${effect('ms', 'BRIGHT_GREEN')}`, 'BRIGHT_GREEN')}`);
    } catch (error) {
        console.errorDate(`${effect(`${error}`, 'BRIGHT_RED')}\n`);
    }
})();

const cooldowns = new Collection();

client.once(Events.ClientReady, async () => {
    client.user.setPresence({ status: PresenceUpdateStatus.Online, activities: [{ name: 'CodeMyGame code me', type: ActivityType.Watching }] })
    console.logDate(`${effect(`Bot is ready! Loaded in ${effect(Date.now() - load_start, 'BRIGHT_CYAN')}`, 'BRIGHT_GREEN')} ${effect('ms', 'BRIGHT_GREEN')}`);
    // console.logDate(`Bot is in the following guilds: ${effect(client.guilds.cache.map((guild) => guild.name), 'BRIGHT_BLUE')}`);
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
