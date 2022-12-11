module.exports = {
    name: "help",
    cooldown: 60,
    description: "Basic help with the commands (links to !command-help)",
    execute(message, args) {
        async function help() {
            const msg = await message.channel.send("I see, you need help.");
            await new Promise(r => setTimeout(r, 2000));
            msg.edit(" Use =command-help to get a detailed embed on what each command does.");
            await new Promise(r => setTimeout(r, 2000));
            //message.channel.send(" For help with =embed, do =embed-help. For help with =change, do =changehelp");
            //await new Promise(r => setTimeout(r, 2000));
            message.channel.send(" Also, do = followed by an arithmetic operation to get the value!");
        }
        help()
    }
}
