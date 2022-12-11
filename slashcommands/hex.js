module.exports = {
    name: "hex",
    async execute(interaction) {
        try {
            const hextobinary = {"0":"0000","1":"0001","2":"0010","3":"0011","4":"0100","5":"0101","6":"0110","7":"0111","8":"1000","9":"1001","A":"1010","B":"1011","C":"1100","D":"1011","E":"1110","F":"1111"}
            if (interaction.options.get('hexadecimal').value.length != 2) {
                await interaction.reply("Please use the format {hex one}{hex two}, using the hexadecimals from 0-9 and A-F (i.e. F3). If there is no first character (i.e. it's just F instead of F6), please put a 0 before the letter (0F). If F is the first character, and there is no second character, style it as F0");
                return;
            } else if ((hextobinary[interaction.options.get('hexadecimal').value.charAt(0)] == undefined) || (hextobinary[interaction.options.get('hexadecimal').value.charAt(1)] == undefined)) {
                await interaction.reply("Please use the hexadecimals 0-9 and A-F");
                return;
            }
            let hexconversion = "";
            hexconversion += hextobinary[interaction.options.get('hexadecimal').value.charAt(0)];
            hexconversion += hextobinary[interaction.options.get('hexadecimal').value.charAt(1)];
            await interaction.reply({ content: hexconversion, ephemeral: true});
        } catch (error) {
            //if (!client.application.owner) await client.application.fetch();
            //await interaction.reply(catcherrorreply);
            interaction.reply("Error");
            console.log(error)
        }
    }
} 