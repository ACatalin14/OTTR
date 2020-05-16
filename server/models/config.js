const mongoose = require('mongoose');

const configSchema = mongoose.Schema({

    kmPrice: {
        type: Number,
        required: false,
    },
    lastOrderNumber: {
        type: Number,
        required: false
    }

});

const Config = mongoose.model("Config", configSchema, 'config');

module.exports = Config;