const { version, unstable_test_release } = require('../config.json')
const Discord = require('discord.js')

module.exports = {
    name: "version",
    execute(interaction) { 
        console.log(version)
        let versionEmbed = new Discord.MessageEmbed()
            .addFields(
                { name: "Version", value: version },
                { name: "Unstable test Release", value: unstable_test_release }
            );
        interaction.reply({ embeds: [versionEmbed], ephemeral: true });
    }
} 