const CONSTANTS = require('../constants');

module.exports = (req, res, next) => {

    // username min length 3
    if (!req.body.username || req.body.username.length < 3) {
        return res.status(400).send({ err: CONSTANTS.ERRORS.USERNAME_LENGTH });
    }

    // password min 6 chars
    if (!req.body.password || req.body.password.length < 6) {
        return res.status(400).send({ err: CONSTANTS.ERRORS.PASSWORD_LENGTH });
    }

    // password (repeat) does not match
    if (!req.body.passwordRepeat || req.body.password !== req.body.passwordRepeat) {
        return res.status(400).send({ err: CONSTANTS.ERRORS.PASSWORD_MISMATCH });
    }

    next();
};