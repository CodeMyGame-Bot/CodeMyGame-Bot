const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    category: 'utility',
    type: 'instant',
    cooldown: 10,
    data: new SlashCommandBuilder()
        .setName('pingo')
        .setDescription('Get information on the connection status of the bot!'),
    async execute(interaction, client) {
        let ping = Date.now() - interaction.createdTimestamp;
        interaction.reply({ content: `Ping is ${ping}ms. API latency is ${Math.round(client.ws.ping)}ms` }).then(
            interaction.fetchReply().then((reply) => {
                interaction.editReply({ content: `Ping is ${ping}ms. API latency is ${Math.round(client.ws.ping)}ms. Bot latency is ${reply.createdTimestamp - interaction.createdTimestamp} ms` });
            })
        );
    }
} 