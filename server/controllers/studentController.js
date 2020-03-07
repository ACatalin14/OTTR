const CONSTANTS = require('../constants');
const Student = require("../models/student");

module.exports = {
    index: async (req, res) => {
        await Student.find({}, (err, students) => {
            if (err) {
                return res.status(500).json({err: CONSTANTS.ERRORS.OTHER});
            }
            res.status(200).json(students);
        });
    },

    show: async (req, res) => {
        await Student.findById(req.params.id, (err, student) => {
            if (err) {
                return res.status(500).json({err: CONSTANTS.ERRORS.OTHER});
            }
            res.status(200).json(student);
        });
    },

    create: async (req, res) => {

        const student = {
            // cardId generated at pre-save
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            nin: req.body.nin,
            // creationDate generated at pre-save
            expirationDate: req.body.expirationDate // string which is to be sanitized
        };
        student.expirationDate = Date.parse(student.expirationDate);
        student.creationDate = Date.now();

        // set cardId accordingly
        Student
            .find({})
            .select('cardId')
            .sort({'cardId': -1})
            .limit(1)
            .exec( (err, doc) => {
                if (err) {
                    return res.status(500).json({err: CONSTANTS.ERRORS.DB_OBJECT_CREATE_FAILED});
                }
                if (doc.length > 0) {
                    student.cardId = doc[0].cardId + 1;
                } else {
                    student.cardId = 10000;
                }

                Student.create(student, (err, createdStudent) => {
                    if (err) {
                        return res.status(500).json({err: CONSTANTS.ERRORS.DB_OBJECT_CREATE_FAILED});
                    }
                    return res.status(201).json(createdStudent);
                });
            });
    },

    update: async (req, res) => {
        const newStudentFields = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            nin: req.body.nin,
            expirationDate: req.body.expirationDate
        };

        newStudentFields.expirationDate = Date.parse(newStudentFields.expirationDate);

        // Sanitize request
        for (let field of Object.keys(newStudentFields)) {
            if (!newStudentFields[field]) {
                delete newStudentFields[field];
            }
        }

        // Update
        await Student.updateOne(
            { _id: req.params.id },
            newStudentFields,
            (err) => {
                if (err) {
                    res.status(500).json({ err: CONSTANTS.ERRORS.DB_OBJECT_UPDATE_FAILED });
                }
            }
        );

        await Student.findById(req.params.id, (err, updatedStudent) => {
            if (err) {
                return res.status(500).json({err: CONSTANTS.ERRORS.OTHER});
            }
            return res.status(200).json(updatedStudent);
        });

    },

    delete: async (req, res) => {

        await Student.findByIdAndRemove(req.params.id,
            (err, deletedStudent) => {
                if (err) {
                    return res.status(500).json({ err: CONSTANTS.ERRORS.DB_OBJECT_DELETE_FAILED });
                }
                return res.status(200).json(deletedStudent);
            });
    }
};