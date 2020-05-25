const CONSTANTS = require('../constants');
const Secret = require('../secret');
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const Nexmo = require('nexmo');
const nexmo = new Nexmo({
    apiKey: 'bbf587f5',
    apiSecret: Secret.nexmoApiSecret,
});

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
            await User.updateOne(
                { email: req.body.email },
                { lastLogin: Date.now() }
                );

            res.status(200).json({ user, token });
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
                phone: req.body.phone,
                password: req.body.password,
                role: req.body.role,
                registered: Date.now(),
                lastLogin: Date.now()
            });

            const savedUsed = await user.save();
            const token = await user.generateAuthToken();

            res.status(201).json({ user: savedUsed, token });
        } catch (err) {
            res.status(400).json({ err: err });
        }
    },

    getUserDetails: async (req, res) => {
        await res.json(req.userData);
    },

    update: async (req, res) => {
        try {
            // Check user rights
            if (req.userData.role !== CONSTANTS.USER_ROLES.ADMIN &&
                req.userData._id !== req.params.id
            ) {
                return res.status(401).json({ err: CONSTANTS.ERRORS.UNAUTHORIZED_USER_EDIT });
            }

            let newUserFields = req.body;

            // Sanitize request
            for (let field of Object.keys(newUserFields)) {
                if (!newUserFields[field]) {
                    delete newUserFields[field];
                }
            }
            if (newUserFields.password) {
                newUserFields.password = await bcrypt.hash(newUserFields.password, 8)
            }

            // Update and get updated user
            await User.updateOne(
                { _id: req.params.id },
                newUserFields
            );
            const newUser = await User.findById(req.params.id, (err, user) => {
                return user;
            });

            // Generate new token for updated user
            const token = await newUser.generateAuthToken();

            res.status(200).json({ user: newUser, token });
        } catch (err) {
            res.status(500).json({ err: CONSTANTS.ERRORS.OTHER });
        }
    },

    delete: async (req, res) => {
        try {
            // Check user rights
            if (req.userData.role !== CONSTANTS.USER_ROLES.ADMIN &&
                req.userData._id !== req.params.id
            ) {
                return res.status(401).json({ err: CONSTANTS.ERRORS.UNAUTHORIZED_USER_DELETE });
            }

            await User.findByIdAndDelete(req.params.id,
                (err, deletedUser) => {
                    if (err) {
                        throw err;
                    }

                    return res.status(200).json({ user: deletedUser });
                });

        } catch (err) {
            res.status(500).json({ err: CONSTANTS.ERRORS.OTHER });
        }
    },

    sendSms: async (req, res) => {

        if (!req.userData || !req.userData.phone) {

            return res.status(400).json({ err: CONSTANTS.ERRORS.UNAUTHENTICATED_USER });
        }

        if (!req.body.text) {

            return res.status(400).json({ err: CONSTANTS.ERRORS.MISSING_IMPORTANT_ARGUMENTS });
        }

        const from = 'Vonage APIs';
        const to = req.userData.phone;
        const text = req.body.text;

        try {
            await nexmo.message.sendSms(from, to, text);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ err: CONSTANTS.ERRORS.CANNOT_SEND_SMS });
        }

        return res.status(200).json(true);
    }
};
