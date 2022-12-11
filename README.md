# CodeMyGame Bot
Welcome to the official repository for CodeMyGame Bot, which runs on discord.js v14

## DEV REQUIREMENTS
- make sure token, prefix ("dev="), and dev ("true") are set in the .env file

## PROD REQUIREMENTS
- push to github

## VERY IMPORTANT STUFF
- [x] fix (/rps)
- [ ] fix (/help)

## BULLETIN BOARD
- [x] put each category of commands in its own folder, so that command-help can just pull all files from a folder

- [x] cooldowns don't apply to slash commands
    - [ ] check that this works

- [x] clean arguments that are passed to commands
    - [ ] check that this works

- [x] make a slash command handler that still routes to files (at least the slash commands with a lot of code...)
    - [ ] check that this works

- [ ] make an error reporting system (sorry, there has been an error. please dm CodeMyGame with \<error tag\>) with error ids and stuff
    - will store stack trace, as well as corresponding error id, in a file (most likely a database)

- [ ] what about heroku for databases? (or postgresql)

- [ ] convert command-help into a dropdown menu

- [ ] check for ghost pings

- [ ] convert all commands into slash commands

- [ ] implement string multiplication (if arg1 passed to /multiply is a string, and arg2 is a number, repeat `arg1` by `arg2` times)

- [ ] (/progress) do the thing where you place buttons "+" and "-", and they can set the noofbars and waittime, and then it does the progress bar :D

- [ ] (/command-help) auto-populate command descriptions from slashcommands folder

- [ ] (/convert-ts)
    - timer 
    - stopwatch
    - \<t:\<num\>:R\> timestamp from provided ISO-conforming date (priority)

- [ ] convert double quotes to single quotes (where possible)
- [ ] add semicolons (where possible)
- [ ] check if a person is currently using a command before allowing them to run it again
- [ ] upcoming projects -> tictactoe and chopsticks, punch and defend games
- [ ] (/rps-bot) think about adding an embed with red/green font based on if user won
- [ ] (/rps-bot & /rps) consider making the action row builder creation with json data instead of iterating through the list of choices
- [ ] consider using `const wait = require('node:timers/promises').setTimeout`; instead of `await new Promise(r => setTimeout(r, ms));`
- [ ] figure out how to keep bot running / restart bot if token is invalidated (`client.on('invalidated')`) or an error occurs and the bot crashes (expected to handle this through try / catch, but there are some edge cases where the bot might crash)
- [ ] implement error catching wherever possible, to avoid the bot crashing
- [ ] (/arithmetic) maybe make the `SlashCommandBuilder` take a JSON array as arguments? i mean, no offense, but the builder is probably like 100 lines...
- [ ] consider converting all `==` to `===`
- [ ] think about acknowledging people who use buttons they shouldn't (ex. sending a ephemeral response "this button is not for you") instead of simply discarding it through `filter`
- [ ] consider making `cooldowns` and `interactioncooldowns` an object under `Client`
- [ ] think about using es6 `import` instead of `require()`
- [ ] make a (/mafia) command
- [ ] use StringSelectMenuBuilder instead of SelectMenuBuilder
- [ ] Implement feature so, if bot needs to be taken offline, unless it's an immediate emergency, warn all users interacting with the bot 5 mins before it shuts down (by disabling command handling and replacing it with a message saying that the bot will go offline soon)

## UNNECESSARY:
<!-- /*
* unnecessary dependencies for now
- "chalk": "^4.1.1",
        "ffmpeg-static": "^4.4.0",
        "libsodium-wrappers": "^0.7.9",
        "sequelize": "^6.6.5",
        "sqlite3": "^4.2.0"

*/ -->