var should = require('should');
var sinon = require('sinon');
var request = require('request');
var Imgur = require('../app/imgur');
var mock = require('./mock');

var albumId = 'ABEs0';

describe('Imgur response parsing', function () {

    it('Should be able to parse an Imgur album response to an array of GIFs', function(done) {
        var imgur = new Imgur();
        var parsed = imgur.parseResp(mock.imgur.album);
        parsed.should.be.an.Array;
        parsed.length.should.equal(6);
        return done();
    });

    it('Should be able to parse an Imgur search response to an array of GIFs', function(done) {
        var imgur = new Imgur();
        var parsed = imgur.parseResp(mock.imgur.search);
        parsed.should.be.an.Array;
        parsed.length.should.equal(60);
        return done();
    });

    it('Should return an empty array when given a bad string', function(done) {
        var imgur = new Imgur();
        var parsed = imgur.parseResp('{asdf junk string...');
        parsed.should.be.an.Array;
        parsed.length.should.equal(0);
        return done();
    });
});

describe('Imgur http helper error handling', function(){

    var errMsg = 'Imgur shit the bed. Too many tacos.';

    before(function(done){
        sinon
            .stub(request, 'get')
            .yields(new Error(errMsg));
        done();
    });

    after(function(done){
        request.get.restore();
        done();
    });

    it('Handles an http error when fetching from an Imgur album', function(done){
        var imgur = new Imgur('valid-key');
        imgur.getRandomFromAlbum(albumId).always(function(resp){
            resp.data.should.be.a.Object;
            resp.data.error.should.be.a.String;
            resp.data.error.should.equal(errMsg);
            done();
        });
    });

    it('Handles an http error when searching Imgur', function(done){
        var imgur = new Imgur('valid-key');
        imgur.getRandomFromSearch('tacos+ext:gif').always(function(resp){
            resp.data.should.be.a.Object;
            resp.data.error.should.be.a.String;
            resp.data.error.should.equal(errMsg);
            done();
        });
    });

});


describe('Imgur service helper error handling', function(){

    before(function(done){
        sinon
            .stub(request, 'get')
            .yields(null, {statusCode:403}, mock.imgur.serviceError.apiKey);
        done();
    });

    after(function(done){
        request.get.restore();
        done();
    });

    it('Handles an invalid API Key from Imgur on the album endpoint', function(done){
        var imgur = new Imgur('invalid-key');
        imgur.getRandomFromAlbum(albumId).always(function(resp){
            resp.data.should.be.a.Object;
            resp.data.error.should.be.a.String;
            resp.data.error.should.equal('Invalid client_id');
            done();
        });

    });

    it('Handles an invalid API Key from Imgur on the search endpoint', function(done){
        var imgur = new Imgur('invalid-key');
        imgur.getRandomFromSearch('tacos+ext:gif').always(function(resp){
            resp.data.should.be.a.Object;
            resp.data.error.should.be.a.String;
            resp.data.error.should.equal('Invalid client_id');
            done();
        });
    });

});

describe('Imgur API search endpoint helper', function(){

    describe("Handles a search result from Imgur", function(){

        beforeEach(function(done){
            sinon
                .stub(request, 'get')
                .yields(null, {statusCode:200}, mock.imgur.search);
            done();
        });

        afterEach(function(done){
            request.get.restore();
            done();
        });

        it('Searches Imgur for images, resolving w/ a parsed array', function(done){
            var imgur = new Imgur('valid-key');
            imgur.search('taco').always(function(resp){
                resp.should.be.a.array;
                done();
            });
        });

        it('Resolves w/ a random image from a search result', function(done){
            var imgur = new Imgur('valid-key');
            imgur.getRandomFromSearch('taco').always(function(resp){
                resp.should.be.a.object;
                resp.link.should.be.a.string;
                done();
            });
        });

    });

    describe('Handles an empty search result', function(){

        beforeEach(function(done){
            sinon
                .stub(request, 'get')
                .yields(null, {statusCode:200}, mock.imgur.serviceError.emptySearch);
            done();
        });

        afterEach(function(done){
            request.get.restore();
            done();
        });


        it('Resolves w/ an empty array if nothing is found on search', function(done){
            var imgur = new Imgur('valid-key');
            imgur.search('asdfkadsdflj +ext:gif nude bea arthur').always(function(resp){
                //console.log(resp);
                resp.should.be.a.array;
                resp.length.should.equal(0);
                done();
            });
        });
        it('Rejects w/ an error object with the failed query if nothing is found on getRandom', function(done){
            var query = 'dakdflakj onions rule!!dkdk';
            var imgur = new Imgur('valid-key');
            imgur.getRandomFromSearch(query).always(function(resp){
                //console.log(resp);
                resp.data.should.be.a.object;
                resp.data.error.should.be.a.string;
                resp.data.query.should.equal(query);
                done();
            });
        });
    });


});

describe('Imgur API album endpoint helper', function(){

    describe('Handles an album result from Imgur API', function(){

        beforeEach(function(done){
            sinon
                .stub(request, 'get')
                .yields(null, {statusCode:200}, mock.imgur.album);
            done();
        });

        afterEach(function(done){
            request.get.restore();
            done();
        });

        it('Resolves with an array of images from the album', function(done){
            var imgur = new Imgur('valid-key');
            imgur.getAlbum(albumId).always(function(resp){
                resp.should.be.a.array;
                resp.length.should.not.equal(0);
                done();
            });
        });

        it('Resolves w/ a random image from an album', function(done){
            var imgur = new Imgur('valid-key');
            imgur.getRandomFromAlbum(albumId).always(function(resp){
                resp.should.be.a.object;
                resp.link.should.be.a.string;
                done();
            });
        });
    });

    describe('Handles an album not found from Imgur API', function(){

        beforeEach(function(done){
            sinon
                .stub(request, 'get')
                .yields(null, {statusCode:404}, mock.imgur.serviceError.albumNotFound);
            done();
        });

        afterEach(function(done){
            request.get.restore();
            done();
        });

        it('Rejects w/ a parsed error response if the album isn\'t found', function(done){
            var imgur = new Imgur('valid-key');
            imgur.getAlbum('x').always(function(resp){
                resp.data.should.be.a.object;
                resp.data.error.should.be.a.string;
                done();
            });
        });
        it('Rejects w/ an error if it can\'t find the album on get Random', function(done){
            var imgur = new Imgur('valid-key');
            imgur.getRandomFromAlbum('x').always(function(resp){
                resp.data.should.be.a.object;
                resp.data.error.should.be.a.string;
                done();
            });
        });
    });


})
