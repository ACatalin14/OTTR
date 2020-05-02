const mongoose = require('mongoose');
const seatSchema = require('./schemas/seatSchema');

const ObjectId = mongoose.Schema.Types.ObjectId;

const carSchema = mongoose.Schema({
    number: {
        type: String,
        required: true
    },
    orderNo: {
        type: Number,
        required: true
    },
    departureStation: {
        type: ObjectId,
        ref: 'RouteStation'
    },
    arrivalStation: {
        type: ObjectId,
        ref: 'RouteStation'
    },
    travelClass: {
        type: ObjectId,
        ref: 'TravelClass'
    },
    carLayout: {
        type: ObjectId,
        ref: 'CarLayout'
    },
    ride: {
        type: ObjectId,
        ref: 'Route.rides'
    },

    seats: [ seatSchema ]
});

const Car = mongoose.model('Car', carSchema);

module.exports = Car;