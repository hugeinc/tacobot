var imgurGallery = require('./imgurGallery');
var imgurSearch = require('./imgurSearch');
var webHook = require('./webHook');

module.exports = {
    hipChat : webHook,
    imgur :{
        gallery: JSON.stringify(imgurGallery),
        search:  JSON.stringify(imgurSearch)
    }
};