var util = require('../app/util');
var should = require('should');

describe('util.parseJSON', function (){

    it('Parses good JSON', function(){
       var result = util.parseJSON(JSON.stringify({message:'hey, this is some good JSON.'}));
        result.should.be.a.Object;
        result.message.should.be.a.String;
        result.message.should.equal('hey, this is some good JSON.');
    });

    it('Handles null by returning an error object', function(){
        var result = util.parseJSON(null);
        result.should.be.a.Object;
        result.error.should.be.a.Error;
    });

    it('Handles bad JSON by returning an error object', function(){
        var result = util.parseJSON('{bad json...');
        result.should.be.a.Object;
        result.error.should.be.a.Error;
    });

});

describe('util.getRandomIndex', function(){

    it('Fetches a random item from an array', function (done) {
        var arr = ['chicken', 'pork', 'carne asada', 'onions'];
        var result = util.getRandomIndex(arr);
        result.should.be.a.String;
        done();
    });

    it('Doesn\'t break if an array is empty', function (done) {
        var result = util.getRandomIndex([]);
        (result === undefined).should.be.true;
        done();
    });
});

