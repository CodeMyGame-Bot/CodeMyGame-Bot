const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

const devlookembed = new EmbedBuilder()
    .setTitle('Hey? Ever wonder what happens *behind the scenes*?')
    .setDescription('```Well, this is a look at what really happens, and what\'s coming in the future!```')
    .addFields({
        'name': '1.',
        'value': 'Empty for now!'
    })
    .setFooter({ text: 'Have fun, and keep on coding!' });

module.exports = {
    data: new SlashCommandBuilder()
        .setName('devlook')
        .setDescription('A look into the future of CodeMyGame!'),
    category: 'utility',
    cooldown: 10,
    async execute(interaction, client) {
        if (!devlookembed.data.author) {
            if (!client.application.owner) {
                await client.application.fetch();
            }
            devlookembed.setAuthor({
                'name': client.application.owner.username,
                'iconURL': client.application.owner.displayAvatarURL()
            });
        }
        await interaction.reply({ embeds: [devlookembed], ephemeral: true });
    }
}
