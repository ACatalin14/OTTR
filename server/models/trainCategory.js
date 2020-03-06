const mongoose = require('mongoose');

const trainCategorySchema = mongoose.Schema({
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

const TrainCategory = mongoose.model("TrainCategory", trainCategorySchema, 'trainCategories');

module.exports = TrainCategory;