const Route = require("../models/route");
const rideCarController = require("./rideCarController");

module.exports = {
    createManyForRoute: async (req, res, route) => {

        const noOfRides = req.body.noOfGeneratedRides;
        const ridesDateFrom = req.body.generateRidesFrom;
        const ridesUntilDate = req.body.generateRidesUntil;
        const activeWeekDays = req.body.activeWeekDays;
        const departureTime = route.departureTime;
        const arrivalTime = route.arrivalTime;

        route.rides = [];
        console.log('Sa Calculam urm rides');
        // calculate available dates based on active week days (adding to today)
        let rideDates = module.exports.calculateNextRideDates(activeWeekDays, departureTime, arrivalTime, noOfRides, ridesDateFrom, ridesUntilDate);
        console.log('Am calculat urm rides');

        for (let rideDate of rideDates) {
            route.rides.push({
                departureDate: rideDate.departureDate,
                arrivalDate: rideDate.arrivalDate,
                cars: []
            });
        }

        let updatedRoute = await Route.findByIdAndUpdate(route._id, route, {new: true});
        updatedRoute = updatedRoute['_doc'];
        console.log('Am updatat urm rides');

        for (let i = 0; i < updatedRoute.rides.length; i++) {
            console.log('Sa cream car templates pr rides');

            const cars = await rideCarController.createCarsForRideWithTemplate(req, res, updatedRoute.rides[i], route.carTemplates);
            cars.forEach( car => {
                updatedRoute.rides[i].cars.push(car._id);
            });
        }
        console.log('Sa gasim updated...');

        updatedRoute = await Route.findByIdAndUpdate(updatedRoute._id, updatedRoute, {new: true});
        updatedRoute = updatedRoute['_doc'];
        console.log('Sa gasim updated...');

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
        console.log('------------Current?1122 CEVAAAA:');

        departureTime = new Date(departureTime);
        arrivalTime = new Date(arrivalTime);

        // check if today should be included in ride dates
        let todayDepDateTime = new Date();
        todayDepDateTime.setHours(departureTime.getHours(), departureTime.getMinutes(), 0, 0);
        console.log('------------Current?22:');

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
        console.log('------------Current?:');

        while (currentDepDate < ridesUntilDate && noOfRides > 0) {
            console.log('------------Current:');
            console.log(currentDepDate);
            console.log(ridesUntilDate);
            console.log(noOfRides);
            console.log(activeWeekDays);
            console.log(arrivalTime);
            console.log(departureTime);
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
    }
};