const mongoose = require('mongoose');

const ObjectId = mongoose.Schema.Types.ObjectId;

const carTemplateSchema = mongoose.Schema({
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
    }
});

module.exports = carTemplateSchema;