const jwt = require("jsonwebtoken");
const config = require('../config.js');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.replace("Bearer ", "");
        const decoded = jwt.verify(token, config.jwtsecret);

        req.userData = decoded;

        next();
    } catch (err) {
        return res.status(401).json({
            message: "Authentification Failed"
        });
    }
};