const { EmbedBuilder, ActionRowBuilder, ComponentType, SlashCommandBuilder, StringSelectMenuBuilder, Collection } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');
const { effect } = require('../colors');

const wait_time = 60;
const idle_time = 15;

// archived: 'fun', 'currency', 'profile'
const CommandHelpInfo = {
    'utility': {
        'id': 'utility',
        'label': 'Utility',
        'description': 'Various random utility commands that might be useful!',
        'embed': new EmbedBuilder()
            .setTitle(`Utility Help`)
            .setDescription('Various random utility commands that might be useful!')
            .setFooter({ text: `**This embed will expire in ${wait_time} seconds**`})
    },
    'minigames': {
        'id': 'minigames',
        'label': 'Minigames',
        'description': 'A collection of minigames you\'re sure to enjoy!',
        'embed': new EmbedBuilder()
            .setTitle(`Minigames Help`)
            .setDescription('A collection of minigames you\'re sure to enjoy!')
            .setFooter({ text: `**This embed will expire in ${wait_time} seconds**`})
    },
    'home': {
        'id': 'home',
        'label': 'Home',
        'description': 'The home page!',
        'embed': null
    }
};

CommandHelpInfo.home.embed = new EmbedBuilder()
    .addFields(
        // { name: 'Fun Commands! ⚽', value: '```These are commands, mostly minigames-in-testing, that are just something random for you to enjoy! Press the Fun button to open this embed```'},
        // { name: 'Currency System 💰', value: '```Even though it\'s small now, be sure to look out for more in the future! Press the Currency button to open this embed```' },
        { name: 'Utility Commands! 🔧', value: '```Commands that are usually for info or configuration. Press the Utility button to open this embed```'},
        { name: 'Minigames Commands 🎲', value: '```Minigames for you to enjoy! Press the Minigames button to open this embed```'},
        // { name: 'Profile Commands 📹 BETA', value: '```As the name suggests, you can set descriptions\n[ next features not added yet ]\nadd notes, a TODO LIST, and maybe even integrate the balance stats into one whole =profile command! Press the Profile button to open this embed```'},
        // { name: 'Slash Commands #️⃣ (BETA)', value: '```Type \'/\', and then scroll through the menu to find the list of commands under CodeMyGame Bot (I will list them here too just in case, also available when typing \'/\')```'},
        { name: 'Home', value: 'Return to this embed once you\'re in another embed with the Home button'}
    )
    .setDescription(CommandHelpInfo.home.description)
    .setFooter({ text: `**This embed will expire in ${wait_time} seconds**`});

let commandPath = path.join(__dirname, '..', 'commands');
const commandFiles = fs.readdirSync(commandPath).filter(file => file.endsWith('js') && file !== 'help.js');

for (const file of commandFiles) {
    const command = require(path.join(commandPath, file));

    if ('data' in command && 'execute' in command) {
        console.logDate(`commands/help.js | ${effect(`${command.data.name} is being added to help categories...`, 'BRIGHT_GREEN')}`);
        
        CommandHelpInfo[command.category].embed
            .addFields({
                'name': command.data.name,
                'value': command.data.description
            });
    } else {
        console.warnDate(`commands/help.js | ${effect(`Command at path ${path.join(commandPath, file)} is missing 'data' or 'execute' field. This command will not be included in the (/help) command's listings.`, 'BRIGHT_RED')}`);
    }
}

module.exports = {
    category: 'utility',
    type: 'interactive',
    cooldown: 20,
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Help with the bot\'s commands!'),
    async execute(interaction, client) {
        const helpSelect = new StringSelectMenuBuilder()
            .setCustomId('help')
            .setPlaceholder('Nothing selected');

        for (let category in CommandHelpInfo) {
            helpSelect.addOptions(
                {
                    label: CommandHelpInfo[category].label,
                    description: CommandHelpInfo[category].description,
                    value: CommandHelpInfo[category].id
                }
            );
        }

        const helpRow = new ActionRowBuilder()
            .addComponents(
                helpSelect
            );
        
        await interaction.reply({ embeds: [CommandHelpInfo.home.embed], components: [helpRow] });

        const filter = i => i.user.id === interaction.user.id;
        const helpCollector = interaction.channel.createMessageComponentCollector({ 
            filter, time: wait_time * 1000, idle: idle_time * 1000,
            componentType: ComponentType.StringSelect
        });

        helpCollector.on('collect', async i => {
            await i.update({
                embeds: [CommandHelpInfo[i.values[0]].embed]
            });
        });

        helpCollector.on('end', async collected => {
            helpRow.components[0].setDisabled(true);

            await interaction.editReply({ components: [helpRow] });
        });
    }
}
