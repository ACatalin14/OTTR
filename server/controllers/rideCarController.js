const Car = require("../models/car");
const RouteStation = require("../models/routeStation");
const carLayoutSeatController = require("./carLayoutSeatController");

module.exports = {
    createCarsForRideWithTemplate: async (req, res, ride, carTemplates) => {

        let cars = [];

        for (let i = 0; i < carTemplates.length; i++) {

            try {
                const seats = await carLayoutSeatController.getDefaultSeatsForCarLayoutId(req, res, carTemplates[i].carLayout);

                const departureStationCarTemplate = await RouteStation.findById(carTemplates[i].departureStation).exec();
                const departureRouteStationCandidates = await RouteStation.find({
                    route: departureStationCarTemplate.route,
                    station: departureStationCarTemplate.station
                }).exec();
                const departureStation = departureRouteStationCandidates.find(st => {
                    return ride.routeStations.includes(st._id);
                });

                const arrivalStationCarTemplate = await RouteStation.findById(carTemplates[i].arrivalStation).exec();
                const arrivalRouteStationCandidates = await RouteStation.find({
                    route: arrivalStationCarTemplate.route,
                    station: arrivalStationCarTemplate.station
                }).exec();
                const arrivalStation = arrivalRouteStationCandidates.find(st => {
                    return ride.routeStations.includes(st._id);
                });

                cars.push({
                    orderNo: carTemplates[i].orderNo,
                    number: carTemplates[i].number,
                    departureStation: departureStation,
                    arrivalStation: arrivalStation,
                    travelClass: carTemplates[i].travelClass,
                    carLayout: carTemplates[i].carLayout,
                    ride: ride._id,
                    seats: seats
                })
            } catch (err) {
                throw err;
            }
        }

        return Car.create(cars);
    }
};