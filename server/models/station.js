const mongoose = require('mongoose');

const ObjectId = mongoose.Schema.Types.ObjectId;

const stationSchema = mongoose.Schema({
    code: {
        type: String,
        required: [true, "Please include the code"],
        unique: true
    },
    name: {
        type: String,
        required: [true, "Please include the name"],
        unique: true
    },

    routes: [{
        type: ObjectId,
        ref: 'RouteStation'
    }]
});

const Station = mongoose.model("Station", stationSchema);

module.exports = Station;