module.exports = {
    apiKey: {
        data: {
            error: 'Invalid client_id',
            request: '/3/gallery/search/top/0/',
            method: 'GET'
        },
        success: false,
        status: 403
    },
    emptySearch: {data: [], success: true, status: 200},
    albumNotFound: {
        data: {
            error: 'Unable to find an album with the id, x.',
            request: '\/3\/album\/x\/images',
            method: 'GET'
        },
        success: false,
        status: 404
    }

};
