const Discord = require('discord.js');

module.exports = {
    name: "rich",
    execute(interaction, args) {  
        let richcollection = new Discord.Collection()
        let leaderboardEmbed = new Discord.MessageEmbed()
        .setTitle("RICH")
        .setDescription("List of Richest People on the Bot")
        let leaderboardNum = 1;
        function getLeaderboard(value, key) {
            //leaderboardString += `${key}: ${value}/${Math.floor(value/100)}\n`
            if (value > 500) {
                leaderboardEmbed.addField(`${leaderboardNum}.`, `**${key}** ${value}`)
                leaderboardNum += 1;    
            } else {

            }
        }
        async function rich() {
            const tagList = await args["baloncesto"].findAll({ attributes: ['name', 'balance'] });
            const nameso = tagList.map(t => t.dataValues.name)
            const balanceso = tagList.map(t => t.dataValues.balance)
            //message.channel.send(nameso.join(", ") + "\n\n" + tagList.map(t => t.dataValues.balance).join(", "))  
            for (let i = 0; i < nameso.length; i++) {
                richcollection.set(nameso[i], balanceso[i])
            }
            richcollection.sort(function(a, b){return b-a})
            richcollection.forEach( getLeaderboard )
            interaction.reply({ embeds: [leaderboardEmbed], ephemeral: true })
        }
        rich()
    }
}
