const CONSTANTS = require('../constants');
const User = require("../models/user");

module.exports = {
    login: async (req, res) => {
        try {
            const email = req.body.email;
            const password = req.body.password;
            const user = await User.findByCredentials(email, password);

            if (!user) {
                return res.status(401).json({ err: CONSTANTS.ERRORS.WRONG_CREDENTIALS });
            }

            const token = await user.generateAuthToken();

            user.where({ email: req.body.email }).update(
                { $set: { lastLogin: Date.now() } }
                );

            res.status(201).json({ user, token });
        } catch (err) {
            res.status(400).json({ err: CONSTANTS.ERRORS.WRONG_CREDENTIALS });
        }
    },

    register: async (req, res) => {
        try {
            if (await User.exists({ email: req.body.email })) {
                return res.status(401).json({ err: CONSTANTS.ERRORS.EMAIL_ALREADY_EXISTS });
            }

            const user = new User({
                username: req.body.username,
                email: req.body.email,
                password: req.body.password,
                registered: Date.now(),
                lastLogin: Date.now()
            });

            let data = await user.save();
            const token = await user.generateAuthToken();

            res.status(201).json({ data, token });
        } catch (err) {
            res.status(400).json({ err: err });
        }
    },

    getUserDetails: async (req, res) => {
        await res.json(req.userData);
    }
};
