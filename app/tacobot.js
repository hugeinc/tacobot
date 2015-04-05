// Get the response object. Probably subject to change
var responses = require('./responses'),
    util = require('./util');
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

    var response;
    var def = $.Deferred();
	var responseType = exports.getResponseType(data);

    switch(responseType) {
        case "gif":
            // asyncreponse here
            def.resolve({msg:'async response'});
            break;
        default:
            response = exports.buildStaticResponse(data, responseType);
            def.resolve(response);
            break;
    }

    return def.promise();

};

/**
 * determines the type of response based on the content of the HipChat Web Hook Object
 * if type can't be determined, returns a random type.
 * @param data
 * @returns {string}
 */
exports.getResponseType = function(data) {
    //todo message parsing
    return util.getRandomIndex(responses).type;
    return 'gif';
};

/**
 * Creates a Response Object based on the responseType
 * @param  {Object} data Hipchat Web Hook Object
 * @param  {object} response a response object
 * @return {Object}	Returns the response to be sent to Hip Chat
 */
exports.buildStaticResponse = function (data, responseType) {


	var message;

    // Get user information
    var user = data.item.message.from.name;
    var response = util.findBy(responses, 'type', responseType) || util.getRandomIndex(responses);
    var message = util.getRandomIndex(response.messages);

    response = response.response;

	// Take action based on random message type
	switch (responseType) {
		case 'says':
			response.message = user + ' ' + message;
			break;
		case 'fact':
            response.message = response.message_prefix + ' ' + message;
			break;
		case 'image':
            response.message = '#taco ' + message;
			break;
	}

	return response;

};
