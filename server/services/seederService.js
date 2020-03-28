// TODO: write some correct seeders for different entities

const faker = require('faker');
const Train = {}; //= require('../models/train');
const config = require('../config');

module.exports = {
    seedData() {
        Train.countDocuments((err, count) => {
            if (count > 0) {
                return;
            }

            this.createTrains();
        })
    },

    createTrains() {
        let trains = [];

        for (let i = 0; i < config.dataSeeds.numberOfTrains; i++) {
            trains.push({
                number: faker.random.number({"min": 12345, "max": 19876}),
                rank: faker.hacker.abbreviation()
            });
        }

        Train.insertMany(trains, (err, savedTrains) => {
            if (err) {
                console.log("Error while seeding data with Trains.")
            }
        })
    }
};