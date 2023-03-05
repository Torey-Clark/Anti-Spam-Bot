# Simple Spam Protection

A configurable bot that checks for repeated messages across a server's channels.

Whenever a message is sent in the server, the bot will check if the user has sent the same exact message in the other
channels recently.

## Self-Hosting

Create a Discord bot on the [developer portal](https://discord.com/developers). This bot requires the server members
intent and message content intent.
Create a URL to invite the bot with the bot and application.commands scope and the following permissions:

- Read Messages/View Channels
- Moderate Members
- Send Messages
- Manage Messages
- Use Slash Commands

### Instructions

Clone the repo to your preferred location.

Open a console at the repo location.

Copy `.env.example` to `.env` and fill out each line.

Edit `config.json` to your preferences. Check out [CONFIG.md](docs/CONFIG.md) for more information.

Execute `npm i` to install the dependencies.

Execute `npm run deploy` to deploy the slash commands.

Execute `npm run start` start the bot.

### Notes

You can use [PM2](https://pm2.keymetrics.io/) to keep the bot alive and manage it. They have extensive documentation
that you can use if you want to go beyond the simple command: `pm2 start index.js`.

If you host on Linux, you can use logrotate to manage the bot's logs and delete old ones. You can find plenty of
tutorials through a [quick search](https://gprivate.com/63xhz).

## License

This project is licensed under [The MIT License (MIT)](LICENSE)