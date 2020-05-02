const CONSTANTS = require('../constants');
const TravelClass = require("../models/travelClass");

module.exports = {
    index: async (req, res) => {
        await TravelClass.find({}, (err, travelClasses) => {
            if (err) {
                return res.status(500).json({err: CONSTANTS.ERRORS.OTHER});
            }
            res.status(200).json(travelClasses);
        });
    },

    show: async (req, res) => {
        await TravelClass.findById(req.params.id, (err, travelClass) => {
            if (err) {
                return res.status(500).json({err: CONSTANTS.ERRORS.OTHER});
            }
            res.status(200).json(travelClass);
        });
    },

    getByCode: async (req, res) => {
        await TravelClass.findOne({ code: req.params.code }, (err, travelClass) => {
            if (err) {
                return res.status(500).json({err: CONSTANTS.ERRORS.OTHER});
            }
            res.status(200).json(travelClass);
        });
    },

    create: async (req, res) => {
        const travelClass = {
            code: req.body.code,
            name: req.body.name
        };

        await TravelClass.create(travelClass, (err, createdTravelClass) => {
            if (err) {
                return res.status(500).json({err: CONSTANTS.ERRORS.DB_OBJECT_CREATE_FAILED});
            }
            return res.status(201).json(createdTravelClass);
        });
    },

    update: async (req, res) => {
        const newTravelClassFields = {
            code: req.body.code,
            name: req.body.name
        };

        await TravelClass.updateOne(
            { _id: req.params.id },
            newTravelClassFields,
            (err) => {
                if (err) {
                    res.status(500).json({ err: CONSTANTS.ERRORS.DB_OBJECT_UPDATE_FAILED });
                }
            }
        );

        await TravelClass.findById(req.params.id, (err, updatedTravelClass) => {
            if (err) {
                return res.status(500).json({err: CONSTANTS.ERRORS.OTHER});
            }
            return res.status(200).json(updatedTravelClass);
        });

    },

    delete: async (req, res) => {

        await TravelClass.findByIdAndRemove(req.params.id,
            (err, deletedTravelClass) => {
                if (err) {
                    return res.status(500).json({ err: CONSTANTS.ERRORS.DB_OBJECT_DELETE_FAILED });
                }
                return res.status(200).json(deletedTravelClass);
            });
    }
};
