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
        var index = Math.round(Math.random() * (arr.length - 1))
        return arr[index];
    }

};