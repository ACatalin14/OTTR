const Route = require("../models/route");
const rideCarController = require("./rideCarController");
const dateFormat = require('dateformat');

module.exports = {
    getRidesForRoute: async (req, res) => {

        const route = await module.exports.getRouteByName(req.params.name);

        if (route) {
            return res.status(200).json(route.rides);
        }

        return res.status(400).json({err: CONSTANTS.ERRORS.ROUTE_NOT_FOUND});
    },

    getRouteByName: async (name) => {

        const routes = await Route.find({deleted: {$ne: true}})
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

        const nameTokens = name.split(/[\(\)\-]/);
        const sourceCode = nameTokens[0];
        const departureTime = nameTokens[1];
        const destinationCode = nameTokens[3];
        const arrivalTime = nameTokens[4];

        for (let route of routes) {
            const stationsCount = route.routeStations.length;
            const departureDateTime = new Date(route.departureTime);
            const arrivalDateTime = new Date(route.arrivalTime);

            if (route.routeStations[0].station.code === sourceCode &&
                route.routeStations[stationsCount - 1].station.code === destinationCode &&
                dateFormat(departureDateTime, 'HH:MM') === departureTime &&
                dateFormat(arrivalDateTime, 'HH:MM') === arrivalTime
            ) {
                return JSON.parse(JSON.stringify(route));
            }
        }

        return null;
    },

    createManyForRoute: async (req, res, route) => {

        const noOfRides = req.body.noOfGeneratedRides;
        const ridesDateFrom = req.body.generateRidesFrom;
        const ridesUntilDate = req.body.generateRidesUntil;
        const activeWeekDays = req.body.activeWeekDays;
        const departureTime = route.departureTime;
        const arrivalTime = route.arrivalTime;
        let oldCount = 0;

        if (!route.rides || route.rides.length === 0) {
            route.rides = [];
        } else {
            oldCount = route.rides.length;
        }

        // calculate available dates based on active week days (adding to today)
        let rideDates = module.exports.calculateNextRideDates(activeWeekDays, departureTime, arrivalTime, noOfRides, ridesDateFrom, ridesUntilDate);

        for (let rideDate of rideDates) {
            route.rides.push({
                departureDate: rideDate.departureDate,
                arrivalDate: rideDate.arrivalDate,
                cars: []
            });
        }

        let updatedRoute = await Route.findByIdAndUpdate(route._id, route, {new: true});
        updatedRoute = updatedRoute['_doc'];

        for (let i = oldCount; i < updatedRoute.rides.length; i++) {

            const cars = await rideCarController.createCarsForRideWithTemplate(req, res, updatedRoute.rides[i], route.carTemplates);
            cars.forEach( car => {
                updatedRoute.rides[i].cars.push(car._id);
            });
        }

        updatedRoute = await Route.findByIdAndUpdate(updatedRoute._id, updatedRoute, {new: true});
        updatedRoute = updatedRoute['_doc'];

        return JSON.parse(JSON.stringify(updatedRoute));
    },

    /**
     * noOfRides -> generate the next daily noOfRides starting from today
     * noOfRides + ridesDateFrom -> generate the next daily noOfRides starting from ridesDateFrom
     * noOfRides + ridesDateUntil -> generate the next daily noOfRides starting from today until ridesDateUntil (without passing this date)
     * noOfRides + ridesDateFrom + ridesDateUntil -> generate noOfRides rides between those dates
     * ridesDateFrom + ridesDateUntil -> generate all daily rides from startDate until finishDate
     * ridesDateUntil -> generate all daily rides from today until ridesDateUntil
     *
     * @param activeWeekDays
     * @param departureTime
     * @param arrivalTime
     * @param noOfRides
     * @param ridesDateFrom
     * @param ridesUntilDate
     */
    calculateNextRideDates(activeWeekDays, departureTime, arrivalTime, noOfRides, ridesDateFrom, ridesUntilDate) {
        let rideDates = [];

        if (!noOfRides) {
            noOfRides = 999999;
        }

        if (!ridesDateFrom) {
            ridesDateFrom = Date.now();
        }
        ridesDateFrom = new Date(ridesDateFrom);

        if (!ridesUntilDate) {
            ridesUntilDate = new Date('1.1.9999');
        }
        ridesUntilDate = new Date(ridesUntilDate);
        ridesUntilDate.setHours(23, 59, 59, 999);

        departureTime = new Date(departureTime);
        arrivalTime = new Date(arrivalTime);

        // departureTime.setFullYear( new Date().getFullYear() );
        // departureTime.setMonth( new Date().getMonth() );
        // departureTime.setDate( new Date().getDate() );
        // arrivalTime.setFullYear( new Date().getFullYear() );
        // arrivalTime.setMonth( new Date().getMonth() );
        // arrivalTime.setDate( new Date().getDate() );


        // check if today should be included in ride dates
        let todayDepDateTime = new Date();
        todayDepDateTime.setHours(departureTime.getHours(), departureTime.getMinutes(), 0, 0);

        if (ridesDateFrom.getDate() === todayDepDateTime.getDate() &&
            ridesDateFrom.getMonth() === todayDepDateTime.getMonth() &&
            ridesDateFrom.getFullYear() === todayDepDateTime.getFullYear()
        ) {
            if (ridesDateFrom < todayDepDateTime && activeWeekDays.includes(todayDepDateTime.getDay())) {

                const dayDiff = arrivalTime.getDate() - departureTime.getDate();
                const todayArrDateTime = new Date(todayDepDateTime);
                todayArrDateTime.setHours(arrivalTime.getHours(), arrivalTime.getMinutes(), 0, 0);
                todayArrDateTime.setDate(todayDepDateTime.getDate() + dayDiff);

                rideDates.push({
                    departureDate: todayDepDateTime,
                    arrivalDate: todayArrDateTime
                });
            }

            ridesDateFrom.setDate(ridesDateFrom.getDate() + 1);
        }

        // search for next ride dates
        let currentDepDate = new Date(ridesDateFrom);
        currentDepDate.setHours(departureTime.getHours(), departureTime.getMinutes(), 0, 0);

        while (currentDepDate < ridesUntilDate && noOfRides > 0) {

            if (activeWeekDays.includes( currentDepDate.getDay() )) {

                const dayDiff = arrivalTime.getDate() - departureTime.getDate();
                const currentArrDate = new Date(currentDepDate);
                currentArrDate.setHours(arrivalTime.getHours(), arrivalTime.getMinutes(), 0, 0);
                currentArrDate.setDate(currentDepDate.getDate() + dayDiff);

                rideDates.push({
                    departureDate: new Date(currentDepDate),
                    arrivalDate: new Date(currentArrDate)
                });

                noOfRides--;
            }

            currentDepDate.setDate(currentDepDate.getDate() + 1);
        }

        return rideDates;
    },

    /**
     * Request example:
     * params: routeId = "5e9ruoigwhie"
     * {
     *
     *      noOfGeneratedRides: 0,
     *      generateRidesFrom: 1421894721,
     *      generateRidesUntil: 1541798121
     * }
     *
     * @param req
     * @param res
     * @returns {Promise<*>}
     */
    createRides: async (req, res) => {

        if (!req.params.id || req.body.noOfGeneratedRides === undefined || req.body.generateRidesFrom === undefined ||
            req.body.generateRidesUntil === undefined
        ) {
            return res.status(400).json({err: CONSTANTS.ERRORS.BAD_REQUEST_ROUTE_UPDATE});
        }


        const route = await Route.findById(req.params.id);

        req.body.activeWeekDays = route.activeWeekDays;

        const updatedRoute = await module.exports.createManyForRoute(req, res, route);

        return res.status(200).json(updatedRoute)
    },

    deleteRide: async (req, res) => {

        const route = await module.exports.getRouteByName(req.params.name);

        if (!route) {
            return res.status(400).json({err: CONSTANTS.ERRORS.ROUTE_NOT_FOUND});
        }

        // delete the ride from array
        const updatedRoute = await Route.findByIdAndUpdate(route._id, {
            $pull: {
                rides: {
                    _id: req.params.id
                }
            }
        }, {new: true});

        return res.status(200).json(updatedRoute);
    }
};