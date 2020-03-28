// TODO: edit this file
const CONSTANTS = require('../constants');
const Route = require("../models/route");

module.exports = {
    index: async (req, res) => {
        await Route.find({}, (err, route) => {
            if (err) {
                return res.status(500).json({err: CONSTANTS.ERRORS.OTHER});
            }
            res.status(200).json(route);
        });
    },

    show: async (req, res) => {
        await Route.findById(req.params.id, (err, route) => {
            if (err) {
                return res.status(500).json({err: CONSTANTS.ERRORS.OTHER});
            }
            res.status(200).json(route);
        });
    },

    create: async (req, res) => {
        const route = {
            departureTime: req.body.departureTime,
            arrivalTime: req.body.arrivalTime,
            activeWeekDays: req.body.activeWeekDays
        };

        if (req.body.train) {
            route.train = req.body.train;
        }

        if (req.body.carTemplates) {
            route.carTemplates = req.body.carTemplates;
        }

        if (req.body.rides) {
            route.rides = req.body.rides;
        }

        if (req.body.stations) {
            route.stations = req.body.stations;
        }

        await Route.create(route, (err, createdRoute) => {
            if (err) {
                return res.status(500).json({err: CONSTANTS.ERRORS.DB_OBJECT_CREATE_FAILED});
            }
            return res.status(201).json(createdRoute);
        });
    },

    update: async (req, res) => {
        const newStationFields = {
            code: req.body.code,
            name: req.body.name
        };

        await Route.updateOne(
            { _id: req.params.id },
            newStationFields,
            (err) => {
                if (err) {
                    res.status(500).json({ err: CONSTANTS.ERRORS.DB_OBJECT_UPDATE_FAILED });
                }
            }
        );

        await Route.findById(req.params.id, (err, updatedStation) => {
            if (err) {
                return res.status(500).json({err: CONSTANTS.ERRORS.OTHER});
            }
            return res.status(200).json(updatedStation);
        });

    },

    delete: async (req, res) => {

        await Route.findByIdAndRemove(req.params.id,
            (err, deletedStation) => {
                if (err) {
                    return res.status(500).json({ err: CONSTANTS.ERRORS.DB_OBJECT_DELETE_FAILED });
                }
                return res.status(200).json(deletedStation);
            });
    }
};