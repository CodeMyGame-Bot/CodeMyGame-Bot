const Discord = require('discord.js')

//do the thing where you place buttons "+" and "-", and they can set the noofbars and waittime, and then it does the progress bar :D

module.exports = {
    name: "progress",
    execute(interaction) {   
        async function progressBar(interaction, num, timer/*, text*/) {
            let progresso = ""
            let thethingtoadd = ""
            let thethingtonotadd = ""
            let loader = "-"
            let progressEmbed = new Discord.MessageEmbed()
                .setTitle("progressbar")
                .setDescription(progresso)
            let d = new Date()
            let h = d.getUTCHours();
            let m = d.getUTCMinutes();
            let s = d.getUTCSeconds();
            let ampm = "A.M.";
            if (h > 12) {
                h = h - 12;
                ampm = "P.M."; 
            }
            if (s < 10) {
                s = "0" + s.toString()
            } 
            if (h < 10) {
                h = "0" + h.toString()
            }
            if (m < 10) {
                m = "0" + m.toString()
            }
            await interaction.reply({ embeds: [progressEmbed] });
            console.log(num)
            for (let x = 0; x < num + 1; x++) {
                progresso = "["
                for (let i = 0; i < x; i++) {
                    progresso += "#"
                }
                while (progresso.length < num) {
                    progresso += "-"
                }
                progresso += "]"
                //msg1 = await msg1.edit(`${text} [${progresso}] ${(100/num) * x}%`);
                progressEmbed.setDescription(progresso);
                progressEmbed.setFooter(`${Number.parseFloat((100/num)*x).toFixed(1)}% ${loader}`);
                if (loader == "-") {
                    loader = "\\"
                } else if (loader == "\\") {
                    loader = "|"
                } else if (loader == "|") {
                    loader = "/"
                } else if (loader == "/") {
                    loader = "-"
                }
                await interaction.editReply({ embeds: [progressEmbed] })
                //if loader = "-" 
                await new Promise(r => setTimeout(r, timer));
            }
            d = new Date() //BETA TEST: created new Date in "d" instead of "d2"
            let h2 = d.getUTCHours();
            let m2 = d.getUTCMinutes();
            let s2 = d.getUTCSeconds();
            let ampm2 = "A.M.";
            if (h2 > 12) {
                h2 = h2 - 12;
                ampm2 = "P.M.";
            }
            if (s2 < 10) {
                s2 = "0" + s2.toString()
            } 
            if (h2 < 10) {
                h2 = "0" + h2.toString()
            }
            if (m2 < 10) {
                m2 = "0" + m2.toString()
            }
            
            //await msg1.edit(`${text} [${progresso}] Completed task at ${h}:${m}:${s} ${ampm} UTC`);
            progressEmbed.setFooter(`Started task at ${h}:${m}:${s} ${ampm} UTC\nCompleted task at ${h2}:${m2}:${s2} ${ampm2} UTC`) //BETA TEST: Change "ampm2" to "ampm" in case time switches from AM to PM whilst progress bar runs
            await interaction.editReply({ embeds: [progressEmbed] });
        }
        if (!interaction.options.get('noofbars') || !interaction.options.get('waittime')) {
            interaction.reply("Arguments do not meet requirements");
        } else if (interaction.options.get("waittime") > 2000 || interaction.options.get("noofbars") > 100) {
            interaction.reply("Trying to break the bot, eh?");
        } else {
            try { 
                progressBar(interaction, interaction.options.get('noofbars').value, interaction.options.get('waittime').value);   
            } catch (error) {
                interaction.reply({ content: "Something weird happened", ephemeral: true });
                console.log(error)
            }
        }
    }
}
