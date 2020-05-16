const mongoose = require('mongoose');

const ObjectId = mongoose.Schema.Types.ObjectId;

const seatSchema = mongoose.Schema({
    number: {
        type: Number,
        required: true
    },
    // "selected" tells if the seat is beeing selected by any user in frontend while placing an order
    selected: {
        type: Boolean,
        required: true,
    },
    // the selecting user is the one who is selecting the seat from frontend
    selectingUser: {
        type: ObjectId,
        ref: 'User',
        default: null
    },

    reservations: [{
        type: ObjectId,
        ref: 'Ticket'
    }]
});

module.exports = seatSchema;