const CONSTANTS = require('../constants');
const Car = require("../models/car");
const carLayoutSeatController = require("./carLayoutSeatController");

module.exports = {
    createCarsForRideWithTemplate: async (req, res, ride, carTemplates) => {

        let cars = [];

        for (let i = 0; i < carTemplates.length; i++) {

            try {
                const seats = await carLayoutSeatController.getDefaultSeatsForCarLayoutId(req, res, carTemplates[i].carLayout);

                cars.push({
                    orderNo: carTemplates[i].orderNo,
                    number: carTemplates[i].number,
                    departureStation: carTemplates[i].departureStation,
                    arrivalStation: carTemplates[i].arrivalStation,
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