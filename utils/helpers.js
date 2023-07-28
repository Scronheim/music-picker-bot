const { countryFlagsMapper } = require('./const')
const { Keyboard, Key } = require('telegram-keyboard')
const _ = require('lodash')

exports.formatResponseText = (album) => {
    return`
Название: <b>${album.title}</b>
Стили: <b>${album.style}</b>
Год: <b>${album.year}</b>
Страна: ${countryFlagsMapper[album.country] || '❓'}
`
}

exports.formatReleaseText = (release) => {
    const tracklist = release.tracklist.map((track) => {
        return `${track.position}. ${track.title} (${track.duration})\n`
    })
    return`
Название: <b>${release.title}</b>
Стили: <b>${release.style}</b>
Год: <b>${release.year}</b>
Треклист: 
${tracklist.join('')}
`
}

exports.formatVideoList = (release) => {
    const videos = release.videos.map((video, index) => {
        return `${index + 1}. ${video.title}. ${video.uri}\n`
    })
    return `
<b>Видео:</b>
${videos.join('')}
`
}

exports.sortAlbumsByYear = (albums) => {
    return albums.sort((a, b) => {
        if (a.year > b.year) return -1
        if (a.year < b.year) return 1
        return 0
    })
}
exports.replyWithListOfReleases = async (ctx, releases) => {
    const releasesKeyboard = makeChunkReleases(releases)
    const keyboard = Keyboard.make(releasesKeyboard).resize(false).inline()
    return ctx.replyWithHTML('Показаны альбомы с типом <b>master</b>, формата <b>album</b>\n', keyboard)
}
function makeChunkReleases(releases, chuckSize = 2) {
    const preparedReleases = releases.map((release) => {
        release.title = release.title.split(' - ')[1]
        return Key.callback(`${release.title} (${release.year})`, JSON.stringify({action: 'searchByReleaseId', releaseId: release.id}))
    })
    return _.chunk(preparedReleases, chuckSize)
}
