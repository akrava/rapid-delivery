const crypto = require('crypto'),
    lengthBytes = 24;

module.exports = {
    ServerPort: process.env['PORT'] || 3005,
    DatabaseUrl: process.env['DATABASE_URL'] || 'mongodb://127.0.0.1:27017/lab8db',
    SecretSession: process.env['SESSION_SECRET'] 
        || process.env['npm_package_config_SESSION_SECRET'] 
        || crypto.randomBytes(lengthBytes).toString('hex'),
    SaltHash: process.env['SALT_HASH'] || process.env['npm_package_config_SALT_HASH'],
    cloudinary : {
        cloud_name: process.env['CLOUDINARY_CLOUD_NAME'] 
            || process.env['npm_package_config_CLOUDINARY_CLOUD_NAME'],
        api_key: process.env['CLOUDINARY_API_KEY'] 
            || process.env['npm_package_config_CLOUDINARY_API_KEY'],
        api_secret: process.env['CLOUDINARY_API_SECRET'] 
            || process.env['npm_package_config_CLOUDINARY_API_SECRET']
    }
};