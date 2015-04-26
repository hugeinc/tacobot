var should = require('should'),
    tacobot = require('../app/tacobot'),
    mock = require('./mock'),
    sinon = require('sinon'),
    request = require('request');

describe('tacobot Hip-Chat Webhook', function () {

    describe('getResponseType method', function () {

        it('Should by default, return says', function (done) {
            var fakeHook = JSON.parse(mock.hipChat.getHook('/taco'));
            var type = tacobot.getResponseType(fakeHook);
            type.should.equal('says');
            done();
        });

        it('Should interpret an image request when it finds the word "pic"', function (done) {
            var fakeHook = JSON.parse(mock.hipChat.getHook('/taco how about a Pic?'));
            var type = tacobot.getResponseType(fakeHook);
            type.should.equal('image');
            done();
        });

        it('Should interpret an image request when it finds the word "image"', function (done) {
            var fakeHook = JSON.parse(mock.hipChat.getHook('/taco how about an Image?'));
            var type = tacobot.getResponseType(fakeHook);
            type.should.equal('image');
            done();
        });

        it('Should be able to interpret a gif request', function (done) {
            var fakeHook = JSON.parse(mock.hipChat.getHook('/taco bot GIF me!'));
            var type = tacobot.getResponseType(fakeHook);
            type.should.equal('gif');
            done();
        });

        it('Should be able to interpret a fact request', function (done) {
            var fakeHook = JSON.parse(mock.hipChat.getHook('/taco fact...'));
            var type = tacobot.getResponseType(fakeHook);
            type.should.equal('fact');
            done();
        });
    });

    describe('buildResponse method', function () {
        it('should only require a message to return a response', function (done) {
            var response = tacobot.buildResponse('test');
            response.should.be.an.object;
            response.should.have.property('color').which.is.a.string;
            response.should.have.property('message_prefix').which.is.a.string;
            response.should.have.property('message').which.is.a.string;
            response.should.have.property('notify').which.is.a.boolean;
            response.should.have.property('message_format').which.is.a.string;
            done();
        });
    });

    describe('buildStaticResponse method', function () {

        it('Returns a message type "Says" by default', function (done) {

            var fakeWebHook = JSON.parse(mock.hipChat.getHook());
            var responseType = tacobot.getResponseType(fakeWebHook);
            var response = tacobot.buildStaticResponse(fakeWebHook, responseType);

            response.should.be.an.object;
            response.should.have.property('color').which.is.a.string;
            response.should.have.property('message_prefix').which.is.a.string;
            response.should.have.property('message').which.is.a.string;
            response.should.have.property('notify').which.is.a.boolean;
            response.should.have.property('message_format').which.is.a.string;

            done();

        });

        it('Returns a message type "Fact" for "/taco *fact*"', function (done) {

            var fakeWebHook = JSON.parse(mock.hipChat.getHook('/taco how about a fact?'));
            var responseType = tacobot.getResponseType(fakeWebHook);
            var message = tacobot.buildStaticResponse(fakeWebHook, responseType);

            message.should.be.an.object;
            message.should.have.property('color').which.is.a.string;
            message.should.have.property('message_prefix').which.is.a.string;
            message.should.have.property('message').which.is.a.string;
            message.should.have.property('notify').which.is.a.boolean;
            message.should.have.property('message_format').which.is.a.string;

            done();

        });

        it('Returns a message type "Image" for "/taco *pic*"', function (done) {

            var fakeWebHook = JSON.parse(mock.hipChat.getHook('/taco can i see pic?'));
            var responseType = tacobot.getResponseType(fakeWebHook);
            var message = tacobot.buildStaticResponse(fakeWebHook, responseType);

            message.should.be.an.object;
            message.should.have.property('color').which.is.a.string;
            message.should.have.property('message_prefix').which.is.a.string;
            message.should.have.property('message').which.is.a.string;
            message.should.have.property('notify').which.is.a.boolean;
            message.should.have.property('message_format').which.is.a.string;

            done();

        });
    });

    describe('Static content responses', function () {

        it('Should respond with a message type "Says" by default', function (done) {

            var fakeWebHook = JSON.parse(mock.hipChat.getHook());
            tacobot.roomEvent(fakeWebHook)
                .always(function (resp) {

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

        it('Should return a message type "Fact" for "/taco *fact*"', function (done) {
            // /taco gif
            var fakeWebHook = JSON.parse(mock.hipChat.getHook('/taco fact?'));
            tacobot.roomEvent(fakeWebHook)
                .always(function (resp) {

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

        it('Should return a message type "Image" for "/taco *pic*"', function (done) {
            var fakeWebHook = JSON.parse(mock.hipChat.getHook('/taco pics or it did\'t happen.'));
            tacobot.roomEvent(fakeWebHook)
                .always(function (resp) {

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

    });

    describe('Async Imgur API response', function () {
        before(function (done) {
            sinon
                .stub(request, 'get')
                .yields(null, {statusCode: 200}, mock.imgur.album);
            done();
        });

        after(function (done) {
            request.get.restore();
            done();
        });

        it('Should return a message type "Gif" for "/taco *gif*"', function (done) {
            var fakeWebHook = JSON.parse(mock.hipChat.getHook('/taco gif me por favor...'));
            tacobot.roomEvent(fakeWebHook)
                .always(function (resp) {
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
    });

    describe('Async Imgur API Error handling', function () {
        var errMsg = 'Imgur shit the bed. Too many tacos.';

        before(function (done) {
            sinon
                .stub(request, 'get')
                .yields(new Error(errMsg, null));
            done();
        });

        after(function (done) {
            request.get.restore();
            done();
        });

        it('Should handle service errors from Imgur and still return a response.', function (done) {
            var fakeWebHook = JSON.parse(mock.hipChat.getHook('/taco gif me por favor...'));
            tacobot.roomEvent(fakeWebHook)
                .always(function (resp) {
                    should.exist(resp);
                    should.not.exist(resp.error);
                    resp.should.be.an.object;
                    resp.should.have.property('color').which.is.a.string;
                    resp.color.should.equal('red');
                    resp.should.have.property('message_prefix').which.is.a.string;
                    resp.should.have.property('message').which.is.a.string;
                    resp.should.have.property('notify').which.is.a.boolean;
                    resp.should.have.property('message_format').which.is.a.string;
                    done();
                });
        });
    });

    describe('Error Handling', function () {

        it('Should return an error response if the event type does not match', function (done) {
            var fakeWebHook = JSON.parse(mock.hipChat.getHook(null, null, 'room_enter'));
            tacobot.roomEvent(fakeWebHook).always(function (resp) {
                should.exist(resp.error);
                resp.error.should.be.a.string;
                done();
            });
        });

    });

});
