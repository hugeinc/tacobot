// Get the response object. Probably subject to change
var responses = require('./responses'),
    util = require('./util');

/**
 * Takes action on various room events. See
 * https://www.hipchat.com/docs/apiv2/webhooks for more information
 * @param  {Object}   data Hipchat Web Hook Object
 * @param  {Function} next Callback
 * @return {Object}	       Returns the response to be sent to Hip Chat
 */
exports.roomEvent = function (data, next) {

	switch (data.event) {
		case 'room_message':
			return exports.message(data, next);
		default:
			return next(null, null);
	}

};

/**
 * Generates a random response and returns it
 * @param  {Object}   data Hipchat Web Hook Object
 * @param  {Function} next Callback
 * @return {Object}	       Returns the response to be sent to Hip Chat
 */
exports.message = function (data, next) {

	// Random response type
	var responseType = util.getRandomIndex(responses);

	var response = exports.messageType(data, responseType);

	return next(null, response);

};

/**
 * Returns a message based on the responseType
 * @param  {Object} data Hipchat Web Hook Object
 * @param  {Object} responseType The response object
 * @return {Object}	       Returns the response to be sent to Hip Chat
 */
exports.messageType = function (data, responseType) {

	// Get user information
	var user = data.item.message.from.name;

	// Get a random message
	var message = util.getRandomIndex(responseType.messages);

	// Take action based on random message type
	switch (responseType.type) {
		case 'says':
			responseType.response.message = user + ' ' + message;
			break;
		case 'fact':
			responseType.response.message = responseType.response.message_prefix + ' ' + message;
			break;
		case 'image':
			responseType.response.message = '#taco ' + message;
			break;
	}

	return responseType.response;

};
