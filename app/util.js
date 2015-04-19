/**
 * Taco Helpers
 */
module.exports = {

    /**
     * Safely parses a string to JSON.
     * @param {String} str - the raw JSON string you wish to parse
     * @returns {Object} obj - the parsed object
     * @returns {Error} obj.error - exception thrown if and when JSON fails to parse
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
     * @param  {Array} arr
     * @return {*} The value of the random index
     */
    getRandomIndex : function (arr) {
        var index = Math.round(Math.random() * (arr.length - 1));
        return arr[index];
    },

    /**
     * Finds all objects in an array with a top-level property matching a specified value.
     * @param {Array} arr - the haystack
     * @param {String} field - the name of the property
     * @param {*} value - the property you wish to find
     * @returns {*} the needle(s)
     */
    filterBy : function (arr, field, value) {
        var result = arr.filter(function( obj ) {
            return obj[field] === value;
        });
        return result;
    },

    /**
     * Finds the first object in an array with a top-level property matching a specified value.
     * @param {Array} arr - the haystack
     * @param {String} field - the name of the property
     * @param {*} value - the property you wish to find
     * @returns {*} the needle
     */
    findBy : function (arr, field, value) {
        var result = this.filterBy(arr, field, value);
        return result[result.length-1];
    }

};