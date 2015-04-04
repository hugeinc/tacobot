var should = require('should');

var tacobot	= require('../app/tacobot');
var responses = require('../app/responses');

describe('Hip-Chat Webhook', function () {

	var fakeWebHook = {
		'event': 'room_message',
		'item': {
			'message': {
				'date': '2015-01-20T22:45:06.662545+00:00',
				'from': {
					'id': 1661743,
					'mention_name': 'Blinky',
					'name': 'Blinky the Three Eyed Fish'
				},
				'id': '00a3eb7f-fac5-496a-8d64-a9050c712ca1',
				'mentions': [],
				'message': '/weather',
				'type': 'message'
			},
			'room': {
				'id': 1147567,
				'name': 'The Weather Channel'
			}
		},
		'webhook_id': 578829
	};

	it('Should respond with a random message', function (done) {

		tacobot.roomEvent(fakeWebHook)
            .always(function(resp){

                should.exist(resp);
                should.not.exist(resp.error);

                resp.should.be.an.object;
                resp.should.have.property('color').which.is.a.string;
                resp.should.have.property('message_prefix').which.is.a.string;
                resp.should.have.property('message').which.is.a.string;
                resp.should.have.property('notify').which.is.a.boolean;
                resp.should.have.property('message_format').which.is.a.string;

                done();

            });

	});

	it('Should return a message type "Says"', function (done) {

		var responseType = responses[0];

		var message = tacobot.messageType(fakeWebHook, responseType);

		message.should.be.an.object;
		message.should.have.property('color').which.is.a.string;
		message.should.have.property('message_prefix').which.is.a.string;
		message.should.have.property('message').which.is.a.string;
		message.should.have.property('notify').which.is.a.boolean;
		message.should.have.property('message_format').which.is.a.string;		

		done();

	});


	it('Should return a message type "Fact"', function (done) {

		var responseType = responses[1];

		var message = tacobot.messageType(fakeWebHook, responseType);

		message.should.be.an.object;
		message.should.have.property('color').which.is.a.string;
		message.should.have.property('message_prefix').which.is.a.string;
		message.should.have.property('message').which.is.a.string;
		message.should.have.property('notify').which.is.a.boolean;
		message.should.have.property('message_format').which.is.a.string;		

		done();

	});


	it('Should return a message type "Image"', function (done) {

		var responseType = responses[2];

		var message = tacobot.messageType(fakeWebHook, responseType);

		message.should.be.an.object;
		message.should.have.property('color').which.is.a.string;
		message.should.have.property('message_prefix').which.is.a.string;
		message.should.have.property('message').which.is.a.string;
		message.should.have.property('notify').which.is.a.boolean;
		message.should.have.property('message_format').which.is.a.string;		

		done();

	});

	it('Should not return a response if the event type does not match', function (done) {
		
		var fakeWebHook = {
			'event': 'room_enter'
		};

		tacobot.roomEvent(fakeWebHook).always(function (resp) {

			should.exist(resp.error);
            resp.error.should.be.a.string;
			done();

		});		

	});

});