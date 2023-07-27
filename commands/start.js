exports.start = async (ctx) => {
    return ctx.reply('Выберите действие', {
        reply_markup: {
            resize_keyboard: true,
            inline_keyboard: [
                [
                    {
                        text: 'Поиск по стилям',
                        callback_data: JSON.stringify({action: 'searchByGenre'}),
                    },
                    {
                        text: 'Поиск по группе',
                        callback_data: JSON.stringify({action: 'searchByArtist'}),
                    },
                ],
            ],
        }
    })
}
