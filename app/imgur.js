var request = require('request'),
    $ = require('jquery-deferred'),
    util = require('./util');

/**
 * A simple module for searching Imgur.com for images,
 * or fetching the images from a public album.
 * Requires an Imgur.com API Client ID.
 * @see {@link https://api.imgur.com/oauth2/addclient}
 * @see {@link https://api.imgur.com/models/image}
 * @see {@link https://api.imgur.com/models/album}
 * NOTE: This module uses a Node port of JQuery's Promise implementation.
 * @typedef {$.Deferred()} JqueryDeferred
 * @see {@link https://github.com/zzdhidden/node-jquery-deferred}
 * @param {string} apiKey - your app's Imgur Client ID
 * @constructor
 */
function Imgur (apiKey) {
    this.apiKey = apiKey;
}

/**
 * Searches Imgur.com for images returning a promise.
 * The promise resolves with an array of objects.
 * If no images are found, promise resolves with an empty array.
 * Promise rejects only on service error.
 * @see {@link https://api.imgur.com/models/image}
 * @param {String} query - what you're searching for, append "+ext:gif" for Gifs!
 * @param {String} sort - optional, defaults to "top"
 * @param {Number} page - optional, defaults to 0
 * @returns {JqueryDeferred}
 */
Imgur.prototype.search = function (query, sort, page) {

    var _this = this;
    var def = $.Deferred();
    var page = page || 0;
    var sort = sort || 'top';

    var options = {
        uri: 'https://api.imgur.com/3/gallery/search/' +
                sort + '/' + page + '/?q=' + query,
        headers: {
            'Authorization': 'Client-ID ' + this.apiKey
        }
    };
    var callBack = function (error, response, body) {

        if (error) {
            def.reject({data: {error: error.message, query: query}});
        } else if (response.statusCode == 200) {
            def.resolve(_this.parseResp(body));
        } else {
            def.reject(util.parseJSON(body));
        }

    };

    request.get(options, callBack);
    return def.promise();
};

/**
 * Searches Imgur.com and returning a promise.
 * Promise resolves with a single, randomly selected image model from the search results.
 * Unlike Imgur.search, the promise rejects if no results are found.
 * Similar to Imgur.search, the promise rejects on service error.
 * @see {@link https://api.imgur.com/models/image}
 * @param {string} query  - what you're searching for, append "+ext:gif" for Gifs!
 * @param {String} sort - optional, defaults to "top"
 * @param {Number} page - optional, defaults to 0
 * @returns {JqueryDeferred}
 */
Imgur.prototype.getRandomFromSearch = function (query, sort, page) {

    var def = $.Deferred();

    this.search(query, sort, page)
        .done(function (resp) {
            if (resp.length) {
                def.resolve(util.getRandomIndex(resp));
            } else {
                def.reject({data: {error: 'no img found', query: query}});
            }
        })
        .fail(function (error) {
            def.reject(error);
        });
    return def.promise();
};

/**
 * Gets the images in an album from Imgur.com, returning a promise.
 * The promise resolves with an array of image models.
 * Promise rejects on service error or if no images are found.
 * @see {@link https://api.imgur.com/models/image}
 * @see {@link https://api.imgur.com/models/album}
 * @param {String} id - the album id
 * @returns {JqueryDeferred}
 */
Imgur.prototype.getAlbum = function (id) {

    var _this = this;
    var def = $.Deferred();
    var options = {
        uri: 'https://api.imgur.com/3/album/' + id + '/images',
        headers: {
            'Authorization': 'Client-ID ' + this.apiKey
        }
    };
    var callBack = function (error, response, body) {
        if (error) {
            def.reject({data: {error: error.message}});
        } else if (response.statusCode == 200) {
            def.resolve(_this.parseResp(body));
        } else {
            def.reject(util.parseJSON(body));
        }
    };
    request.get(options, callBack);
    return def.promise();
};

/**
 * Returns a single, randomly selected image model from an Imgur.com album.
 * The promise resolves with a single, randomly selected image model from an album.
 * The promise rejects on service error or if the album isn't found
 * @see {@link https://api.imgur.com/models/image}
 * @see {@link https://api.imgur.com/models/album}
 * @param {String} albumId - the id of the album
 * @returns {JqueryDeferred}
 */
Imgur.prototype.getRandomFromAlbum = function (albumId) {

    var def = $.Deferred();

    this.getAlbum(albumId)
        .done(function (resp) {
            def.resolve(util.getRandomIndex(resp));
        })
        .fail(function (err) {
            def.reject(err);
        });
    return def.promise();
};

/**
 * Safely parses a raw JSON response from the Imgur API into an array of image models.
 * Array is empty if none are found or data is malformed.
 * @see {@link https://api.imgur.com/models/image}
 * @param {String} data - the raw json response from Imgur
 * @returns {Array} - an array of parsed Imgur images
 */
Imgur.prototype.parseResp = function (data) {
    var json = util.parseJSON(data);
    if (json.data && json.data.length) {
        return json.data;
    }
    return [];
};

module.exports = Imgur;
