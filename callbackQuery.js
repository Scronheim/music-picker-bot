const fs = require('fs')

const { getRandomAlbumByStyle, getDiscogsDb } = require('./discogs/discogs')
const { start } = require('./commands/start')
const { genresKeyboard, countryFlagsMapper } = require('./utils/const')
const { sortAlbumsByYear, formatResponseText } = require('./utils/helpers')

exports.callbackQuery = async (ctx) => {
    const data = JSON.parse(ctx.update.callback_query.data)
    if (data.genre) {
        const album = await getRandomAlbumByStyle(data.genre)
        const caption = formatResponseText(album)
        const keyboard = [
            [
                {
                    text: 'Следующий',
                    callback_data: JSON.stringify({genre: data.genre}),
                },
                {
                    text: 'Выбрать стиль',
                    callback_data: JSON.stringify({action: 'searchByGenre'}),
                },
            ]
        ]
        await ctx.replyWithPhoto({source: album.imagePath}, {caption, reply_markup: {
                resize_keyboard: true,
                inline_keyboard: keyboard,
            }})
        fs.unlinkSync(album.imagePath)
    } else if (data.action === 'searchByGenre') {
        await ctx.reply('Выберите стиль. После Вам будет предложен случайный альбом с этим стилем', {
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

exports.searchByArtist = async (ctx) => {
    const artist = ctx.update.message.text
    const db = getDiscogsDb()
    const response = await db.search({artist, type: 'master', format: 'album'})
    if (response.results.length) {
        let albums = sortAlbumsByYear(response.results)
        albums = albums.map(album => {
            return {
                title: album.title.replace('<', '').replace('>', ''),
                year: album.year,
                country: countryFlagsMapper[album.country],
                style: album.style.join(', '),
                uri: album.uri,
            }
        })
        replyWithListOfReleases(ctx, albums)
    } else {
        ctx.reply('По Вашему запросу ничего не найдно')
    }
}

function replyWithListOfReleases(ctx, releases) {
    return ctx.replyWithHTML(`
    Показаны альбомы с типом <b>master</b>, формата <b>album</b>\n
${releases.map((album, index) => {
        return `${index + 1}. <b><a href="https://discogs.com${album.uri}">${album.title} (${album.year})</a></b> (${album.style}/${album.country})\n`
    }).join('')}
`, {disable_web_page_preview: true})
}
