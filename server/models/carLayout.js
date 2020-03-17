const mongoose = require('mongoose');

const carLayoutSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    seatingCapacity: {
        type: Number,
        required: false
    },
    width: {
        type: Number,
        required: true
    },
    height: {
        type: Number,
        required: true
    },
    cellSize: {
        type: Number,
        required: true
    },
    lastElementId: {
        type: Number,
        required: true
    },
    elements: [
        new mongoose.Schema({
            i: {
                type: Number,
                required: true
            },
            x: {
                type: Number,
                required: true
            },
            y: {
                type: Number,
                required: true
            },
            w: {
                type: Number,
                required: true,
                default: 1
            },
            h: {
                type: Number,
                required: true,
                default: 1
            },
            type: {
                type: Number,
                required: true,
            },
            seatNumber: {
                type: Number,
                required: false
            }
        })
    ]
});

const CarLayout = mongoose.model("CarLayout", carLayoutSchema, 'carLayouts');

module.exports = CarLayout;