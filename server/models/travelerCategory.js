const mongoose = require('mongoose');

const travelerCategorySchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please include the name"],
        unique: true
    },
    discount: {
        type: Number,
        required: [true, "Please include the discount"],
    }
});

const TravelerCategory = mongoose.model("TravelerCategory", travelerCategorySchema, 'travelerCategory');

module.exports = TravelerCategory;