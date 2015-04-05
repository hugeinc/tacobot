var util = require('../app/util');
var should = require('should');

var arr = [
    {meat : 'chicken', cheese:true},
    {meat : 'steak', cheese:true},
    {meat : 'barbacoa', cheese:false},
    {meat : 'pork', cheese:true},
    {meat : 'cessina', cheese: false}
];

describe('util taco helpers', function (){

    describe('util.parseJSON', function() {
        it('Parses good JSON', function(done) {
            var result = util.parseJSON(JSON.stringify({message:'hey, this is some good JSON.'}));
            result.should.be.a.Object;
            result.message.should.be.a.String;
            result.message.should.equal('hey, this is some good JSON.');
            done();
        });

        it('Handles null by returning an error object', function(done) {
            var result = util.parseJSON(null);
            result.should.be.a.Object;
            result.error.should.be.a.Error;
            done();
        });

        it('Handles bad JSON by returning an error object', function(done) {
            var result = util.parseJSON('{bad json...');
            result.should.be.a.Object;
            result.error.should.be.a.Error;
            done();
        });
    });

    describe('util.getRandomIndex', function(){

        it('Fetches a random item from an array', function (done) {
            var result = util.getRandomIndex(arr);
            result.should.be.a.Object;
            result.meat.should.be.a.String;
            done();
        });

        it('Doesn\'t break if an array is empty', function (done) {
            var result = util.getRandomIndex([]);
            (result === undefined).should.be.true;
            done();
        });
    });


    describe('util.filterBy', function(){

        it('Fetches an items from an array with a matching value', function (done) {

            var result = util.filterBy(arr, 'cheese', true);
            result.should.be.a.Array;
            result.length.should.equal(3);
            done();
        });

        it('Returns an empty array no matching values', function (done) {
            var result = util.filterBy(arr, 'meat', 'fish');
            result.should.be.a.Array;
            result.length.should.equal(0);
            done();
        });
    });

    describe('util.findBy', function(){

        it('Fetches an item from an array with a matching value', function (done) {

            var result = util.findBy(arr, 'meat', 'pork');
            result.should.be.a.Object;
            result.meat.should.be.a.String;
            result.meat.should.equal('pork');
            result.cheese.should.equal(true);
            done();
        });

        it('Returns undefined if it can\'t find a matching value', function (done) {
            var result = util.findBy(arr, 'meat', 'fish');
            (result === undefined).should.be.true;
            done();
        });
    });

});




