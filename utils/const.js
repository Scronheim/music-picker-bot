exports.countryFlagsMapper = {
    Russia: '🇷🇺',
    Ukraine: '🇺🇦',
    Belarus: '🇧🇾',
    Kazakhstan: '🇰🇿',
    Slovakia: '🇸🇰',
    Germany: '🇩🇪',
    Poland: '🇵🇱',
    Sweden: '🇸🇪',
    Finland: '🇫🇮',
    UK: '🇬🇧󠁧󠁢󠁥󠁮󠁧󠁿󠁧󠁢󠁥󠁮󠁧󠁿󠁧󠁢󠁥󠁮󠁧󠁿',
    'UK & Europe': '🇬🇧 🇪🇺󠁧󠁢󠁥󠁮󠁧󠁿󠁧󠁢󠁥󠁮󠁧󠁿󠁧󠁢󠁥󠁮󠁧󠁿',
    'USA & Europe': '🇺🇸 🇪🇺󠁧󠁢󠁥󠁮󠁧󠁿󠁧󠁢󠁥󠁮󠁧󠁿󠁧󠁢󠁥󠁮󠁧󠁿',
    'UK, Europe & US': '🇬🇧 🇪🇺 🇺🇸󠁧󠁢󠁥󠁮󠁧󠁿󠁧󠁢󠁥󠁮󠁧󠁿󠁧󠁢󠁥󠁮󠁧󠁿',
    'USA & Canada': '🇺🇸 🇨🇦󠁧󠁢󠁥󠁮󠁧󠁿󠁧󠁢󠁥󠁮󠁧󠁿󠁧󠁢󠁥󠁮󠁧󠁿',
    Europe: '🇪🇺',
    Norway: '🇳🇴',
    Venezuela: '🇻🇪',
    Italy: '🇮🇪',
    Israel: '🇮🇱',
    'Czech Republic': '🇨🇿',
    Czechoslovakia: '🇨🇿',
    Iceland: '🇮🇸',
    Japan: '🇯🇵',
    US: '🇺🇸',
    Canada: '🇨🇦',
    'New Zealand': '🇳🇿',
    Australia: '🇦🇺',
    Austria: '🇦🇹',
    Spain: '🇪🇸',
    Belgium: '🇧🇪',
    Switzerland: '🇨🇭',
    France: '🇫🇷',
    Greece: '🇬🇷',
    Unknown: '❓',
    Worldwide: '🌍',
}
exports.genresKeyboard = [
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
