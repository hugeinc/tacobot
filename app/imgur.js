var request = require('request');
var $ = require('jquery-deferred');
var util = require('./util');

/**
 * a simple module for searching Imgur.com for images
 * or fetching the images from a public album.
 * see https://api.imgur.com/models/image
 * see https://api.imgur.com/models/album
 * @param {string} apiKey, your app's Imgur API key
 * @constructor
 */
function Imgur (apiKey) {
    this.apiKey = apiKey;
}

/**
 * see https://api.imgur.com/models/image
 * Searches Imgur.com for images returning a promise.
 * The promise resolves with an array of objects
 * If no images are found, promise resolves with an empty array.
 * Promise rejects only on service error.
 * @param {string} query (append "+ext:gif" for Gifs!)
 * @param {string}_ sort (optional) defaults to top
 * @param {number} page (optional) defaults to 0
 * @returns {jquery-deferred}
 */
Imgur.prototype.search = function (query, sort, page) {

    var _this = this;
    var def = $.Deferred();
    var page = page || 0;
    var sort = sort || 'top';

    var options = {
        uri : 'https://api.imgur.com/3/gallery/search/'
                + sort + '/' + page + '/?q=' + query,
        headers : {
            'Authorization'	: 'Client-ID ' + this.apiKey
        }
    };
    var callBack = function (error, response, body) {

        if (error) {
            def.reject({data:{error: error.message, query:query}});
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
 * see https://api.imgur.com/models/image
 * searches Imgur.com and returning a promise.
 * Promise resolves with a single, randomly selected image model from the search results
 * Unlike Imgur.search, the promise rejects if no results are found.
 * Similar to Imgur.search, the promise rejects on service error.
 * @param {string} query (append "+ext:gif" for Gifs!)
 * @param {string}_ sort (optional) defaults to top
 * @param {number} page (optional) defaults to 0
 * @returns {jquery-deferred}
 */
Imgur.prototype.getRandomFromSearch = function(q, sort, page) {

    var def = $.Deferred();

    this.search(q, sort, page)
        .done(function(resp){
            if (resp.length) {
                def.resolve(util.getRandomIndex(resp));
            } else {
                def.reject({data:{error: 'no img found', query:q}});
            }
        })
        .fail(function(error){
            def.reject(error);
        });
    return def.promise();
};

/**
 * see https://api.imgur.com/models/image
 * see https://api.imgur.com/models/album
 * Gets the images in an album from Imgur.com, returning a promise.
 * The promise resolves with an array of image models.
 * Promise rejects on service error or if no images are found.
 * @param {string}_ id - the album id
 * @returns {jquery-deferred}
 */
Imgur.prototype.getAlbum = function(id) {

    var _this = this;
    var def = $.Deferred();
    var options = {
        uri : 'https://api.imgur.com/3/album/' + id + '/images',
        headers : {
            'Authorization'	: 'Client-ID ' + this.apiKey
        }
    };
    var callBack = function (error, response, body) {
        if (error) {
            def.reject({data:{error:error.message}});
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
 * see https://api.imgur.com/models/image
 * see https://api.imgur.com/models/album
 * Returns a single, randomly selected image model from an album on Imgur.com
 * The promise resolves with a single, randomly selected image model from an album.
 * The promise rejects on service error or if the album isn't found.
 * @param {string}_ id - the id of the album
 * @returns {jquery-deferred}
 */
Imgur.prototype.getRandomFromAlbum = function(albumId) {

    var def = $.Deferred();

    this.getAlbum(albumId)
        .done(function(resp){
            def.resolve(util.getRandomIndex(resp));
        })
        .fail(function(err){
            def.reject(err);
        });
    return def.promise();
};

/**
 * safely parses a raw JSON response from the Imgur API,
 * into an array of image models (see see https://api.imgur.com/models/image)
 * Array is empty if none are found or data is malformed.
 * @param {string} data
 * @returns {array}
 */
Imgur.prototype.parseResp = function (data) {
    var json = util.parseJSON(data);
    if (json.data && json.data.length) {
        return json.data;
    }
    return [];
};

module.exports = Imgur;
