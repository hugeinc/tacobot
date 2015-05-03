var responses = require('./responses'),
    util = require('./util'),
    config = require('../config'),
    Imgur = require('./imgur'),
    $ = require('jquery-deferred');

/**
 * Takes action on various room events, returning a promise.
 * Promise resolves with a response object for HipChat.
 * Promise rejects with an error response for HipChat.
 * @see {@link https://www.hipchat.com/docs/apiv2/webhooks}
 * @param {Object} data - HipChat WebHook data
 * @returns {JqueryDeferred}
 *
 */
exports.roomEvent = function (data) {

    var def = $.Deferred();

    switch (data.event) {
        case 'room_message':
            def = exports.message(data);
            break;
        default:
            def.reject({
                error: 'tacobot doesn\'t currently support event: ' +
                data.event + '. Lo siento.'
            });
            break;
    }

    return def.promise();

};

/**
 * Generates a response based on HipChat WebHook data, returning a promise.
 * Promise resolves with a response object for HipChat.
 * Promise rejects with an error response for HipChat.
 * @param  {Object} data - HipChat WebHook Object
 * @returns {JqueryDeferred}
 */
exports.message = function (data) {

    var def;
    var responseType = exports.getResponseType(data);

    switch (responseType) {
        case 'gif':
            def = exports.imgurResponse(data);
            break;
        default:
            def = $.Deferred();
            def.resolve(exports.buildStaticResponse(data, responseType));
            break;
    }

    return def.promise();

};

/**
 * Fetches a random GIF from the Imgur TacoBot album, returning a promise.
 * Promise resolves with a response object for HipChat.
 * Promise rejects with an error response for HipChat.
 * @param {Object} data - a HipChat Web Hook Object
 * @returns {JqueryDeferred}
 */
exports.imgurResponse = function (data) {

    var def = $.Deferred();
    var user = data.item.message.from.name;
    var albumId = config.IMGUR.ALBUM_ID;
    var apiKey = config.IMGUR.API_KEY;
    var imgur = new Imgur(apiKey);
    var msg;

    imgur.getRandomFromAlbum(albumId)
        .done(function (resp) {
            msg = '#taco ' + resp.link;
            def.resolve(exports.buildResponse(msg, true, 'green'))
        }).fail(function (resp) {
            msg = 'lo siento... ' + user + '. ' + resp.data.error;
            def.resolve(exports.buildResponse(msg, true, 'red'))
        });
    return def.promise();

};

/**
 * Determines the type of response based on the content of the HipChat WebHook Object.
 * If type can't be determined, returns type "says".
 * @param {Object} data - a HipChat WebHook Object
 * @returns {String}
 */
exports.getResponseType = function (data) {
    var msg = data.item.message.message.split('/taco').pop().toLowerCase();
    // probably a smarter way to do this
    if (msg.indexOf('gif') > -1) {
        return 'gif';
    }
    if (msg.indexOf('pic') > -1) {
        return 'image';
    }
    if (msg.indexOf('image') > -1) {
        return 'image';
    }
    if (msg.indexOf('fact') > -1) {
        return 'fact';
    }

    return 'says';
};

/**
 * Builds a response object to be sent to HipChat.
 * @param {String} message - the message you want to appear
 * @param {Boolean} notify - optional, defaults to true
 * @param {String} color - optional, defaults to "green"
 * @param {String} messageFormat - optional, defaults to "text"
 * @returns {Object} a response to be sent to HipChat
 */
exports.buildResponse = function (message, notify, color, messageFormat) {
    return {
        color: color || 'green',
        'message_prefix': '',
        message: message,
        notify: !!notify,
        'message_format': messageFormat || 'text'
    };
};

/**
 * Creates a Response Object from static content based on the responseType.
 * @param  {Object} data - Hipchat Web Hook Object
 * @param  {Object} responseType - a response object
 * @returns {Object} a response to be sent to HipChat
 */
exports.buildStaticResponse = function (data, responseType) {

    // Get user information
    var user = data.item.message.from.name;
    var response = util.findBy(responses, 'type', responseType);
    var message = util.getRandomIndex(response.messages);

    response = response.response;

    // Take action based on message type
    switch (responseType) {

        case 'fact':
            response.message = response['message_prefix'] + ' ' + message;
            response.color = 'yellow';
            break;
        case 'image':
            response.message = '#taco ' + message;
            response.color = 'green';
            break;
        default:
            response.message = user + ' ' + message;
            response.color = 'purple';
            break;
    }

    return response;

};
