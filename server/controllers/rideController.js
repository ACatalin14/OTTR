const CONSTANTS = require('../constants');
const Route = require("../models/route");

module.exports = {

    index: async (req, res) => {

        const rides = await module.exports.getAllRidesWithRoutes();

        return res.status(200).json(rides);
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
    }
};
