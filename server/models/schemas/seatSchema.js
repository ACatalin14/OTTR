const mongoose = require('mongoose');

const ObjectId = mongoose.Schema.Types.ObjectId;

const seatSchema = mongoose.Schema({
    number: {
        type: Number,
        required: true
    },

    reservations: [{
        type: ObjectId,
        ref: 'Ticket'
    }]
});

module.exports = seatSchema;