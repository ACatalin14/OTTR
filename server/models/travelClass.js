const mongoose = require('mongoose');

const travelClassSchema = mongoose.Schema({
    code: {
        type: String,
        required: [true, "Please include the code"],
        unique: true
    },
    name: {
        type: String,
        required: [true, "Please include the name"]
    }
});

const TravelClass = mongoose.model("TravelClass", travelClassSchema, 'travelClasses');

module.exports = TravelClass;