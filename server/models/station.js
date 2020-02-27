const mongoose = require('mongoose');

const stationSchema = mongoose.Schema({
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

const Station = mongoose.model("Station", stationSchema);

module.exports = Station;