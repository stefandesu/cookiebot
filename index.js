const TelegramBot = require("tgfancy")
const shell = require("shelljs")
require("dotenv").config()
const _ = require("lodash")

const
  telegramToken = process.env.TELEGRAM_TOKEN,
  adminUsers = (process.env.ADMIN_USERS || "").split(","),
  maxMessageLength = 4096 - 10

let commands
try {
  commands = require("./commands.json")
} catch(error) {
  commands = []
}
console.log("Admin users:", adminUsers.join(", "))
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

// Repeating pinned commands
let pinned = {}

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
  if (adminUsers.includes(`${chatId}`)) {
    if (data == "/list") {
      let message = ""
      for (let command of commands) {
        message += `\`${command.match}\` => \`${command.command}\`\n`
      }
      bot.sendMessage(chatId, message, options)
      return
    }
    if (data.startsWith("/pin ")) {
      let messageId
      let args = data.split(" ")
      if (args.length >= 2) {
        let command, interval = 10
        if (args.length == 2) {
          command = args.slice(1).join(" ")
        } else {
          command = args.slice(2).join(" ")
          // Allow a minimum of 5 second interval
          interval = Math.max(parseFloat(args[1]) || interval, 5)
        }
        interval *= 1000
        let newOptions = _.omit(options, ["reply_markup"])
        bot.sendMessage(chatId, command, newOptions).then(message => {
          messageId = message.message_id
          if (pinned[chatId]) {
            // Clear previous interval
            clearInterval(pinned[chatId])
          }
          let execute = () => {
            shell.exec(command, { silent: true }, (code, stdout, stderr) => {
              let text = (stdout.trim() || stderr.trim() || "no output").match(new RegExp(`(.{1,${maxMessageLength}})`, "gs"))[0]
              bot.editMessageText("```\n" + text + "\n```", Object.assign({ chat_id: chatId, message_id: messageId }, newOptions)).then(() => {
                bot.pinChatMessage(chatId, messageId).catch(() => {})
              })
            })
          }
          execute()
          pinned[chatId] = setInterval(execute, interval)
        }).catch(() => {
          console.warn("Send message failed (was to be pinned)")
        })
      }
      return
    }
    if (data.startsWith("/unpin")) {
      bot.unpinChatMessage(chatId)
      clearInterval(pinned[chatId])
      return
    }
    let matchedCommand = commands.find(({ match }) => data.match(new RegExp(match)))
    let { match, command, deleteMessage } = matchedCommand || {}
    if (matchedCommand) {
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
    shell.exec(shellCommand, { silent: true }, (code, stdout, stderr) => {
      if (deleteMessage) {
        bot.deleteMessage(chatId, message.message_id).catch(() => {
          bot.sendMessage(chatId, "Message could not be deleted. Note that this is only possible in a group where the bot has the correct permissions.", options)
        })
      }
      let messages = (stdout.trim() || stderr.trim() || "no output").match(new RegExp(`(.{1,${maxMessageLength}})`, "gs"))
      for (let message of messages) {
        bot.sendMessage(chatId, "```\n" + message + "\n```", options)
      }
    })
  } else {
    bot.sendMessage(chatId, `No permission for ${chatId}. `)
  }
}
