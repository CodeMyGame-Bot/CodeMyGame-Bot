const { EmbedBuilder, ActionRowBuilder, ComponentType, SlashCommandBuilder, ButtonStyle, ButtonBuilder, StringSelectMenuBuilder, ActionRow } = require("discord.js");

// archived: "fun", "currency", "profile"
const CommandHelpInfo = {
    "utility": {
        "id": "utility",
        "label": "Utility",
        "description": "Various random utility commands that might be useful!",
        "embed": new EmbedBuilder()
            .setTitle(`Utility Help`)
            .setDescription("Various random utility commands that might be useful!")
    },
    "minigames": {
        "id": "minigames",
        "label": "Minigames",
        "description": "A collection of minigames you're sure to enjoy!",
        "embed": new EmbedBuilder()
            .setTitle(`Minigames Help`)
            .setDescription("A collection of minigames you're sure to enjoy!")
    },
    "home": {
        "id": "home",
        "label": "Home",
        "description": "The home page!",
        "embed": null
    }
}

CommandHelpInfo.home.embed = new EmbedBuilder()
    .addFields(
        { name: "Fun Commands! ⚽", value: "```These are commands, mostly minigames-in-testing, that are just something random for you to enjoy! Press the Fun button to open this embed```"},
        { name: "Currency System 💰", value: "```Even though it's small now, be sure to look out for more in the future! Press the Currency button to open this embed```" },
        { name: "Utility Commands! 🔧", value: "```Commands that are usually for info or configuration. Press the Utility button to open this embed```"},
        { name: "Minigames Commands 🎲", value: "```Minigames for you to enjoy! Press the Minigames button to open this embed```"},
        { name: "Profile Commands 📹 BETA", value: "```As the name suggests, you can set descriptions\n[ next features not added yet ]\nadd notes, a TODO LIST, and maybe even integrate the balance stats into one whole =profile command! Press the Profile button to open this embed```"},
        { name: "Slash Commands #️⃣ (BETA)", value: "```Type \"/\", and then scroll through the menu to find the list of commands under CodeMyGame Bot (I will list them here too just in case, also available when typing \"/\")```"},
        { name: "Home", value: "Return to this embed once you're in another embed with the Home button"}
    )
    .setDescription(CommandHelpInfo.home.description)
    .setFooter({ text: '**This embed will expire in 15 seconds**'});

// const HelpRows = [];

// let buttons_added = 0;

// for (const category in CommandHelpInfo) {
//     if (category != 'home') {
//         if (buttons_added == 0) {
//             HelpRows.push(new ActionRowBuilder())
//         }

//         HelpRows[HelpRows.length - 1].addComponents(
//             new ButtonBuilder()
//                 .setCustomId(CommandHelpInfo[category].id)
//                 .setLabel(CommandHelpInfo[category].label)
//                 .setStyle(ButtonStyle.Primary)
//         )

//         buttons_added += 1;

//         if (buttons_added >= 5) {
//             buttons_added = 0
//         }
//     }
// }

// HelpRows.push(
//     new ActionRowBuilder()
//         .addComponents(
//             new ButtonBuilder()
//                 .setCustomId(CommandHelpInfo.home.id)
//                 .setLabel(CommandHelpInfo.home.label)
//                 .setStyle(ButtonStyle.Danger)
//         )
// );

let help_embed_configured = false;

// CommandHelpInfo.fun.embed = new EmbedBuilder()
//     .addFields(
//         //{ name: "=args-info", value: "It will return all the arguments provided after the command. (However, the command will read the arguments and split them by spaces, meaning every new space will mean a new argument for the command)"},
//         //{ name: "=choice", value: "```It'll just ask you a question, and you can answer it!```"},
//         { name: "=funstuff", value: "Click on a number, and it will give you the response based on what you reacted to! <BETA; it only tells you the first reaction you did, and only tells you if you reacted with the given reactions>"},
//         { name: "=guessinggame", value: "A simple guessing game using discord.js! v2.0.0 UPDATE: HINTS!!!"},
//         { name: "=react-custom", value: "It only supports three emojis (apples, oranges, and grapes), but you can type it in and you will get the corresponding result"},
//         { name: "=testing", value: "I'll just dump some js here, hope it works!"}
//     );
// CommandHelpInfo.currency.embed = new EmbedBuilder()
//     .addFields(
//         { name: "/bal", value: "Balances!" },
//         { name: "/rich", value: "Get your money count here! GLOBAL leaderboard (trying to make it only server-wide)"},
//         { name: "=fish", value: "Fish some fish!" },
//     );
// CommandHelpInfo.utility.embed = new EmbedBuilder()
//     .addFields(
//         { name: "/timestampconvert", value: "Converting ISO dates to Unix timestamps"}, 
//         { name: "print sample error", value: "Prints a sample error (this is just for fun :])"},
//     );
// CommandHelpInfo.minigames.embed = new EmbedBuilder()
//     .addFields(
//         { name: "=fight", value: "Fight! Please don't spam btw" },
//     );
// CommandHelpInfo.profile.embed = new EmbedBuilder()
//     .addFields(
//         { name: "/setdesc", value: "Sets your profile's description [PRIVATE]" },
//         { name: "/getdesc", value: "Description for your profile [PRIVATE]" },
//     );

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Help with the bot\'s commands!'),
    cooldown: 20,
    category: 'utility',
    async execute(interaction, client) {
        if (!help_embed_configured) {
            for (const [command_name, command] of client.commands) {
                CommandHelpInfo[command.category].embed
                    .addFields({
                        'name': `/${command_name}`,
                        'value': command.data.description
                    })
                    .setFooter({ text: '**This embed will expire in 15 seconds**'});
            }
            help_embed_configured = true;
        }

        const helpSelect = new StringSelectMenuBuilder()
            .setCustomId('help')
            .setPlaceholder('Nothing selected')

        for (let category in CommandHelpInfo) {
            helpSelect.addOptions(
                {
                    label: CommandHelpInfo[category].label,
                    description: CommandHelpInfo[category].description,
                    value: CommandHelpInfo[category].id
                }
            )
        }

        const helpRow = new ActionRowBuilder()
            .addComponents(
                helpSelect
            )
        
        // await interaction.reply({ embeds: [CommandHelpInfo.home.embed], components: HelpRows, ephemeral: true });
        await interaction.reply({ embeds: [CommandHelpInfo.home.embed], components: [helpRow], ephemeral: true });

        const filter = i => i.user.id == interaction.user.id;
        const helpCollector = interaction.channel.createMessageComponentCollector({ 
            filter, time: 15000, idle: 10000, // componentType: ComponentType.Button
            componentType: ComponentType.StringSelect
        });

        helpCollector.on('collect', async i => {
            // helpRow.components[0].setPlaceholder(i.values[0]);
            await i.update({
                embeds: [CommandHelpInfo[i.values[0]].embed]
                // components: [helpRow]
            });
        });

        helpCollector.on('end', async collected => {
            // for (const row of HelpRows) {
            //     for (const component of row.components) {
            //         component.setDisabled(true);
            //     }
            // }

            helpRow.components[0].setDisabled(true);

            // await interaction.editReply({ components: HelpRows });
            await interaction.editReply({ components: [helpRow] });
        });
    }
}
