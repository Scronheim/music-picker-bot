const { countryFlagsMapper } = require('./const')

exports.formatResponseText = (album) => {
    return`
Название: ${album.title}
Стили: ${album.style}
Год: ${album.year}
Страна: ${countryFlagsMapper[album.country] || '❓'}
`
}

exports.sortAlbumsByYear = (albums) => {
    return albums.sort((a, b) => {
        if (a.year > b.year) return -1
        if (a.year < b.year) return 1
        return 0
    })
}
