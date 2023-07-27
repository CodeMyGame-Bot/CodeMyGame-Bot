const load_start = Date.now();

Array.prototype.choice = function() {
    return this[Math.floor(Math.random() * this.length)];
};

Array.prototype.shuffle = function() {
    for (const item of this) {
        const item2 = this.choice();

        this[this.indexOf(item)] = item2;
        this[this.indexOf(item2)] = item;
    }
}

let args = process.argv.slice(2);

/**
 * if enabled, the bot will start in dev mode. otherwise,
 * it will start up the official bot
 */
let dev = parseInt(args[0], 10);

/**
 * if enabled, there are no cooldowns on any commands
 * 
 * cannot be enabled on the official bot
 */
let no_cooldowns;

/**
 * if enabled, users can have as many instances of a command
 * running at the same time
 * 
 * cannot be enabled on the official bot
 */
let no_instance_limits;

// if it's the official bot, auto-disables these features
if (!dev) {
    no_cooldowns = 0;
    no_instance_limits = 0;
// otherwise, gets its value from arguments
} else {
    no_cooldowns = parseInt(args[1], 10);
    no_instance_limits = parseInt(args[2], 10);
}

const { Collection, Client, GatewayIntentBits, REST, Events, PresenceUpdateStatus, ActivityType, EmbedBuilder, Routes, Embed } = require('discord.js');
require('dotenv').config();
const { clientIds, guildIds, botStatus, presenceInfo } = require('./config.json');
const { effect } = require('./colors');
const fs = require('node:fs');
const path = require('node:path');

console.logDate = function(...args) {
    console.log(`${new Date().toUTCString()} |`, ...args);
}

console.warnDate = function(...args) {
    console.warn(`${new Date().toUTCString()} |`, ...args);
}

console.errorDate = function(...args) {
    console.error(`${new Date().toUTCString()} |`, ...args);
}

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ],
});

console.log(`
    \rBot Version:
    \r------------
    \rindex.js | Running ${dev ? effect('dev', 'BRIGHT_YELLOW') : effect('official', 'BRIGHT_BLUE')} bot
    \rindex.js | Running bot version ${effect(process.env.npm_package_version, 'BRIGHT_BLUE')}
`);

client.commands = new Collection();
const commands = [];
const commandPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandPath).filter(file => file.endsWith('.js'));

console.log(`
    \rCommand Discovery:
    \r------------------
`);
for (const file of commandFiles) {
    const command = require(path.join(commandPath, file));

    if ('data' in command && 'execute' in command) {
        console.logDate(`index.js | ${effect(`${command.data.name} is being added to list of commands...`, 'BRIGHT_GREEN')}`);
        client.commands.set(command.data.name, command);
        commands.push(command.data.toJSON());
    } else {
        console.warnDate(`index.js | ${effect(`Command at path ${path.join(commandPath, file)} is missing required 'data' or 'execute' field. This command is not being registered and might not work correctly.`, 'BRIGHT_RED')}`);
    }
}

let rest;

if (dev) {
    rest = new REST({ version: '10' }).setToken(process.env.dev_token);
} else {
    rest = new REST({ version: '10' }).setToken(process.env.official_token);
}

console.log(`
    \rCommand Registering:
    \r--------------------
`);
(async () => {
    try {
        if (dev) {
            console.logDate(`index.js | ${effect(`Started registering application (/) commands for dev bot`, 'BRIGHT_YELLOW')}`);

            await rest.put(
                Routes.applicationCommands(clientIds.dev),
                { body: commands }
            );
        } else {
            console.logDate(`index.js | ${effect(`Started updating application (/) commands for official bot`, 'BRIGHT_BLUE')}`);
            
            await rest.put(
                Routes.applicationCommands(clientIds.official),
                { body: commands }
            );
        }

        console.logDate(`index.js | ${effect(`Successfully updated application (/) commands! Registered commands in ${effect(Date.now() - load_start, 'BRIGHT_CYAN')} ${effect('ms', 'BRIGHT_GREEN')}`, 'BRIGHT_GREEN')}`);
    } catch (error) {
        console.errorDate(`index.js | ${effect(`Error while registering application (/) commands:`, 'BRIGHT_RED')}\n${error}`);
    }
})();

const cooldowns = new Collection();
const instances = new Collection();

let presenceNumber = 0;

function shufflePresences() {
    let nextPresence = presenceInfo.presences[presenceNumber];
    
    let presenceName = nextPresence.name;
    if (presenceName === 'guilds') {
        presenceName = `${client.guilds.cache.size} guilds`;
    }

    client.user.setPresence({ 'status': PresenceUpdateStatus.Online, 'activities': [{ "name": presenceName, "type": ActivityType[nextPresence.type] }] });

    presenceNumber += 1;

    if (presenceNumber >= presenceInfo.presences.length) {
        presenceNumber = 0;
        presenceInfo.presences.shuffle();
    }
}

function setup() {
    client.guilds.fetch(guildIds.supportServer).then((server) => {
        // if running the offical bot, send in #bot-status
        if (!dev) {
            server.channels.fetch(botStatus.official).then((official_channel) => {
                official_channel.send(`Official bot is online! Version: ${process.env.npm_package_version}`)
            })
        // if runnin dev bot, send in general chat
        } else if (dev) {
            server.channels.fetch(botStatus.dev).then((dev_channel) => {
                dev_channel.send(`Dev bot is online! Version: ${process.env.npm_package_version}`)
            })
        }
    })
}

client.once(Events.ClientReady, async () => {
    presenceInfo.presences.shuffle();
    setInterval(shufflePresences, 60000);
    console.logDate(`index.js | ${effect(`Bot is ready! Loaded in ${effect(Date.now() - load_start, 'BRIGHT_CYAN')}`, 'BRIGHT_GREEN')} ${effect('ms', 'BRIGHT_GREEN')}`);
    
    console.logDate(`index.js | ${effect(`Running ${no_cooldowns ? 'without': 'with'} cooldowns`, (no_cooldowns ? 'BRIGHT_RED' : 'BRIGHT_GREEN'))}`);
    console.logDate(`index.js | ${effect(`Running ${no_instance_limits ? 'without': 'with'} instance limits`, (no_instance_limits ? 'BRIGHT_RED' : 'BRIGHT_GREEN'))}`);
    if (no_instance_limits) {
        console.logDate(`index.js | ${effect(`Running without instance limits!`, 'BRIGHT_RED')}`);
    }
    
    setup();
    // console.logDate(`Bot is in the following guilds: ${effect(client.guilds.cache.map((guild) => guild.name), 'BRIGHT_BLUE')}`);
});

client.on(Events.InteractionCreate, async interaction => {
    console.log(`received interaction: ${Date.now()}`);

    if (!interaction.isChatInputCommand()) {
        return;
    }

    if (!no_cooldowns) {
        if (!cooldowns.has(interaction.commandName)) {
            cooldowns.set(interaction.commandName, new Collection());
        }
        
        let now = Date.now();
        let timestamps = cooldowns.get(interaction.commandName);
        let cooldownAmount = (client.commands.get(interaction.commandName).cooldown || 10) * 1000;
    
        if (timestamps.has(interaction.user.id)) {
            let expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;
    
            if (now < expirationTime) {
                let timeLeft = (expirationTime - now) / 1000;
                let expirationEmbed = new EmbedBuilder()
                    .setTitle(`Wait ${timeLeft.toFixed(1)} seconds`)
                    .setDescription(`We have a small cooldown, just so the bot is all okay. Please wait ${timeLeft.toFixed(1)} seconds, thanks :)`)
                    .setImage(interaction.user.displayAvatarURL())
                    .setTimestamp()
                    .setFooter({ text: 'This bot is \'very\' big' });
                return interaction.reply({ embeds: [expirationEmbed], ephemeral: true });
            }
        } else {
            timestamps.set(interaction.user.id, now);
            setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount, cooldownAmount);
        }
    }

    if (!no_instance_limits) {
        if (!instances.has(interaction.commandName)) {
            instances.set(interaction.commandName, new Collection());
        }

        let cmd_instances = instances.get(interaction.commandName);

        if (cmd_instances.has(interaction.user.id)) {
            let instanceEmbed = new EmbedBuilder()
                .setTitle('Please Wait')
                .setDescription('You are already running an instance of this command. Please wait for that instance to complete befoer running a new one!')
                .setImage(interaction.user.displayAvatarURL())
                .setTimestamp()
                .setFooter({ text: 'This bot is \'very\' big ' });
            return interaction.reply({ embeds: [instanceEmbed], ephemeral: true });
        }
    }

    try {
        const commandExists = client.commands.get(interaction.commandName);
        if (!commandExists) {
            interaction.reply({ content: 'You invoked a command that is no longer supported. CodeMyGame must\'ve forgotten to refresh his slash commands :/.', ephemeral: true });
        } else {
            let cmd_instances;
            if (!no_instance_limits) {
                cmd_instances = instances.get(interaction.commandName);
                if (commandExists.type == 'instant') {
                    cmd_instances.set(interaction.user.id, true);
                }
            }
            
            console.log(`starting handling of command: ${Date.now()}`);
            client.commands.get(interaction.commandName).execute(interaction, client).then((result) => {
                if (!no_instance_limits) {
                    if (cmd_instances.has(interaction.user.id)) {
                        cmd_instances.delete(interaction.user.id);
                    }
                }
            });
        }
    } catch (error) {
        interaction.reply({ content: 'An error occured while trying to handle your interaction', ephemeral: true });
        console.error(error);
    }
});

async function cleanup() {
    const server = await client.guilds.fetch(guildIds.supportServer);

    // if running the offical bot, send in #bot-status
    if (!dev) {
        const official_channel = await server.channels.fetch(botStatus.official);
        await official_channel.send(`Official bot is going offline! Version: ${process.env.npm_package_version}`);
    // if runnin dev bot, send in general chat
    } else if (dev) {
        const dev_channel = await server.channels.fetch(botStatus.dev);
        await dev_channel.send(`Dev bot is going offline! Version: ${process.env.npm_package_version}`);
    }
}

process.on('SIGINT', async () => {
    console.warnDate(`index.js | ${effect('Shutting down; running cleanup tasks, please wait...', 'RED')}`)
    await cleanup()
    process.exit(2);
});

if (dev) {
    client.login(process.env.dev_token);
} else {
    client.login(process.env.official_token);
}

console.logDate(`index.js | ${effect(`Bot logged into Discord!`, 'BRIGHT_GREEN')}`);