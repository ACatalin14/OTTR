const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Types = Schema.Types;

const TrainSchema = new Schema({
    number: Types.Number,
    rank: Types.String
});

module.exports = mongoose.model("Train", TrainSchema, "trains");