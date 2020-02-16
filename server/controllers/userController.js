const CONSTANTS = require('../constants');
const User = require("../models/user");
const bcrypt = require("bcryptjs");

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

            // Generate token for updated user
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

            const deletedUser = await User.findByIdAndDelete(req.params.id,
                (err, user) => {
                    if (err) {
                        throw err;
                    }

                    return user;
                });

            res.status(200).json({ user: deletedUser });
        } catch (err) {
            res.status(500).json({ err: CONSTANTS.ERRORS.OTHER });
        }
    }
};
