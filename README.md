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
ADMIN_USER=12345678
```

To obtain a token, message [@BotFather](https://t.me/BotFather).

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

These are basically shortcuts for longer commands and will be shown as a keyboard if `keyboard` is `true`. The matched groups in the match will replace patterns `{x}` in the command where `x` is the zero-based index of the group. Example:

```json
[
  {
    "match": "ls (.*)",
    "command": "ls {0}",
    "keyboard": false
  }
]
```

If more than one command matches the message, the first one in order will be taken.

All other commands that are not matched in this file are executed like that on the shell.
