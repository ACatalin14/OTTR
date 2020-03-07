const mongoose = require('mongoose');

const studentSchema = mongoose.Schema({
    cardId: {
        type: Number,
        required: [true, "Please Include your national identification number (NIN)"],
        default: 10000,
        unique: true
    },
    firstName: {
        type: String,
        required: [true, "Please Include your first name"]
    },
    lastName: {
        type: String,
        required: [true, "Please Include your last name"]
    },
    nin: {
        type: String,
        required: [true, "Please Include your national identification number (NIN)"],
        unique: true
    },
    creationDate: {
        type: Date,
        required: true
    },
    expirationDate: {
        type: Date,
        required: true
    }
});

const Student = mongoose.model("Student", studentSchema);

module.exports = Student;