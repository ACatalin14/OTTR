const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require('../config');

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: [true, "Please Include your username"]
    },
    email: {
        type: String,
        required: [true, "Please Include your email"],
        unique: true
    },
    phone: {
        type: String,
        required: [true, "Please Include your phone number"]
    },
    password: {
        type: String,
        required: [true, "Please Include your password"]
    },
    role: {
        type: Number,
        required: [true, "Please Include your role"]
    },
    tokens: [
        {
            token: {
                type: String,
                required: true
            }
        }
    ],
    registered: {
        type: Date,
        required: false
    },
    lastLogin: {
        type: Date,
        required: false
    }
});

// this method will hash the password before saving the user model
userSchema.pre('save', async function(next) {

    const user = this;

    if (user.isModified("password")) {
        user.password = await bcrypt.hash(user.password, 8);
    }

    next();
});

// this method generates an auth token for the user
userSchema.methods.generateAuthToken = async function() {
    const user = this;
    const token = jwt.sign({
            _id: user._id,
            username: user.username,
            email: user.email,
            phone: user.phone,
            role: user.role
        }, config.jwtsecret);

    user.tokens = user.tokens.concat({ token });
    await user.save();

    return token;
};

// this method search for a user by email and password.
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email });

    if (!user) {
        throw new Error("Invalid login details");
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
        throw new Error("Invalid login details");
    }

    return user;
};

const User = mongoose.model("User", userSchema);

module.exports = User;