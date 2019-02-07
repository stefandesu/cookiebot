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
  commands = {}
}
console.log("Commands:")
for (let command of Object.keys(commands)) {
  console.log(`- ${command}`)
}
console.log()

let options = {
  parse_mode: "Markdown",
  reply_markup: {
    keyboard: []
  }
}
// Load all commands into the keyboard
_.forEach(commands, (command, key) => {
  if (!options.reply_markup.keyboard.length || options.reply_markup.keyboard[options.reply_markup.keyboard.length - 1].length > 2) {
    options.reply_markup.keyboard.push([])
  }
  options.reply_markup.keyboard[options.reply_markup.keyboard.length - 1].push(key)
})
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
    let matchedCommands = _.keys(commands).filter(key => data.match(new RegExp(key)))
    if (matchedCommands.length) {
      // Only take the first match
      let command = matchedCommands[0]
      let commandToExecute = commands[command]
      let matches = data.match(new RegExp(command))
      // Replace parameters
      let index = 1
      while (index < matches.length) {
        commandToExecute = commandToExecute.replace(`{${index - 1}}`, matches[index])
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
