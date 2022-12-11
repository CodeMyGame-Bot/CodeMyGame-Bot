const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pingo')
        .setDescription('Get information on the connection status of the bot!'),
    category: 'utility',
    cooldown: 10,
    async execute(interaction, client) {
        let ping = null;
        ping = Date.now() - interaction.createdTimestamp;
        interaction.reply({ content: `Ping is ${ping}ms. API latency is ${Math.round(client.ws.ping)}ms`, ephemeral: true}).then(
            interaction.fetchReply().then((reply) => {
                interaction.editReply({ content: `Ping is ${ping}ms. API latency is ${Math.round(client.ws.ping)}ms. Bot latency is ${reply.createdTimestamp - interaction.createdTimestamp} ms`, ephemeral: true });
            })
        );
    }
} 