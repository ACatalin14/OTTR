const mongoose = require('mongoose');

const ObjectId = mongoose.Schema.Types.ObjectId;

const routeStationSchema = mongoose.Schema({
    orderNo: {
        type: Number,
        required: true
    },
    distance: {
        type: Number,
        required: true
    },
    departureTime: {
        type: Date,
        required: true
    },
    arrivalTime: {
        type: Date,
        required: true
    },
    halt: {
        type: Number,
        required: false
    },

    route: {
        type: ObjectId,
        ref: 'Route',
        required: false
    },

    station: {
        type: ObjectId,
        ref: 'Station'
    },
});

const RouteStation = mongoose.model('RouteStation', routeStationSchema);

module.exports = RouteStation;
