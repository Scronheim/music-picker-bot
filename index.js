const { Telegraf } = require('telegraf')

const { callbackQuery, searchByArtist} = require('./callbackQuery')

const { start } = require('./commands/start')
const { aboutMe } = require('./commands/aboutMe')

const { consoleColors } = require('./consoleColors')

const { startDiscogs } = require('./discogs/discogs')

const token = process.env.TELEGRAM_BOT_TOKEN // https://t.me/MusicPicker_bot

const startBot = async () => {
  const bot = new Telegraf(token)

  bot.catch((error, ctx) => {
    ctx.tg.sendMessage(423754317, error.toString()) // @scronheim chat id
    console.log(consoleColors.fgRed, error)
  })

  //======= MIDDLEWARES =======

  //======= /MIDDLEWARES =======

  bot.on('callback_query', callbackQuery)
  //======= COMMANDS =======
  bot.command('start', start)
  bot.command('about', aboutMe)
  bot.on('text', searchByArtist)
  //======= /COMMANDS =======

  // bot.on('text', start)

  console.log(consoleColors.fgGreen, 'Telegram bot started')
  await bot.launch()
}

startBot()
startDiscogs()
