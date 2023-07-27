const fs = require('fs')

const { getRandomAlbumByStyle, getDiscogsDb } = require('./discogs/discogs')
const { start } = require('./commands/start')

exports.searchByArtist = async (ctx) => {
    const artist = ctx.update.message.text
    const db = getDiscogsDb()
    const response = await db.search({artist, type: 'master', format: 'album'})
    if (response.results.length) {
        const albums = sortAlbumsByYear(response.results)
        albums.map(album => {
            console.log(album)
            return {
                title: album.title,
                year: album.year,
                country: album.country,
                style: album.style.join(', '),
                uri: album.uri,
            }
        })
        ctx.replyWithHTML(`
    Показаны альбомы с типом <b>master</b>, формата <b>album</b>\n
${albums.map(album => {
            return `<b><a href="https://discogs.com${album.uri}">${album.title}</a></b> (${album.style}/${album.year}/${album.country})\n`
        }).join('')}
`, {disable_web_page_preview: true})
    } else {
        ctx.reply('По Вашему запросу ничего не найдно')
    }
}


exports.callbackQuery = async (ctx) => {
    const data = JSON.parse(ctx.update.callback_query.data)
    if (data.genre) {
        const album = await getRandomAlbumByStyle(data.genre)
        const caption = formatResponseText(album)
        await ctx.replyWithPhoto({source: album.imagePath}, {caption, reply_markup: {
                resize_keyboard: true,
                inline_keyboard: [
                    [
                        {
                            text: 'Следующий',
                            callback_data: JSON.stringify({genre: data.genre}),
                        },
                        {
                            text: 'Выбрать стилям',
                            callback_data: JSON.stringify({genre: null}),
                        },
                    ]
                ]
            }})
        fs.unlinkSync(album.imagePath)
    } else if (data.action === 'searchByGenre') {
        await ctx.reply('Выберите стиль. После Вам будет предложен случайный альбом с таким стилем', {
            reply_markup: {
                resize_keyboard: true,
                inline_keyboard: genresKeyboard,
            }
        })
    } else if (data.action === 'searchByArtist') {
        await ctx.reply('Введите название группы')
    } else {
        await start(ctx)
    }
    await ctx.answerCbQuery()
}


function formatResponseText(album) {
    return`
Название: ${album.title}
Стили: ${album.style}
Год: ${album.year}
Страна: ${album.country}
`
}

function sortAlbumsByYear(albums) {
    return albums.sort((a, b) => {
        if (a.year > b.year) return -1
        if (a.year < b.year) return 1
        return 0
    })
}

const genresKeyboard = [
    [
        {
            text: 'Deathcore',
            callback_data: JSON.stringify({genre: 'deathcore'}),
        },
        {
            text: 'Metalcore',
            callback_data: JSON.stringify({genre: 'metalcore'}),
        },
        {
            text: 'EBM',
            callback_data: JSON.stringify({genre: 'ebm'}),
        },
        {
            text: 'Industrial',
            callback_data: JSON.stringify({genre: 'industrial'}),
        },
    ], [
        {
            text: 'Melodic Death',
            callback_data: JSON.stringify({genre: 'melodic-death-metal'}),
        },
        {
            text: 'Gothic Metal',
            callback_data: JSON.stringify({genre: 'gothic-metal'}),
        },
        {
            text: 'Doom Metal',
            callback_data: JSON.stringify({genre: 'doom-metal'}),
        },
        {
            text: 'Black Metal',
            callback_data: JSON.stringify({genre: 'black-metal'}),
        },
    ], [
        {
            text: 'Depressive Black',
            callback_data: JSON.stringify({genre: 'depressive-black-metal'}),
        },
    ]
]
