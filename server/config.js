const Secret = require('./secret');

module.exports = {
    db: {
        connection: process.env.NODE_ENV === 'production' ? Secret.productionDatabaseConnection : "mongodb://localhost:27017/ottr-db",
        secret: "password"
    },
    jwtsecret: 'jwt-12wq!@WQ',
    shouldSeedData: false,
    dataSeeds: {
        numberOfTrains: 15
    }
};
