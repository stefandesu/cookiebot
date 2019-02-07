const TelegramBot = require("tgfancy")
const shell = require("shelljs")
const _ = require("lodash")
require("dotenv").config()

const
  telegramToken = process.env.TELEGRAM_TOKEN,
  adminUser = process.env.ADMIN_USER

let commands
try {
  commands = require("./commands.json")
} catch(error) {
  commands = []
}
console.log("Commands:")
for (let command of commands) {
  console.log(`- ${command.match}`)
}
console.log()

let options = {
  parse_mode: "Markdown",
  reply_markup: {
    keyboard: []
  }
}
// Load all commands into the keyboard
for (let { match, keyboard } of commands) {
  if (keyboard) {
    if (!options.reply_markup.keyboard.length || options.reply_markup.keyboard[options.reply_markup.keyboard.length - 1].length > 2) {
      options.reply_markup.keyboard.push([])
    }
    options.reply_markup.keyboard[options.reply_markup.keyboard.length - 1].push(match)
  }
}
console.log(options)

const bot = new TelegramBot(telegramToken, {polling: true})
bot.onText(/.*/, textHandler)
bot.on("callback_query", mainHandler)

function textHandler(message) {
  mainHandler({
    data: message.text,
    message
  })
}

function mainHandler({ data, message }) {
  let chatId = message.chat.id
  let shellCommand = null
  if (adminUser == chatId) {
    let matchedCommand = commands.find(({ match }) => data.match(new RegExp(match)))
    if (matchedCommand) {
      // Only take the first match
      let { match, command } = matchedCommand
      let commandToExecute = command
      let matches = data.match(new RegExp(match))
      // Replace parameters
      let index = 0
      while (index < matches.length) {
        commandToExecute = commandToExecute.replace(`{${index}}`, matches[index])
        index += 1
      }
      shellCommand = commandToExecute
    } else {
      shellCommand = data
    }
    shell.exec(shellCommand, (code, stdout, stderr) => {
      bot.sendMessage(chatId, "```\n" + (stdout || stderr) + "\n```", options)
    })
  } else {
    bot.sendMessage(chatId, "No permission.")
  }
}
