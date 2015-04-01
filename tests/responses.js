var should = require('should');

var responses = require('../app/responses');

describe('Responses Object Health Check', function () {

	describe('Say', function () {

		var response = responses[0];

		it('Should have response type of "Say"', function (done) {

			response.should.have.property('type');
			response.type.should.equal('says');
			done();

		});

		it('Should have a "messages" array', function (done) {

			response.should.have.property('messages');
			response.messages.should.be.an.Array;
			done();

		});

		it('Should have a "response" object', function (done) {

			response.should.have.property('response');
			response.response.should.be.an.Object;
			done();

		});

	});

	describe('Fact', function () {

		var response = responses[1];

		it('Should have response type of "Fact"', function (done) {

			response.should.have.property('type');
			response.type.should.equal('fact');
			done();

		});

		it('Should have a "messages" array', function (done) {

			response.should.have.property('messages');
			response.messages.should.be.an.Array;
			done();

		});

		it('Should have a "response" object', function (done) {

			response.should.have.property('response');
			response.response.should.be.an.Object;
			done();

		});

	});

	describe('Image', function () {

		var response = responses[2];

		it('Should have response type of "Image"', function (done) {

			response.should.have.property('type');
			response.type.should.equal('image');
			done();

		});

		it('Should have a "messages" array', function (done) {

			response.should.have.property('messages');
			response.messages.should.be.an.Array;
			done();

		});

		it('Should have a "response" object', function (done) {

			response.should.have.property('response');
			response.response.should.be.an.Object;
			done();

		});

	});

});