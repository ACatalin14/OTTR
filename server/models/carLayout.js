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
    elements: [
        new mongoose.Schema({
            type: {
                type: Number,
                required: true,
            },
            resizable: {
                type: Boolean,
                required: true
            },
            row: {
                type: Number,
                required: true
            },
            column: {
                type: Number,
                required: true
            },
            width: {
                type: Number,
                required: true,
                default: 1
            },
            height: {
                type: Number,
                required: true,
                default: 1
            }
        })
    ]
});

const CarLayout = mongoose.model("CarLayout", carLayoutSchema, 'carLayout');

module.exports = CarLayout;