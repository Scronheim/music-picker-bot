const fs = require('fs')

const { getRandomAlbumByStyle, getReleaseById, searchReleasesByArtist, getReleasesByArtistId, getArtistInfo} = require('./discogs/discogs')
const { start } = require('./commands/start')
const { genresKeyboard, countryFlagsMapper } = require('./utils/const')
const { sortAlbumsByYear, formatResponseText, formatReleaseText, replyWithListOfReleases, formatVideoList} = require('./utils/helpers')

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
        await ctx.replyWithPhoto({source: album.imagePath}, {caption, parse_mode: 'HTML', reply_markup: {
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
    } else if (data.action === 'searchByArtistName') {
        await this.searchReleasesByArtist(ctx, data.artistName)
    } else if (data.action === 'searchByReleaseId') {
        await searchReleaseById(ctx, data.releaseId)
    } else if (data.action === 'replyWithVideo') {
        await searchVideoByReleaseId(ctx, data.releaseId)
    } else {
        await start(ctx)
    }
    await ctx.answerCbQuery()
}

exports.searchReleasesByArtist = async (ctx, artistName) => {
    const artist = ctx?.update?.message?.text || artistName
    const response = await searchReleasesByArtist(artist)
    if (response.results.length) {
        let albums = sortAlbumsByYear(response.results)
        albums = albums.map(album => {
            return {
                id: album.id,
                title: album.title,
                year: album.year,
                country: countryFlagsMapper[album.country],
                style: album.style.join(', '),
                uri: album.uri,
            }
        })
        await replyWithListOfReleases(ctx, albums)
    } else {
        ctx.reply('По Вашему запросу ничего не найдно')
    }
}

async function searchVideoByReleaseId(ctx, releaseId) {
    const release = await getReleaseById(releaseId)
    const keyboard = [
        [
            {
                text: '⬅️ Все альбомы',
                callback_data: JSON.stringify({action: 'searchByArtistName', artistName: release.artistName}),
            },
        ]
    ]
    const videos = formatVideoList(release)
    await ctx.reply(videos, {parse_mode: 'HTML', reply_markup: {
            resize_keyboard: true,
            inline_keyboard: keyboard,
        }})
}

async function searchReleaseById(ctx, releaseId) {
    const release = await getReleaseById(releaseId)
    const caption = formatReleaseText(release)
    const keyboard = [
        [
            {
                text: '⬅️ Все альбомы',
                callback_data: JSON.stringify({action: 'searchByArtistName', artistName: release.artistName}),
            },
        ]
    ]
    if (release.videos) {
        keyboard[0].push({
            text: '🎬 Видео',
            callback_data: JSON.stringify({action: 'replyWithVideo', releaseId}),
        })
    }
    await ctx.replyWithPhoto({source: release.imagePath}, {caption, parse_mode: 'HTML', reply_markup: {
            resize_keyboard: true,
            inline_keyboard: keyboard,
        }})
    fs.unlinkSync(release.imagePath)
}
