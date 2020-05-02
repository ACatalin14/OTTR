const mongoose = require('mongoose');

const ObjectId = mongoose.Schema.Types.ObjectId;

const rideSchema = mongoose.Schema({
    departureDates: [{
        type: Date,
        required: true
    }],
    arrivalDates: [{
        type: Date,
        required: true
    }],
    hasAlteredCars: {
        // true if cars were added / updated / deleted from the ride
        // compared to the template cars which were by default
        type: Boolean,
        default: false
    },

    cars: [{
        type: ObjectId,
        ref: 'Car'
    }],
    routeStations: [{
        type: ObjectId,
        ref: 'RouteStation'
    }]

});

module.exports = rideSchema;