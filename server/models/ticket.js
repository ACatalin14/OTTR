const mongoose = require('mongoose');

const ObjectId = mongoose.Schema.Types.ObjectId;

const ticketSchema = mongoose.Schema({

    price: {
        type: Number,
        required: false,
    },

    order: {
        type: ObjectId,
        ref: 'Order'
    },
    ride: {
        type: ObjectId,
        ref: 'Route.rides'
    },
    seat: {
        rtpe: ObjectId,
        ref: 'Car.seats'
    },
    departureStation: {
        type: ObjectId,
        ref: 'RouteStation'
    },
    arrivalStation: {
        type: ObjectId,
        ref: 'RouteStation'
    },
    passengerType: {
        type: ObjectId,
        ref: 'TravelerCategory'
    }
});

const Ticket = mongoose.model("Ticket", ticketSchema);

module.exports = Ticket;