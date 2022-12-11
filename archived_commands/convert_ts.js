const { SlashCommandBuilder } = require("discord.js");
const moment = require("moment");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('convert-ts')
        .setDescription('Converts '),
    async execute(interaction) {
        try {
            let timetoconvert = interaction.options.get('date').value;
            //console.log(timetoconvert);
            let unixtimestampconvert = moment(timetoconvert, "M/D/YYYY H:mm:ss").valueOf();
            unixtimestampconvert = (parseInt(unixtimestampconvert, 10) / 1000);
            //console.log(unixtimestampconvert);
            let convertedmessage = "<t:" + unixtimestampconvert + ":R>\n`<t:" + unixtimestampconvert + ":R>`";
            interaction.reply({ content: convertedmessage, ephemeral: true });
        } catch (error) {
            interaction.reply({ content: "FAIL", ephemeral: true })
            console.log(error)
        }
    }
}