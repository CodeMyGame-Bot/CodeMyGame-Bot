const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { clientIds } = require('../config.json');

let args = process.argv.slice(2);

let dev = parseInt(args[0], 10);

let invite_link;

if (dev) {
    invite_link = `https://discord.com/api/oauth2/authorize?client_id=${clientIds.dev}&permissions=8&scope=bot%20applications.commands`;
} else {
    invite_link = `https://discord.com/api/oauth2/authorize?client_id=${clientIds.official}&permissions=8&scope=bot%20applications.commands`;
}

const invite_row = new ActionRowBuilder()
    .addComponents(
        new ButtonBuilder()
            .setLabel('Invite me!')
            .setStyle(ButtonStyle.Link)
            .setURL(invite_link)
    );

module.exports = {
    category: 'utility',
    type: 'instant',
    cooldown: 10,
    data: new SlashCommandBuilder()
        .setName('invite')
        .setDescription('Get a custom invite to add the bot to your servers!'),
    async execute(interaction) {
        await interaction.reply({ components: [invite_row] });
    }
}