const crypto = require('crypto'),
    lengthBytes = 24;

if (process.env['NODE_ENV'] !== 'production') {
    require('dotenv').config();
}

module.exports = {
    ServerPort: process.env['PORT'],
    DatabaseUrl: process.env['DATABASE_URL'],
    SecretSession: process.env['SESSION_SECRET'] || crypto.randomBytes(lengthBytes).toString('hex'),
    SaltHash: process.env['SALT_HASH'],
    cloudinary : {
        cloud_name: process.env['CLOUDINARY_CLOUD_NAME'],
        api_key: process.env['CLOUDINARY_API_KEY'],
        api_secret: process.env['CLOUDINARY_API_SECRET']
    }
};