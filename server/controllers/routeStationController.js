const CONSTANTS = require('../constants');
const RouteStation = require("../models/routeStation");
const Route = require("../models/route");
const Station = require("../models/station");

module.exports = {
    createManyForRoute: async (req, res, route, stations) => {

        let routeStations = [];
        let routeStationIds = [];
        let stationIds = [];

        for (let station of stations) {

            if (station.orderNo === undefined || station.departureTime === undefined || station.arrivalTime === undefined ||
                station.distance === undefined || !station.stationId
            ) {
                return res.status(400).json({err: CONSTANTS.ERRORS.BAD_REQUEST_ROUTE_CREATION});
            }

            routeStations.push({
                orderNo: station.orderNo,
                distance: station.distance,
                departureTime: station.departureTime,
                arrivalTime: station.arrivalTime,
                halt: station.isSource || station.isDestination ? 0 :
                    new Date(station.departureTime) - new Date(station.arrivalTime),
                route: route._id,
                station: station.stationId
            });

            stationIds.push(station.stationId);
        }

        try {
            const createdRouteStations = await RouteStation.create(routeStations);

            createdRouteStations.sort((a, b) => a.orderNo - b.orderNo);

            for (let routeStation of createdRouteStations) {
                routeStationIds.push(routeStation._id);
            }
        } catch (err) {
            console.error(err);
            res.status(400).json({err: CONSTANTS.ERRORS.ROUTE_STATION_CREATE_FAILED});
            throw err;
        }

        try {
            const updatedRoute = await Route.findByIdAndUpdate(route._id, {
                $push: {
                    routeStations: {
                        $each: routeStationIds
                    }
                }
            }, {new: true});

            route = JSON.parse(JSON.stringify(updatedRoute['_doc']));
        } catch (err) {
            console.error(err);
            res.status(500).json({ err: CONSTANTS.ERRORS.DB_OBJECT_UPDATE_FAILED });
            throw err;
        }

        for (let stationId of stationIds) {

            const i = stationIds.indexOf(stationId);

            try {
                await Station.findByIdAndUpdate(stationId, {
                    $push: {
                        routeStations: routeStationIds[i]
                    }
                });

            } catch (err) {
                res.status(500).json({ err: CONSTANTS.ERRORS.DB_OBJECT_UPDATE_FAILED });
                throw err;
            }
        }

        return route;
    },

    updateManyForRoute: async (req, res, route, stations) => {

        await RouteStation.deleteMany({
            route: route._id
        });

        return await module.exports.createManyForRoute(req, res, route, stations);
    }
};