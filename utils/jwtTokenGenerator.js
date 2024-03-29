const jwt = require("jsonwebtoken");
require('dotenv').config();

function jwtTokenGenerator(userName, userId) {
    const payload = {
        user : userName,
        userId : userId
    };
    return jwt.sign(payload, process.env.secret_key, {expiresIn : 60 * 60});
}

module.exports = jwtTokenGenerator;