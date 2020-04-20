const CONSTANTS = require('../constants');
const Route = require("../models/route");
const routeStationController = require("./routeStationController");
const routeCarTemplateController = require("./routeCarTemplateController");
const routeRideController = require("./routeRideController");
const dateFormat = require('dateformat');

module.exports = {
    index: async (req, res) => {
        await Route.find({deleted: {$ne: true}})
            .populate('train.trainCategory')
            .populate({
                path: 'routeStations carTemplates.departureStation carTemplates.arrivalStation carTemplates.travelClass carTemplates.carLayout',
                populate: {
                    path: 'station'
                }
            })
            .populate({
                path: 'rides.cars',
                populate: {
                    path: 'departureStation arrivalStation travelClass carLayout',
                    populate: {
                        path: 'station'
                    }
                }
            })
            .exec( async (err, route) => {
                if (err) {
                    return res.status(500).json({err: CONSTANTS.ERRORS.OTHER});
                }

                res.status(200).json(route);
            })
    },

    indexAll: async (req, res) => {
        await Route.find({})
            .populate('train.trainCategory')
            .populate({
                path: 'routeStations carTemplates.departureStation carTemplates.arrivalStation carTemplates.travelClass carTemplates.carLayout',
                populate: {
                    path: 'station'
                }
            })
            .populate({
                path: 'rides.cars',
                populate: {
                    path: 'departureStation arrivalStation travelClass carLayout',
                    populate: {
                        path: 'station'
                    }
                }
            })
            .exec( async (err, route) => {
                if (err) {
                    return res.status(500).json({err: CONSTANTS.ERRORS.OTHER});
                }

                res.status(200).json(route);
            })
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
     * Request example:
     *     params: name = "BR(10:03)-BUCN(15:30)"
     *     {}
     *
     * @param req
     * @param res
     * @returns {Promise<void>}
     */
    getByName: async (req, res) => {

        const route = await module.exports.getRouteByName(req.params.name);

        if (route) {
            return res.status(200).json(route);
        }

        return res.status(400).json({err: CONSTANTS.ERRORS.ROUTE_NOT_FOUND});
    },

    getRouteByName: async (name) => {

        const routes = await Route.find({deleted: {$ne: true}})
            .populate('train.trainCategory')
            .populate({
                path: 'routeStations carTemplates.departureStation carTemplates.arrivalStation carTemplates.travelClass carTemplates.carLayout',
                populate: {
                    path: 'station'
                }
            })
            .populate({
                path: 'rides.cars',
                populate: {
                    path: 'departureStation arrivalStation travelClass carLayout',
                    populate: {
                        path: 'station'
                    }
                }
            })
            .exec();

        const nameTokens = name.split(/[\(\)\-]/);
        const sourceCode = nameTokens[0];
        const departureTime = nameTokens[1];
        const destinationCode = nameTokens[3];
        const arrivalTime = nameTokens[4];

        for (let route of routes) {
            const stationsCount = route.routeStations.length;
            const departureDateTime = new Date(route.departureTime);
            const arrivalDateTime = new Date(route.arrivalTime);

            if (route.routeStations[0].station.code === sourceCode &&
                route.routeStations[stationsCount - 1].station.code === destinationCode &&
                dateFormat(departureDateTime, 'HH:MM') === departureTime &&
                dateFormat(arrivalDateTime, 'HH:MM') === arrivalTime
            ) {
                return JSON.parse(JSON.stringify(route));
            }
        }

        return null;
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
                    "stationId": "5e52a3c39b5c7969448f114a",
                    "isSource": true,
                    "isDestination": false
                },
                {
                    "orderNo": 2,
                    "distance": 120,
                    "departureTime": 1585394277700,
                    "arrivalTime": 1585394277500,
                    "stationId": "5e52a5cc9b5c7969448f114e",
                    "isSource": false,
                    "isDestination": false
                },
                {
                    "orderNo": 3,
                    "distance": 220,
                    "departureTime": 0,
                    "arrivalTime": 1585400641466,
                    "stationId": "5e58275a5cb3cf671ced6265",
                    "isSource": false,
                    "isDestination": true
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

    /**
     * Example of request: same as create, but with _id and mongoId added
     *
     * {
     *     "_id": "5e9b4d5e8d94c64bd0390115"
     *     ...
     *     "routeStations": [
     *         {
     *             "mongoId": "5e9b4d5e8d94c64bd0390115",
     *             ...
     *         }
     *         ...
     *     ],
     *     "carTemplates": [
     *         {
     *             "mongoId": "5e9b4d5e8d94c64bd0390115",
     *             ...
     *         }
     *         ...
     *     ],
     * }
     *
     * @param req
     * @param res
     * @returns {Promise<void>}
     */
    update: async (req, res) => {
        if (!req.body._id || req.body.departureTime === undefined || req.body.arrivalTime === undefined ||
            !req.body.activeWeekDays || !req.body.train || !req.body.carTemplates || !req.body.routeStations
        ) {
            return res.status(400).json({err: CONSTANTS.ERRORS.BAD_REQUEST_ROUTE_UPDATE});
        }

        let route = {
            _id: req.body._id,
            departureTime: req.body.departureTime,
            arrivalTime: req.body.arrivalTime,
            activeWeekDays: req.body.activeWeekDays,
            train: {
                number: req.body.train.number,
                trainCategory: req.body.train.trainCategoryId
            }
        };

        await Route
            .updateOne({_id: route._id}, route)
            .catch( (err) => {
                console.error(err);
                return res.status(500).json({err: CONSTANTS.ERRORS.DB_OBJECT_UPDATE_FAILED});
            });

        try {
            route = await routeStationController.updateManyForRoute(req, res, route, req.body.routeStations);
            route = await routeCarTemplateController.updateManyForRoute(req, res, route, req.body.carTemplates);

            if (req.body.noOfGeneratedRides || req.body.generateRidesFrom || req.body.generateRidesUntil) {

                route = await routeRideController.createManyForRoute(req, res, route);
            }

        } catch (e) {
            // response is already set inside called methods
            return;
        }

        return res.status(200).json(route);
    },

    delete: async (req, res) => {

        // add the "deleted" flag
        await Route.findByIdAndUpdate(req.params.id, {deleted: true}, {},
            (err, deletedStation) => {
                if (err) {
                    return res.status(500).json({ err: CONSTANTS.ERRORS.DB_OBJECT_DELETE_FAILED });
                }
                return res.status(200).json(deletedStation);
            });
    }
};