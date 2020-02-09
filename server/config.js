module.exports = {
    db: {
        connection: "mongodb://localhost:27017/ottr-db",
        secret: "password"
    },
    jwtsecret: 'jwt-12wq!@WQ',
    shouldSeedData: false,
    dataSeeds: {
        numberOfTrains: 15
    }
};