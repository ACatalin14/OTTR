const CONSTANTS = require('../constants');
const RouteStation = require("../models/routeStation");
const Route = require("../models/route");

module.exports = {
    createManyForRoute: async (req, res, route, reqCarTemplates) => {

        route.carTemplates = [];

        for (let reqCarTemplate of reqCarTemplates) {

            let depRouteStationId = await RouteStation.findOne({
                route: route._id,
                station: reqCarTemplate.departureStationId
            });

            let arrRouteStationId = await RouteStation.findOne({
                route: route._id,
                station: reqCarTemplate.arrivalStationId
            });

            route.carTemplates.push({
                orderNo: reqCarTemplate.orderNo,
                number: reqCarTemplate.number,
                departureStation: depRouteStationId,
                arrivalStation: arrRouteStationId,
                travelClass: reqCarTemplate.travelClassId,
                carLayout: reqCarTemplate.carLayoutId,
            });
        }

        const updatedRoute = await Route.findByIdAndUpdate(route._id, route, {new: true});

        return Object.assign({}, updatedRoute['_doc']);
    }
};