const { countryFlagsMapper } = require('./const')

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

exports.sortAlbumsByYear = (albums) => {
    return albums.sort((a, b) => {
        if (a.year > b.year) return -1
        if (a.year < b.year) return 1
        return 0
    })
}
