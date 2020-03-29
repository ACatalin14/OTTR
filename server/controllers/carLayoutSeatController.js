const CONSTANTS = require('../constants');
const CarLayout = require("../models/carLayout");

module.exports = {
    getDefaultSeatsForCarLayoutId: async (req, res, carLayoutId) => {

        const carLayout = await CarLayout.findById(carLayoutId);

        let seats = [];

        carLayout.elements.forEach( element => {
            if (element.seatNumber !== undefined) {
                seats.push({
                    number: element.seatNumber,
                    reserved: false
                });
            }
        });

        seats.sort((a, b) => a.number - b.number);

        return seats;
    }
};