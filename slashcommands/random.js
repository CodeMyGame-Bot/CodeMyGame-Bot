module.exports = {
    name: "random",
    async execute(interaction) {
        try {
            let therandomstring = `
            Min limit: 0 (by default)\n
Max limit: ${interaction.options.get('max').value}\n
Random number: ${Math.floor(Math.random() * interaction.options.get('max').value, 10)}`;
            await interaction.reply({ content: therandomstring, ephemeral: true });
        } catch (error) {
            //if (!client.application.owner) await client.application.fetch();
            //await interaction.reply(catcherrorreply);
            interaction.reply("Error")
            console.log(error)
        }
    }
}