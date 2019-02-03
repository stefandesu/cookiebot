const TelegramBot = require("tgfancy")
require("dotenv").config()

const
  telegramToken = process.env.TELEGRAM_TOKEN,
  adminUser = process.env.ADMIN_USER

const bot = new TelegramBot(telegramToken, {polling: true})
bot.onText(/.*/, mainHandler)

function mainHandler(message) {
  let chatId = message.chat.id
  if (adminUser == message.from.id) {
    bot.sendMessage(chatId, message.text)
  } else {
    bot.sendMessage(chatId, "No permission.")
  }
}
