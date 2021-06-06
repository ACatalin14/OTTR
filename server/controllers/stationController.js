const CONSTANTS = require('../constants');
const Station = require("../models/station");

module.exports = {
    index: async (req, res) => {
        await Station.find({}, (err, stations) => {
            if (err) {
                return res.status(500).json({err: CONSTANTS.ERRORS.OTHER});
            }
            res.status(200).json(stations);
        });
    },

    show: async (req, res) => {
        await Station.findById(req.params.id, (err, station) => {
            if (err) {
                return res.status(500).json({err: CONSTANTS.ERRORS.OTHER});
            }
            res.status(200).json(station);
        });
    },

    getByCode: async (req, res) => {
        await Station.findOne({ code: req.params.code }, (err, station) => {
            if (err) {
                return res.status(500).json({err: CONSTANTS.ERRORS.OTHER});
            }
            res.status(200).json(station);
        });
    },

    getByName: async (req, res) => {
        await Station.findOne({ name: req.params.name }, (err, station) => {
            if (err) {
                return res.status(500).json({err: CONSTANTS.ERRORS.OTHER});
            }
            res.status(200).json(station);
        });
    },

    create: async (req, res) => {
        const station = {
            code: req.body.code,
            name: req.body.name
        };

        await Station.create(station, (err, createdStation) => {
            if (err) {
                return res.status(500).json({err: CONSTANTS.ERRORS.DB_OBJECT_CREATE_FAILED});
            }
            return res.status(201).json(createdStation);
        });
    },

    update: async (req, res) => {
        const newStationFields = {
            code: req.body.code,
            name: req.body.name
        };

        await Station.updateOne(
            { _id: req.params.id },
            newStationFields,
            (err) => {
                if (err) {
                    res.status(500).json({ err: CONSTANTS.ERRORS.DB_OBJECT_UPDATE_FAILED });
                }
            }
        );

        await Station.findById(req.params.id, (err, updatedStation) => {
            if (err) {
                return res.status(500).json({err: CONSTANTS.ERRORS.OTHER});
            }
            return res.status(200).json(updatedStation);
        });

    },

    delete: async (req, res) => {

        await Station.findByIdAndRemove(req.params.id,
            (err, deletedStation) => {
                if (err) {
                    return res.status(500).json({ err: CONSTANTS.ERRORS.DB_OBJECT_DELETE_FAILED });
                }
                return res.status(200).json(deletedStation);
            });
    }
};
