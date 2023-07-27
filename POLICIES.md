# Repository Policies
As maintainers of the bot, there are a few things you should make sure to watch out for

- Whenever you commit a new version of the bot code, make sure to increment the version number in `package.json` accordingly; run `npm install` to update the version number in `package-lock.json`
- Whenever you finish fixing an issue, update the `/devlook` command to list the next 5 issues that will be focused on by maintainers of the bot, as well as a link to the corresponding GitHub issue.
- All quotes must be single quotes ('), **NOT** double quotes ("), unless the situation explicitly requires it (for example, you're using JavaScript Object Notation, or JSON)
- Wherever possible, make sure the bot sends non-ephemeral (permanent) responses
- Wherever possible, implement the use of the strict equality operator (`===`) as opposed to the normal equality operator (`==`)
- Maintain a list of all interaction IDs the bot sends out (ex. IDs of buttons the bot sends, modals the bot displays, etc.) on the `README.md`, to ensure that two interaction IDs do not conflict
- All command files should look as such
```js
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
// ...more imports here

module.exports = {
    category: '' // ...category of command (refer to `help.js`)
    type: '' // ...type of command ("instant" or "interactive")
    cooldown: 20, // ...cooldown for command
    data: new SlashCommandBuilder()
        // ...register slash command here
    async execute(interaction, client) {
        // ...code here
    }
}

```