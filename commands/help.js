const { EmbedBuilder, ActionRowBuilder, ComponentType, SlashCommandBuilder, ButtonStyle, SelectMenuBuilder } = require("discord.js");
const CommandHelpInfo = {
    /*"fun": {
        "id": "fun",
        "label": "Fun",
        "embed": null
    },
    "currency": {
        "id": "currency",
        "label": "Currency",
        "embed": null
    },*/
    "utility": {
        "id": "utility",
        "label": "Utility",
        "embed": new EmbedBuilder()
            .setTitle(`Utility Help`)
    },
    "minigames": {
        "id": "minigames",
        "label": "Minigames",
        "embed": new EmbedBuilder()
            .setTitle(`Minigames Help`)
    },/*
    "profile": {
        "id": "profile",
        "label": "Profile",
        "embed": null
    },*/
    "home": {
        "id": "home",
        "label": "Home",
        "embed": null
    }
}

CommandHelpInfo.home.embed = new EmbedBuilder()
    .addFields(
        { name: "IMPORTANT", value: "This embed will expire after 20 seconds"},
        { name: "Fun Commands! ⚽", value: "```These are commands, mostly minigames-in-testing, that are just something random for you to enjoy! Press the Fun button to open this embed```"},
        { name: "Currency System 💰", value: "```Even though it's small now, be sure to look out for more in the future! Press the Currency button to open this embed```" },
        { name: "Utility Commands! 🔧", value: "```Commands that are usually for info or configuration. Press the Utility button to open this embed```"},
        { name: "Minigames Commands 🎲", value: "```Minigames for you to enjoy! Press the Minigames button to open this embed```"},
        { name: "Profile Commands 📹 BETA", value: "```As the name suggests, you can set descriptions\n[ next features not added yet ]\nadd notes, a TODO LIST, and maybe even integrate the balance stats into one whole =profile command! Press the Profile button to open this embed```"},
        { name: "Slash Commands #️⃣ (BETA)", value: "```Type \"/\", and then scroll through the menu to find the list of commands under CodeMyGame Bot (I will list them here too just in case, also available when typing \"/\")```"},
        { name: "Home", value: "Return to this embed once you're in another embed with the Home button"}
    );

let help_embed_configured = false;

const helpCategories = [];

// for (const category of CommandHelpInfo) {
//     helpCategories.push({
//         'label': category,
//         'description': ,
//     })   
// }

// const helpSelectMenu = new SelectMenuBuilder()
//     .setCustomId('help');

// const helpRow = new ActionRowBuilder()
//     .addComponents(
//         helpSelectMenu
//     );

// CommandHelpInfo.fun.embed = new EmbedBuilder()
//     .addFields(
//         { name: "/eightball", value: "Enter a question that the 8ball can answer!" },
//         //{ name: "=args-info", value: "It will return all the arguments provided after the command. (However, the command will read the arguments and split them by spaces, meaning every new space will mean a new argument for the command)"},
//         //{ name: "=choice", value: "```It'll just ask you a question, and you can answer it!```"},
//         { name: "=funnycommand", value: "```It's literally just for yt if you actually use this though```"},
//         { name: "=funstuff", value: "Click on a number, and it will give you the response based on what you reacted to! <BETA; it only tells you the first reaction you did, and only tells you if you reacted with the given reactions>"},
//         { name: "=guessinggame", value: "A simple guessing game using discord.js! v2.0.0 UPDATE: HINTS!!!"},
//         //{ name: "=ping", value: "It's like args-info, except the arguments will be dmmed to you"},
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
//         { name: "/devlook", value: "A look into the future features of the bot!" },
//         { name: "/timestampconvert", value: "Converting ISO dates to Unix timestamps"}, 
//         { name: "/version", value: "It'll just tell you the version of the bot!" },
//         { name: "/progress", value: "Creates a progress bar, syntax =progress <number of bars> <waittime between each bar in milliseconds> <text; optional>. REMEMBER: If you provide a waittime below 1000, the bot may lag due to limits on message edits set by Discord. You can set the waittime below 1000, but it may not work, just saying!"},
//         { name: "/pingo", value: "Replies with bot ping status" },
//         { name: "/random", value: "Returns a random number using the given max limit" },
//         { name: "/areac", value: "Computes the area of a circle given the radius" },
//         { name: "/circumference", value: "Computes the circumference (perimeter) of a circle given the radius" },
//         { name: "/areat", value: "Computes the area of a triangle given base and height" },
//         { name: "/hex", value: "Converts two hexadecimals to a binary byte" },
//         { name: "print sample error", value: "Prints a sample error (this is just for fun :])"},
//     );
// CommandHelpInfo.minigames.embed = new EmbedBuilder()
//     .addFields(
//         { name: "=fight", value: "Fight! Please don't spam btw" },
//         { name: "=rps", value: "ROCK, PAPER, SCISSORS!" },
//         { name: "=rpsbot", value: "ROCK, PAPER, SCISSORS! but with the bot lol" }
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
    async execute(interaction) {
        if (!help_embed_configured) {
            await interaction.deferReply();
            for (const [command_name, command] of client.commands) {
                CommandHelpInfo[command.category].embed.addFields({
                    'name': `/${command_name}`,
                    'value': command.data.description
                });
            }
        }

        const HelpRows = [];

        for (const category in CommandHelpInfo) {
            let buttons_added = 0;

            if (buttons_added == 0) {
                HelpRows.push(new ActionRowBuilder())
            }

            HelpRows[HelpRows.length - 1].addComponents(
                new ButtonBuilder()
                    .setCustomId(category.id)
                    .setLabel(category.label)
                    .setStyle(ButtonStyle.Primary)
            )

            buttons_added += 1;

            if (buttons_added >= 5) {
                buttons_added = 0
            }
        }
        
        HelpRows.push(
            new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId(CommandHelpInfo.home.id)
                        .setLabel(CommandHelpInfo.home.label)
                        .setStyle(ButtonStyle.Danger)
                )
        );

        if (!help_embed_configured) {
            help_embed_configured = true;
            await interaction.editReply({ embeds: [CommandHelpInfo.home.embed], components: HelpRows });
        } else {
            await interaction.reply({ embeds: [CommandHelpInfo.home.embed], components: HelpRows });
        }

        const filter = i => i.user.id == interaction.user.id;
        const helpCollector = interaction.channel.createMessageComponentCollector({ 
            filter, time: 15000, idle: 5000, componentType: ComponentType.Button 
        });

        helpCollector.on('collect', async i => {
            await i.update({
                embeds: [CommandHelpInfo[i.customId].embed]
            });
        });

        helpCollector.on('end', async collected => {
            for (const row of HelpRows) {
                for (const component of row) {
                    component.setDisabled(true);
                }
            }

            await interaction.editReply({ components: HelpRows });
        });
    }
}
