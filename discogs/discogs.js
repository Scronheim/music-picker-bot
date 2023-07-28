const fs = require('fs')
const axios = require('axios')
const Discogs = require('disconnect').Client

let db = null
let style = ''

exports.getDiscogsDb = () => {
    return db
}

exports.startDiscogs = () => {
    const dis = new Discogs({userToken: process.env.DISCOGS_TOKEN});
    db = dis.database()
}

exports.getArtistInfo = async (artist) => {
    return await db.getArtist(artist)
}

exports.searchReleasesByArtist = async (artist) => {
    return await db.search({artist, type: 'master', format: 'album'})
}

exports.getReleasesByArtistId = async (artistId) => {
    return await db.getArtistReleases(artistId)
}

exports.getReleaseById = async (releaseId) => {
    const release = await db.getMaster(releaseId)
    const imagePath = await downloadImage(release.images[0].uri)
    return {
        title: sanitizeTitle(release.title),
        style: release.styles.join(', '),
        year: release.year,
        tracklist: release.tracklist,
        imagePath,
        artistName: release.artists[0].name,
        videos: release.videos?.map((video) => {
            return {
                title: video.title,
                uri: video.uri,
            }
        }),
    }
}

exports.getRandomAlbumByStyle = async (searchStyle) => {
    style = searchStyle
    const firstResponse = await startFirstRequest()
    const releaseCount = parseInt(firstResponse.pagination.pages)
    const randomPage = getRandomInt(1, releaseCount)
    const secondResponse = await startSecondRequest(randomPage)
    const album = secondResponse.results[0]
    const imagePath = await downloadImage(album.cover_image)

    return {
        title: sanitizeTitle(album.title),
        style: album.style.join(', '),
        year: album.year,
        country: album.country,
        imagePath: imagePath,
        cover: album.cover_image,
    }
}


function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function startFirstRequest() {
    return db.search({
        type: 'release',
        style: style,
        per_page: 1,
    })
}

async function startSecondRequest(randomPage) {
    return db.search({
        type: 'release',
        style: style,
        page: randomPage,
        per_page: 1,
    });
}

const downloadImage = async (url) => {
    return axios({
        url,
        responseType: 'stream',
    }).then(
        response =>
            new Promise((resolve, reject) => {
                const imagePath = `/tmp/${getRandomInt(1, 1000)}.jpeg`
                response.data
                    .pipe(fs.createWriteStream(imagePath))
                    .on('finish', () => resolve(imagePath))
                    .on('error', e => reject(e));
            }),
    );
}

function sanitizeTitle(title) {
    return title.replace('<', '').replace('>', '').replace('&', '')
}
