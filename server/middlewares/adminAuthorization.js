const jwt = require("jsonwebtoken");
const CONSTANTS = require('../constants.js');
const config = require('../config.js');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.replace("Bearer ", "");

        // decode token to extract user data from it
        req.userData = jwt.verify(token, config.jwtsecret);

        if (req.userData.role === CONSTANTS.USER_ROLES.ADMIN) {
            next();
            return;
        }

        return res.status(401).json({
            err: {
                message: "Only the admin is authorized to access this resource"
            }
        });

    } catch (err) {
        return res.status(401).json({
            err: {
                message: "You are unauthorized to access this resource"
            }
        });
    }
};
