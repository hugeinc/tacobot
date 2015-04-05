/**
 * Taco Helpers
 * @type {{parseJSON: Function, getRandomIndex: Function}}
 */
module.exports = {

    /**
     * safely parses a string to JSON
     * @param str
     * @returns {object} obj
     * @returns {Error} obj.error (if JSON fails to parse)
     */
    parseJSON : function (str) {
        var obj;
        try {
            obj = JSON.parse(str || '');
        } catch (error) {
            obj = {error:error};
        }
        return obj;
    },

    /**
     * Finds a random index in the passed array
     * @param  {Array} arr 			 Array to find random index of
     * @return {String|Array|Object} The value of the random index
     */
    getRandomIndex : function (arr) {
        var index = Math.round(Math.random() * (arr.length - 1));
        return arr[index];
    },

    /**
     * finds all objects in an array with a top-level property matching a specified value
     * @param {Array} arr - the haystack
     * @param {string} field - the name of the property
     * @param {*} value of the property you wish to find
     * @returns {*} the needles
     */
    filterBy : function (arr, field, value) {
        var result = arr.filter(function( obj ) {
            return obj[field] === value;
        });
        return result;
    },

    /**
     * finds the first object in an array with a top-level property matching a specified value
     * @param {Array} arr - the haystack
     * @param {string} field - the name of the property
     * @param {*} value of the property you wish to find
     * @returns {*} the needle
     */
    findBy : function (arr, field, value) {
        var result = this.filterBy(arr, field, value);
        return result[result.length-1];
    }

};