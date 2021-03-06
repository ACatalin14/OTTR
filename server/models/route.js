const mongoose = require('mongoose');
const carTemplateSchema = require('./schemas/carTemplateSchema');
const trainSchema = require('./schemas/trainSchema');
const rideSchema = require('./schemas/rideSchema');

const ObjectId = mongoose.Schema.Types.ObjectId;

const routeSchema = mongoose.Schema({
    departureTime: {
        type: Date,
        required: true
    },
    arrivalTime: {
        type: Date,
        required: true
    },
    activeWeekDays: {
        type: Array,
        required: true
    },
    deleted: {
        type: Boolean,
        required: false
    },

    train: trainSchema,

    carTemplates: [ carTemplateSchema ],

    rides: [ rideSchema ],

    routeStations: [{
        type: ObjectId,
        ref: 'RouteStation'
    }]

});

const Route = mongoose.model('Route', routeSchema);

module.exports = Route;