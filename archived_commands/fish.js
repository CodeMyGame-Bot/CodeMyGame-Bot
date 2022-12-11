module.exports = {
    name: "fish",
    cooldown: 60,
    description: "Fish some fish!",
    execute(message, args, extraarguments) {   
        async function fish() {
            const exotic = ["not", "not", "not", "not", "yes"]
            let infoindexo = Math.ceil(Math.random()*2)
            let randomindexo = exotic[infoindexo];
            let fishsellvalue;
            if (randomindexo == "yes") {
                fishsellvalue = 1000;
            } else {
                fishsellvalue = 50;
            }
            
            let numberoffish = Math.floor(Math.random() * 5);
            let sum = fishsellvalue * numberoffish;
            let currentbalance = await extraarguments["baloncesto"].findOne({ where: { name: message.author.username }})//balances.get(message.author.username);
            let newbalance = currentbalance.get('balance') + sum;
            console.log(currentbalance)
            console.log(newbalance)
            //balances.set(message.author.username, newbalance);
            const affectedRows = extraarguments["baloncesto"].update({ balance: newbalance }, { where: { name: message.author.username } });
            if (numberoffish == 0) {
                message.channel.send(`${message.author.username}, Sold ${numberoffish} fish`);
            } else {
                if (exotic[infoindexo] == "yes") {
                    message.channel.send(`**YOU GOT EXOTIC FISH!!!** ${message.author.username}, Sold ${numberoffish} fish, got ${sum} coins.`);
                } else {
                    message.channel.send(`${message.author.username}, Sold ${numberoffish} fish, got ${sum} coins.`);
                }
            }
        }   
        fish()
    }
}