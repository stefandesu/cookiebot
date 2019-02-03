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
{
  "command text": "shell command"
}
```

These are basically shortcuts for longer commands and will be shown as a keyboard.

All other commands that are not supplied in this file are executed like that on the shell.
