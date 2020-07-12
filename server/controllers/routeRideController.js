const CONSTANTS = require('../constants');
const Route = require("../models/route");
const rideCarController = require("./rideCarController");
const dateFormat = require('dateformat');

module.exports = {
    getRidesForRoute: async (req, res) => {

        const route = await module.exports.getRouteByName(req.params.name);

        if (route) {
            return res.status(200).json(route.rides);
        }

        return res.status(400).json({err: CONSTANTS.ERRORS.ROUTE_NOT_FOUND});
    },

    getRouteByName: async (name) => {

        const routes = await Route.find({deleted: {$ne: true}})
            .populate('train.trainCategory')
            .populate({
                path: 'routeStations rides.routeStations carTemplates.departureStation carTemplates.arrivalStation' +
                    ' carTemplates.travelClass carTemplates.carLayout',
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
                dateFormat(departureDateTime, 'UTC:HH:MM') === departureTime &&
                dateFormat(arrivalDateTime, 'UTC:HH:MM') === arrivalTime
            ) {
                return JSON.parse(JSON.stringify(route));
            }
        }

        return null;
    },

    createManyForRoute: async (req, res, route) => {

        let oldCount = 0;

        if (!route.rides || route.rides.length === 0) {
            route.rides = [];
        } else {
            oldCount = route.rides.length;
        }

        let rideDates = req.body.rideDates;

        let rideStations = [];
        route.routeStations.forEach(routeStation => {
            rideStations.push(routeStation);
        });

        for (let rideDate of rideDates) {
            route.rides.push({
                departureDates: rideDate.departureDates,
                arrivalDates: rideDate.arrivalDates,
                routeStations: rideStations,
                cars: []
            });
        }

        let updatedRoute = await Route.findByIdAndUpdate(route._id, route, {new: true});
        updatedRoute = updatedRoute['_doc'];

        for (let i = oldCount; i < updatedRoute.rides.length; i++) {

            const cars = await rideCarController.createCarsForRideWithTemplate(req, res, updatedRoute.rides[i], route.carTemplates);
            cars.forEach( car => {
                updatedRoute.rides[i].cars.push(car._id);
            });
        }

        updatedRoute = await Route.findByIdAndUpdate(updatedRoute._id, updatedRoute, {new: true});
        updatedRoute = updatedRoute['_doc'];

        return JSON.parse(JSON.stringify(updatedRoute));
    },

    /**
     * Request example:
     * params: routeId = "5e9ruoigwhie"
     * {
     *      rideDates: [
     *          {
     *              departureDates: [
     *                  "2000-01-01T07:44:00.000Z",
     *                  "2000-01-01T07:44:00.000Z",
     *                  "2000-01-01T07:44:00.000Z"
     *              ],
     *              arrivalDates: [
     *                  "2000-01-01T07:44:00.000Z",
     *                  "2000-01-01T07:44:00.000Z",
     *                  "2000-01-01T07:44:00.000Z"
     *              ]
     *          },
     *          ...
     *      ]
     * }
     *
     * @param req
     * @param res
     * @returns {Promise<*>}
     */
    createRides: async (req, res) => {

        if (!req.params.id || req.body.rideDates === undefined) {
            return res.status(400).json({err: CONSTANTS.ERRORS.BAD_REQUEST_ROUTE_UPDATE});
        }

        const route = await Route.findById(req.params.id)
            .populate({ path: 'routeStations' });

        req.body.activeWeekDays = route.activeWeekDays;

        const updatedRoute = await module.exports.createManyForRoute(req, res, route);

        return res.status(200).json(updatedRoute)
    },

    deleteRide: async (req, res) => {

        const route = await module.exports.getRouteByName(req.params.name);

        if (!route) {
            return res.status(400).json({err: CONSTANTS.ERRORS.ROUTE_NOT_FOUND});
        }

        // delete the ride from array
        const updatedRoute = await Route.findByIdAndUpdate(route._id, {
            $pull: {
                rides: {
                    _id: req.params.id
                }
            }
        }, {new: true});

        return res.status(200).json(updatedRoute);
    }
};