const Discord = require('discord.js');

module.exports = {
    name: "devlook",
    execute(interaction) {
        const devlookembed = new Discord.MessageEmbed()
        .setTitle("Hey? Ever wonder what happens *behind the scenes*?")
        .setDescription("```Well, this is a look of what really happens, and what's coming in the future!```")
        .setFooter("Have fun, and keep on coding!")
        .setAuthor("CodeMyGame (the bot developer)")
        .addFields(
            {
            "name": "1.",
            "value": "New mini-games on the way!"
            },
            {
            "name": "2.",
            "value": "A set prefix command!"
            },
            {
            "name": "3.",
            "value": "Minecraft/Diep.io videos?"
            },
            {
            "name": "5.",
            "value": "And lastly, I'm open to community suggestions!"
            }
        );
        interaction.reply({ embeds: [devlookembed], ephemeral: true });
    }
}
