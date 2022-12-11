module.exports = {
    name: "server",
    cooldown: 60,
    description: "IN DEVELOPMENT",
    execute(message, args) {
        message.channel.send(`This server's name is: ${message.guild.name}`)
        message.channel.send(`This server's owner is ${message.guild.owner.user.username}`)
    }
}