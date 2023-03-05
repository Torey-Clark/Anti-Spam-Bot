# Configuration

There are two main form of configuration for the bot, [environment](environment) and [general](general).

## Environment

Environment configuration is done in the `.env` file which you should have copied from the `.env.example` file. These
changes include values that shouuld not be shared with others as it could allow anyone with them to imitate your bot.

### Token

The token is obtained from the Discord Developer Portal when you create a new bot. If you forget, lose, or leak this
token, you should reset it through the portal. It will be a very long string of text composed of random characters.

### Client ID

The Client ID is obtained from the Discord Developer Portal when you create a new application for the bot. This can be
obtained by selecting the application for the bot and copying the ID on the page.

## General

General configuration is done in `config.json` and will allow you to determine how the bot should function.

### Moderator Roles

This is a list of roles that should be informed when the bot has found an instance of spam and has tried to give them
a timeout and delete the offending messages. If the timeout is successful or not, all users with any of the roles listed
will be send a direct message about the offense. The roles should be surrounded by apostrophes (") and separated by
commas.

Example: ["Mods", "Admin", "Cool People"]

### Excluded Channels

This is a list of channel IDs that are not checked when searching for spam. Some servers have channels dedicated to
memes or emojis that might routinely have one or more people entering the same message multiple times. The values must
be comma separated and can be obtained by right clicking on the channel you want to exclude and selecting "Copy ID"
(you must be in developer mode to do this).

### Maximum Timespan for Messages

This indicates the maximum delay in minutes in which to consider the same message as spam. For example, if this setting
is 10, the bot will only consider a message spam if another message with the exact content from the same user was made
within ten minutes of each other.

Min: 1, Max: 60, Default: 5

### Maximum Comment Limit

This indicates how many of the most recent comments are obtained to determine if there is spam. If this is 1, only the
most recent comment from each channel will be considered. If a spam message is sent in an active channel and this number
is too low, the bot will not detect it.

Min: 1, Max: 100, Default: 10

### Timeout Duration

This indicates how long a user will receive a timeout after the bot has determined that they are guilty of spamming the
same message multiple times.

Min: 1, Max: 1440 (1 day), Default: 30
