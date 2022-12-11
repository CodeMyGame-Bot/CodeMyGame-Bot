const { SlashCommandBuilder } = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('server')
        .setDescription('Gets information about the server!'),
    cooldown: 60,
    description: "IN DEVELOPMENT",
    execute(message, args) {
        message.channel.send(`This server's name is: ${message.guild.name}`)
        message.channel.send(`This server's owner is ${message.guild.owner.user.username}`)
    }
}