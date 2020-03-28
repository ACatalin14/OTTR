const mongoose = require('mongoose');

const seatSchema = mongoose.Schema({
    number: {
        type: Number,
        required: true
    },
    reserved: {
        type: Boolean,
        default: false
    }
});

module.exports = seatSchema;