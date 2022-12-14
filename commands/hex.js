const { SlashCommandBuilder } = require("discord.js");

// const hextobinary = {"0":"0000","1":"0001","2":"0010","3":"0011","4":"0100","5":"0101","6":"0110","7":"0111","8":"1000","9":"1001","A":"1010","B":"1011","C":"1100","D":"1011","E":"1110","F":"1111"}
const hex_to_bin = hex => (parseInt(hex, 16).toString(2)).padStart((4 * hex.length), '0');
const hex_test = /^[0-9A-F]+?$/

module.exports = {
    data: new SlashCommandBuilder()
        .setName('hex')
        .setDescription('Find the binary equivalent of a hexadecimal number!')
        .addStringOption(option =>
            option
                .setName('number')
                .setDescription('The hexadecimal number to convert')
                .setMaxLength((Number.MAX_SAFE_INTEGER.toString(16)).length)
        ),
    category: 'utility',
    cooldown: 10,
    async execute(interaction) {
        if (!hex_test.test(interaction.options.getString('number'))) {
            return await interaction.reply('Not a valid hexadecimal number!');
        }

        await interaction.reply({ content: `${interaction.options.getString('number')} in binary is ${hex_to_bin(interaction.options.getString('number'))}` });
    }
} 