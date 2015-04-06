var responses = require('./responses'),
    util = require('./util'),
    Imgur = require('./imgur'),
    $ = require('jquery-deferred');

/**
 * Takes action on various room events. See
 * https://www.hipchat.com/docs/apiv2/webhooks for more information
 * @param  {Object}   data Hipchat Web Hook Object
 * @return {jquery-deferred} Resolves with response to be sent to Hip Chat, rejects with an error message
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
               error : 'tacobot doesn\'t currently support event: '
                + data.event + '. Lo siento.'
            });
            break;
    }

    return def.promise();

};

/**
 * Generates a response based on Web Hook data and returns a promise.
 * Promise resolves with the content of the response to be sent to HipChat
 * @param  {Object}   data Hipchat Web Hook Object
 * @return {jquery-deferred} Resolves with response to be sent to Hip Chat, rejects with an error message
 */
exports.message = function (data) {

    var def;
    var responseType = exports.getResponseType(data);

    switch(responseType) {
        case "gif":
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
 * fetches a random GIF from the Imgur tacobot album,
 * returning a promise that resolves with a response object for HipChat
 * containing either an img or a message indicating an error
 * @param {Object} data - a HipChat Web Hook Object
 * @returns {jquery-deferred}
 */
exports.imgurResponse = function (data) {

    var def = $.Deferred();
    var user = data.item.message.from.name;
    var albumId = 'ABEs0';
    var imgur = new Imgur('8ff16bbd77e6338');
    var msg;

    imgur.getRandomFromAlbum(albumId)
        .done(function(resp){
            msg = '#taco ' + resp.link;
            def.resolve(exports.buildResponse(msg, true, 'green'))
        }).fail(function(resp){
            msg = 'lo siento... ' + user + '' + resp.data.error;
            def.resolve(exports.buildResponse(msg, true, 'red'))
        });
    return def.promise();

};

/**
 * determines the type of response based on the content of the HipChat Web Hook Object
 * if type can't be determined, returns a random type.
 * @param {Object} data - a HipChat Web Hook Object
 * @returns {String}
 */
exports.getResponseType = function(data) {
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
 * builds a response object to be sent to HipChat
 * @param {String} message the message you want to appear
 * @param {Boolean} notify (optional) defaults to true
 * @param {String} color (optional) defaults to green
 * @param messageFormat (optional) defaults to text
 * @returns {Object}
 */
exports.buildResponse = function(message, notify, color, messageFormat) {
    return {
        color: color || 'green',
        message_prefix: '',
        message: message,
        notify: !!notify,
        message_format: messageFormat || 'text'
    };
};

/**
 * Creates a Response Object from static content based on the responseType
 * @param  {Object} data - Hipchat Web Hook Object
 * @param  {Object} response - a response object
 * @return {Object}	Returns the response to be sent to Hip Chat
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
            response.message = response.message_prefix + ' ' + message;
            break;
        case 'image':
            response.message = '#taco ' + message;
            break;
        default:
            response.message = user + ' ' + message;
            break;
    }

    return response;

};
