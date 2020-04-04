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
                halt: !station.departureTime || !station.arrivalTime ? 0 : station.departureTime - station.arrivalTime,
                route: route._id,
                station: station.stationId
            });

            stationIds.push(station.stationId);
        }

        try {
            const createdRouteStations = await RouteStation.create(routeStations);

            for (let routeStation of createdRouteStations) {
                routeStationIds.push(routeStation._id);
            }
        } catch (err) {
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
    }
};