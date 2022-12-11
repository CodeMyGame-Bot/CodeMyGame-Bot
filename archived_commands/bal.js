const Discord = require('discord.js');

module.exports = {
    name: "bal",
    async execute(interaction, args) {   
        var userbal = await args["baloncesto"].findOne({ where: { name: interaction.user.username }})
        var balEmbed = new Discord.MessageEmbed()
            .setThumbnail(interaction.user.displayAvatarURL())
            .setTitle(`${interaction.user.username}'s Balance`)
            .setDescription(`Balance: $${/*balances.get(message.author.username)*/userbal.get('balance')}`);
        interaction.reply({ embeds: [balEmbed], ephemeral: true });
        console.log(userbal.get('balance'))
    }
}