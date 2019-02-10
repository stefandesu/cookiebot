# CookieBot

My personal home network bot.

## Installation

To install and run the bot on your own device, you'll need Node.js.

```bash
# Clone repository
git clone https://github.com/stefandesu/cookiebot.git
cd cookiebot

# Install dependencies
npm install

# Create .env file
touch .env
# See below for more info on the .env file

# Run the dev server
npm run dev
```

`.env` example file:

```
TELEGRAM_TOKEN=123456789:abcdefghijkl...xyz
ADMIN_USERS=12345678,87654321
STARTUP_MESSAGE=1
```

To obtain a token, message [@BotFather](https://t.me/BotFather).

`ADMIN_USERS` can include group chats as well.

If `STARTUP_MESSAGE` is set, every admin is going to get a message when the bot is (re)started.

## Usage

Note: This will definitely change in the future!

You can create a commands.json file in the root folder of the project:

```json
[
  {
    "match": "some regexp",
    "command": "command to execute",
    "keyboard": true
  }
]
```

These are basically shortcuts for longer commands and will be shown as a keyboard if `keyboard` is `true`. The matched groups in the match will replace patterns `{x}` in the command where `x` is the index of the group (where `{0}` represents the whole match and `{1}` and onwards represent the matched groups). Example:

```json
[
  {
    "match": "ls (.*)",
    "command": "ls {1}",
    "keyboard": false
  }
]
```

Additional options:

- `deleteMessage` - If `true`, the user message will be deleted. This is only possible in groups where the bot has the correct permissions, otherwise an error message will be sent.

If more than one command matches the message, the first one in order will be taken.

All other commands that are not matched in this file are executed like that on the shell.

## Fixed commands

- `/list` - Returns a list of commands (`match` => `command`)
- `/pin [x] command` - Pins a message and repeats it every `x` seconds (default: 10 seconds)


## TODO

- [ ] Let bot pin a message in a group and update that message regularly (like `uptime`)
- [x] Add more than one admin
- [ ] Add users with user permissions
