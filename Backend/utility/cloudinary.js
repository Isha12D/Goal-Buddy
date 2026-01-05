const cloudinary = require('cloudinary').v2;

cloudinary.config({ 
    cloud_name: 'dbr5hv632', 
    api_key: '587882934488358', 
    api_secret: '6zP6C76I90Y__8zJLDDcmcQfKdY' // Click 'View API Keys' above to copy your API secret
});

module.exports = cloudinary;
