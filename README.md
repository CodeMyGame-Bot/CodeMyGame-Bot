# CodeMyGame Bot
Welcome to the official repository for CodeMyGame Bot, which runs on Discord.js v14.

# Running The Bot
Simply navigate to the directory where the index.js file is, and run the following command:
- `npm start <dev> <no_cooldowns> <no_instance_limits>`

Where...
- **dev** is a numerical boolean flag that decides whether the bot runs in development or production mode 
- **no_cooldowns** is a numerical boolean flag that toggles whether commands have cooldowns or not (automatically disabled when dev flag is set to true)
- **no_instance_limits** is a numerical boolean flag that toggles whether users are limited to only having one instance of every command running at a time (automatically disabled when dev flag is set to true)

# Changelog
- A changelog of all (semi-major or major) updates to this source code can be found [here](https://github.com/orgs/CodeMyGame-Bot/projects/1/)
- In addition, running the `/current_update` command should give a very detailed changelog for the last update or so

# Dependencies (refer to [package.json](package.json))
- discord.js (for simplifying bot development)
- dotenv (for accessing the .env file that contains bot secrets)

# Bot-Wide Policies
- Developers who maintain this bot repository must follow a few simple guidelines, outlined in [POLICIES.md](POLICIES.md)

# Excluded Files
- For a list of files not included in this repository (as they are not necessarily part of the source code) but that are extra files that assist in running the bot (for example, environment secrets), refer to the repository [.gitignore](.gitignore)

# Contributing
- If you would like to submit pull requests, commit code, or raise issues on this repository, please refer to the repository's [CONTRIBUTING.md](CONTRIBUTING.md)