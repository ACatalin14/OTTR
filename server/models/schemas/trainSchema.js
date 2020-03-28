const mongoose = require('mongoose');

const ObjectId = mongoose.Schema.Types.ObjectId;

const trainSchema = mongoose.Schema({
    number: {
        type: Number,
        required: true
    },
    trainCategory: {
        type: ObjectId,
        ref: 'TrainCategory'
    }
});

module.exports = trainSchema;