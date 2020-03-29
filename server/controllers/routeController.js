const CONSTANTS = require('../constants');
const Route = require("../models/route");
const routeStationController = require("./routeStationController");
const routeCarTemplateController = require("./routeCarTemplateController");
const routeRideController = require("./routeRideController");

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

    /**
     * Example of request to create a route:
         {
            "departureTime": 1585394277138,
            "arrivalTime": 1585400641466,
            "activeWeekDays": ["Mon", "Tue", "Wed", "Thu", "Fri"],
            "noOfGeneratedRides": 5,
            "train": {
                "number": 12015,
                "trainCategoryId": "5e628ab922c0da319858ba07"
            },
            "carTemplates": [
                {
                    "orderNo": 1,
                    "number": "1",
                    "departureStationId": "5e52a3c39b5c7969448f114a",
                    "arrivalStationId": "5e58275a5cb3cf671ced6265",
                    "travelClassId": "5e629540fddb7e2d702b4de2",
                    "carLayoutId": "5e73c1ea6c0ba91268fedb8d"
                }
            ],
            "routeStations": [
                {
                    "orderNo": 1,
                    "distance": 0,
                    "departureTime": 1585394277138,
                    "arrivalTime": 0,
                    "stationId": "5e52a3c39b5c7969448f114a"
                },
                {
                    "orderNo": 2,
                    "distance": 120,
                    "departureTime": 1585394277700,
                    "arrivalTime": 1585394277500,
                    "stationId": "5e52a5cc9b5c7969448f114e"
                },
                {
                    "orderNo": 3,
                    "distance": 220,
                    "departureTime": 0,
                    "arrivalTime": 1585400641466,
                    "stationId": "5e58275a5cb3cf671ced6265"
                }
            ]
         }
     *
     * @param req
     * @param res
     * @returns {Promise<void>}
     */
    create: async (req, res) => {

        if (req.body.departureTime === undefined || req.body.arrivalTime === undefined || !req.body.activeWeekDays ||
            !req.body.train || !req.body.carTemplates || !req.body.routeStations
        ) {
            return res.status(400).json({err: CONSTANTS.ERRORS.BAD_REQUEST_ROUTE_CREATION});
        }

        let route = {
            departureTime: req.body.departureTime,
            arrivalTime: req.body.arrivalTime,
            activeWeekDays: req.body.activeWeekDays,
            train: {
                number: req.body.train.number,
                trainCategory: req.body.train.trainCategoryId
            }
        };

        await Route
            .create(route)
            .then( (createdRoute) => {
                route = createdRoute;
            })
            .catch( () => {
                return res.status(500).json({err: CONSTANTS.ERRORS.DB_OBJECT_CREATE_FAILED});
            });

        try {
            route = await routeStationController.createManyForRoute(req, res, route, req.body.routeStations);
            route = await routeCarTemplateController.createManyForRoute(req, res, route, req.body.carTemplates);

            if (req.body.noOfGeneratedRides || req.body.generateRidesFrom || req.body.generateRidesUntil) {

                route = await routeRideController.createManyForRoute(req, res, route);
            }

        } catch (e) {
            // response is already set inside called methods
            return;
        }

        return res.status(200).json(route);
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