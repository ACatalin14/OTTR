const mongoose = require('mongoose');

const ObjectId = mongoose.Schema.Types.ObjectId;

const orderSchema = mongoose.Schema({

    number: {
        type: Number,
        required: false
    },
    price: {
        type: Number,
        required: false
    },
    
    user: {
        type: ObjectId,
        ref: 'User'
    },
    tickets: [{
        type: ObjectId,
        ref: 'Ticket'
    }]
});

const Order = mongoose.model("Ticket", orderSchema);

module.exports = Order;