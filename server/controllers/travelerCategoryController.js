const CONSTANTS = require('../constants');
const TravelerCategory = require("../models/travelerCategory");

module.exports = {
    index: async (req, res) => {
        await TravelerCategory.find({}, (err, travelerCategories) => {
            if (err) {
                return res.status(500).json({err: CONSTANTS.ERRORS.OTHER});
            }
            res.status(200).json(travelerCategories);
        });
    },

    show: async (req, res) => {
        await TravelerCategory.findById(req.params.id, (err, travelerCategory) => {
            if (err) {
                return res.status(500).json({err: CONSTANTS.ERRORS.OTHER});
            }
            res.status(200).json(travelerCategory);
        });
    },

    create: async (req, res) => {
        const travelerCategory = {
            name: req.body.name,
            discount: req.body.discount
        };

        await TravelerCategory.create(travelerCategory, (err, createdTravelerCategory) => {
            if (err) {
                return res.status(500).json({err: CONSTANTS.ERRORS.DB_OBJECT_CREATE_FAILED});
            }
            return res.status(201).json(createdTravelerCategory);
        });
    },

    update: async (req, res) => {
        const newTravelerCategoryFields = {
            name: req.body.name,
            discount: req.body.discount
        };

        await TravelerCategory.updateOne(
            { _id: req.params.id },
            newTravelerCategoryFields,
            (err) => {
                if (err) {
                    res.status(500).json({ err: CONSTANTS.ERRORS.DB_OBJECT_UPDATE_FAILED });
                }
            }
        );

        await TravelerCategory.findById(req.params.id, (err, updatedTravelerCategory) => {
            if (err) {
                return res.status(500).json({err: CONSTANTS.ERRORS.OTHER});
            }
            return res.status(200).json(updatedTravelerCategory);
        });

    },

    delete: async (req, res) => {

        await TravelerCategory.findByIdAndRemove(req.params.id,
            (err, deletedTravelerCategory) => {
                if (err) {
                    return res.status(500).json({ err: CONSTANTS.ERRORS.DB_OBJECT_DELETE_FAILED });
                }
                return res.status(200).json(deletedTravelerCategory);
            });
    }
};
