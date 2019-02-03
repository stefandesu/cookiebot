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
