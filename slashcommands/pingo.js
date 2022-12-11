module.exports = {
    name: "pingo",
    async execute(interaction, args) {
        try { //latency is negative, fix soon
            await interaction.reply({ content: `Latency is ${Date.now() - interaction.createdTimestamp}ms. API Latency is ${Math.round(args["client"].ws.ping)}ms`, ephemeral: true});
        } catch (error) {
            //if (!client.application.owner) await client.application.fetch();
            //await interaction.reply(catcherrorreply);
            interaction.reply("Error");
            console.log(error)
        }
    }
} 