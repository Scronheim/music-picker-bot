const {sleep} = require('../utils')
const db = require('../schemas')
const telegramUsers = db.telegramUsers

exports.broadcast = async (ctx) => {
  const messageText = ctx.update.message.text.split('/broadcast ')[1]
  const users = await telegramUsers.find({chatId: {$ne: null}})
  users.forEach(async (user) => {
    ctx.telegram.sendMessage(user.chatId, messageText)
    await sleep(2000)
  })
}
