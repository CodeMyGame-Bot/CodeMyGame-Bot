const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder } = require('discord.js');

const majorChangelog = new EmbedBuilder()
    .setTitle('Major Updates Changelog')
    .setDescription('This is the changelog for all major/semi-major (stuff you actually see) updates in the current version of the bot!')
    .setColor(0x00ff00)
    .addFields(
        { name: '1. Adds instance limits', value: 'What\'s that? Well, this means that you can only have one instance, max, of every command, running at a time' },
        { name: '2. Setup/cleanup', value: 'Enable setup and cleanup tasks for the bot' },
        { name: '3. Adds /current-update command', value: 'Adds a sort of detailed changelog command for the current version of the bot!' }
    )

const minorChangelog = new EmbedBuilder()
    .setTitle('Minor Updates Changelog')
    .setDescription('This is the changelog for all minor (stuff you don\'t see) updates in the current version of the bot! also known as the copy debug info for nerds option in youtube hehe')
    .setColor(0x0000ff)
    .addFields(
        { name: '1. Modified attributes that command files export', value: 'Updated/shifted attributes defined in command files\' `module.exports` to follow a standardized format' },
        { name: '2. Toggle instance limits and cooldowns', value: 'Allows command cooldowns and instance limits (explained above) to be toggled off by me during runtime'},
        { name: '3. Updated practically every file in this codebase', value: 'It happens. On occasion...'},
        { name: '4. Update POLICIES.md', value: 'Added a specification for the format of command files' },
        { name: '5. Updated README.md', value: 'Explain how to run the bot' },
        { name: '6. Updated .gitignore!', value: 'Removed files/directories that no longer exist (BULLETIN_BOARD.md, templates, database.sqlite), or that actually need to be committed to the repository (package-lock.json)' }
    )
    .setFooter({ text: `Currently, the stable release of the bot is ${process.env.npm_package_version}` });

module.exports = {
    category: 'utility',
    type: 'instant',
    cooldown: 10,
    data: new SlashCommandBuilder()
        .setName('current-update')
        .setDescription('I\'m lazy, so I decide to put the current changelog here instead of in some proper place...'),
    async execute(interaction) {
        interaction.reply({ embeds: [majorChangelog, minorChangelog] })
    }
}