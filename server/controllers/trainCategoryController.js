const CONSTANTS = require('../constants');
const TrainCategory = require("../models/trainCategory");

module.exports = {
    index: async (req, res) => {
        await TrainCategory.find({}, (err, trainCategories) => {
            if (err) {
                return res.status(500).json({err: CONSTANTS.ERRORS.OTHER});
            }
            res.status(200).json(trainCategories);
        });
    },

    show: async (req, res) => {
        await TrainCategory.findById(req.params.id, (err, trainCategory) => {
            if (err) {
                return res.status(500).json({err: CONSTANTS.ERRORS.OTHER});
            }
            res.status(200).json(trainCategory);
        });
    },

    create: async (req, res) => {
        const trainCategory = {
            code: req.body.code,
            name: req.body.name
        };

        await TrainCategory.create(trainCategory, (err, createdTrainCategory) => {
            if (err) {
                return res.status(500).json({err: CONSTANTS.ERRORS.DB_OBJECT_CREATE_FAILED});
            }
            return res.status(201).json(createdTrainCategory);
        });
    },

    update: async (req, res) => {
        const newTrainCategoryFields = {
            code: req.body.code,
            name: req.body.name
        };

        await TrainCategory.updateOne(
            { _id: req.params.id },
            newTrainCategoryFields,
            (err) => {
                if (err) {
                    res.status(500).json({ err: CONSTANTS.ERRORS.DB_OBJECT_UPDATE_FAILED });
                }
            }
        );

        await TrainCategory.findById(req.params.id, (err, updatedTrainCategory) => {
            if (err) {
                return res.status(500).json({err: CONSTANTS.ERRORS.OTHER});
            }
            return res.status(200).json(updatedTrainCategory);
        });

    },

    delete: async (req, res) => {

        await TrainCategory.findByIdAndRemove(req.params.id,
            (err, deletedTrainCategory) => {
                if (err) {
                    return res.status(500).json({ err: CONSTANTS.ERRORS.DB_OBJECT_DELETE_FAILED });
                }
                return res.status(200).json(deletedTrainCategory);
            });
    }
};
