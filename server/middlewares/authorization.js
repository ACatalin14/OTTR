const jwt = require("jsonwebtoken");
const config = require('../config.js');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.replace("Bearer ", "");

        // decode token to extract user data from it
        req.userData = jwt.verify(token, config.jwtsecret);

        next();
    } catch (err) {
        return res.status(401).json({
            err: "You are unauthorized to access this resource"
        });
    }
};