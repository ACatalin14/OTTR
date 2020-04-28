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
        const date = req.body.date;
        const viaStationId = req.body.viaStationId ? req.body.viaStationId : null;
        const travelClassId = req.body.travelClassId ? req.body.travelClassId : null;

        if (!sourceId || !destinationId || !date) {
            return res.status(400).json({err: CONSTANTS.ERRORS.MISSING_IMPORTANT_ARGUMENTS});
        }

        const rides = await module.exports.getAllRidesWithRoutes();

        const filteredRides = rides.filter( (ride) => {

            const departureDate = new Date(ride.departureDate);
            const requestedDate = new Date(date);
            let nextDayAfterRequestedDate = new Date(date);
            nextDayAfterRequestedDate.setDate(nextDayAfterRequestedDate.getDate() + 1);
            nextDayAfterRequestedDate.setHours(0, 0, 0, 0);

            let respectsDate = departureDate >= requestedDate && departureDate < nextDayAfterRequestedDate;

            return respectsDate &&
                module.exports.checkRideHasWellFilteredCars(ride, sourceId, destinationId, viaStationId, travelClassId);
        });

        return res.status(200).json(filteredRides);
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
    },

    checkRideHasWellFilteredCars(ride, sourceId, destinationId, viaStationId, travelClassId) {

        const stationIds = ride.route.routeStations.map( routeStation => {
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
