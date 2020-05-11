const CONSTANTS = require('../constants');
const Route = require("../models/route");

module.exports = {

    index: async (req, res) => {

        const rides = await module.exports.getAllRidesWithRoutes();

        return res.status(200).json(rides);
    },

    /**
     * Request Example:
     *  params: /source/:sourceId/destination/:destinationId
     *  {
     *      date: 103330421,
     *      viaStationId: "5e1521rh1e122",
     *      travelClassId: "5e1242r1e212"
     *  }
     * @param req
     * @param res
     * @returns {Promise<*>}
     */
    getFilteredRides: async (req, res) => {

        const sourceId = req.params.sourceId;
        const destinationId = req.params.destinationId;
        const date = parseInt(req.params.date);
        const viaStationId = req.params.viaStationId ? req.params.viaStationId : null;
        const travelClassId = req.params.travelClassId ? req.params.travelClassId : null;

        if (!sourceId || !destinationId || !date) {
            return res.status(400).json({err: CONSTANTS.ERRORS.MISSING_IMPORTANT_ARGUMENTS});
        }

        if (sourceId === destinationId) {
            return res.status(400).json({err: CONSTANTS.ERRORS.DEPARTURE_IS_DESTINATION});
        }

        const rides = await module.exports.getAllRidesWithRoutes();

        const filteredRides = rides.filter( (ride) => {

            const departureRouteStation = ride.routeStations.find(routeStation => {
                return routeStation.station._id === sourceId;
            });

            const destinationRouteStation = ride.routeStations.find(routeStation => {
                return routeStation.station._id === destinationId;
            });

            if (!departureRouteStation || !destinationRouteStation) {
                return false;
            }

            const depStationIndex = departureRouteStation.orderNo - 1;
            const arrStationIndex = destinationRouteStation.orderNo - 1;

            if (depStationIndex === ride.routeStations.length - 1 || arrStationIndex === 0) {
                return false;
            }

            const departureDate = new Date(ride.departureDates[depStationIndex]);
            const requestedDate = new Date(date);
            requestedDate.setHours(requestedDate.getUTCHours(), requestedDate.getUTCMinutes());

            let nextDayAfterRequestedDate = new Date(date);
            nextDayAfterRequestedDate.setUTCDate(nextDayAfterRequestedDate.getUTCDate() + 1);
            nextDayAfterRequestedDate.setHours(0, 0, 0, 0);

            let respectsDate = departureDate >= requestedDate && departureDate < nextDayAfterRequestedDate;

            return respectsDate &&
                module.exports.checkRideHasWellFilteredCars(ride, sourceId, destinationId, viaStationId, travelClassId);
        });

        return res.status(200).json(filteredRides);
    },

    /**
     * Request Example:
     * params:
     *      sourceId: 5eef32f23fwef
     *      destinationId: 5e3efqfqfqqg
     *      date: 18357392579238
     *      departureTime: 18357392579238     (e.g. 1 jan 1970 07:30)
     *      arrivalTime: 183573925778522      (e.g. 1 jan 1970 09:34)
     * @param req
     * @param res
     * @returns {Promise<*>}
     */
    getRideByDetails: async (req, res) => {

        const sourceId = req.params.sourceId;
        const destinationId = req.params.destinationId;
        const date = parseInt(req.params.date);
        const departureTime = parseInt(req.params.departureTime);
        const arrivalTime = parseInt(req.params.arrivalTime);

        if (!sourceId || !destinationId || !date || !departureTime || !arrivalTime) {
            return res.status(400).json({err: CONSTANTS.ERRORS.MISSING_IMPORTANT_ARGUMENTS});
        }

        if (sourceId === destinationId) {
            return res.status(400).json({err: CONSTANTS.ERRORS.DEPARTURE_IS_DESTINATION});
        }

        const rides = await module.exports.getAllRidesWithRoutes();

        const searchedRide = rides.find( (ride) => {

            const departureRouteStation = ride.routeStations.find(routeStation => {
                return routeStation.station._id === sourceId;
            });

            const destinationRouteStation = ride.routeStations.find(routeStation => {
                return routeStation.station._id === destinationId;
            });

            if (!departureRouteStation || !destinationRouteStation) {
                return false;
            }

            const depStationIndex = departureRouteStation.orderNo - 1;
            const arrStationIndex = destinationRouteStation.orderNo - 1;

            if (depStationIndex === ride.routeStations.length - 1 || arrStationIndex === 0) {
                return false;
            }

            const departureDateTime = new Date(ride.departureDates[depStationIndex]);
            const arrivalDateTime = new Date(ride.arrivalDates[arrStationIndex]);
            const requestedDepartureDateTime = new Date(date);
            requestedDepartureDateTime.setHours(
                new Date(departureTime).getHours(),
                new Date(departureTime).getMinutes()
            );
            const requestedArrivalTime = new Date(arrivalTime);

            return departureDateTime.getTime() === requestedDepartureDateTime.getTime()
                && arrivalDateTime.getHours() === requestedArrivalTime.getHours()
                && arrivalDateTime.getMinutes() === requestedArrivalTime.getMinutes();
        });

        if (!searchedRide) {
            return res.status(404).json({err: CONSTANTS.ERRORS.RIDE_WITH_DETAILS_NOT_FOUND});
        }

        return res.status(200).json(searchedRide);
    },

    getAllRidesWithRoutes: async () => {

        const routes = await module.exports.getAllRoutesWithRides();

        let rides = [];

        for (let route of routes) {
            let routeDetails = JSON.parse(JSON.stringify(route));
            delete routeDetails.rides;

            const routeRides = JSON.parse(JSON.stringify(route.rides));

            for (let ride of routeRides) {
                ride.route = JSON.parse(JSON.stringify(routeDetails));
                rides.push(JSON.parse(JSON.stringify(ride)));
            }
        }

        return rides;
    },

    getAllRoutesWithRides: async () => {

        return await Route.find({
                deleted: {$ne: true},
                rides: {$ne: []}
            }
        )
            .populate('train.trainCategory')
            .populate({
                path: 'routeStations rides.routeStations carTemplates.departureStation carTemplates.arrivalStation carTemplates.travelClass carTemplates.carLayout',
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
    },

    checkRideHasWellFilteredCars(ride, sourceId, destinationId, viaStationId, travelClassId) {

        const stationIds = ride.routeStations.map( routeStation => {
            return routeStation.station._id;
        });

        return ride.cars.some( car => {

            if (travelClassId && car.travelClass._id !== travelClassId) {
                return false;
            }

            return module.exports.checkSourceViaDestinationInOrderInArray(sourceId, destinationId, stationIds, viaStationId);
        });
    },

    checkSourceViaDestinationInOrderInArray(sourceId, destinationId, stationIds, viaStationId) {

        if (!stationIds.includes(sourceId) || !stationIds.includes(destinationId)) {
            return false;
        }

        const indexSource = stationIds.indexOf(sourceId);
        const indexDestination = stationIds.indexOf(destinationId);
        const indexViaStation = viaStationId ? stationIds.indexOf(viaStationId) : -1;

        if (indexViaStation > -1) {
            // found Via Station
            return indexSource < indexDestination
                && indexSource <= indexViaStation
                && indexViaStation <= indexDestination;
        }

        if (viaStationId) {
            // did not find given Via Station
            return false;
        }

        // only Source and Destination were given
        return indexSource < indexDestination;
    }
};
