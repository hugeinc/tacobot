var imgurGallery = require('./imgurGallery');
var imgurSearch = require('./imgurSearch');

module.exports = {
    imgur :{
        gallery: JSON.stringify(imgurGallery),
        search:  JSON.stringify(imgurSearch)
    }
};