const jwt = require('jsonwebtoken');
require('dotenv').config();
// Middleware to authenticate JWT for protected routes
function authenticateToken(req, res, next) {
    // Get the JWT from the Authorization header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
  
    if (!token) {
      return res.sendStatus(401); // Unauthorized
    }
  
    // Verify the JWT
    jwt.verify(token, process.env.secretKey , (err, user) => {
      if (err) {
        return res.status(403).json({ message: 'Invalid token' });
      }
  
      // JWT is valid, store the user object in the request for later use
      req.user = user;
      next();
    });
  }

/**
 * 
 * @param {String} password 
 * @returns {Object} an object with the salt and hash
 */
function toSaltAndHash(password) {
    const crypto = require('crypto');
    const salt = crypto.randomBytes(32).toString('hex');
    const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
    return {
        salt,
        hash
    };
}

/**
 * 
 * @param {String} password 
 * @param {String} salt 
 * @param {String} hash 
 * @returns {Boolean} true if the password hashes to the same value as the hash
 */
function validPassword(password, salt, hash) {
    const crypto = require('crypto');
    const newHash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
    return hash === newHash;
}


module.exports.authenticateToken = authenticateToken;
module.exports.toSaltAndHash = toSaltAndHash;
module.exports.validPassword = validPassword;