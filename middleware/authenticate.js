const jwt = require("jsonwebtoken");
require("dotenv").config();

const authenticateToken = async (req, res, next) => {
    try {
        const token = req.header("token");
        if(!token) {
            res.status(401).json({error: "Not Authorized"});
        }
        const payload = jwt.verify(token, process.env.secret_key);
        req.user = payload;
        next();
    }
    catch(e) {
        console.error(e.message);
        res.status(401).json({error: "Not Authorized"});
    }
}

module.exports = authenticateToken;