const mongoose = require('mongoose');
const CONSTANTS = require('../constants');
const Order = require("../models/order");
const Ticket = require("../models/ticket");
const Car = require("../models/car");
const Route = require("../models/route");
const TravelerCategory = require("../models/travelerCategory");
const configController = require("../controllers/configController");
const ObjectId = mongoose.mongo.ObjectId;

module.exports = {
    index: async (req, res) => {
        await Order.find({}, (err, orders) => {
            if (err) {
                return res.status(500).json({err: CONSTANTS.ERRORS.OTHER});
            }
            res.status(200).json(orders);
        });
    },

    /**
     * Get details of order, completing with "train" info for each ticket
     *
     * @param req
     * @param res
     * @returns {Promise<*>}
     */
    getOrdersForUser: async (req, res) => {

        if (!req.params.userId) {

            return res.status(400).json({err: CONSTANTS.ERRORS.MISSING_IMPORTANT_ARGUMENTS});
        }

        let orders, userId = req.params.userId;

        try {
            orders = await Order.find({ user: (userId) })
                .populate({
                    path: 'user tickets',
                    populate: {
                        path: 'car departureStation arrivalStation passengerType',
                        populate: {
                            path: 'station travelClass'
                        }
                    }
                })
                .exec();

            for (let orderInd = 0; orderInd < orders.length; orderInd++) {

                let orderIsAvailable = true;

                for (let ticketInd = 0; ticketInd < orders[orderInd].tickets.length; ticketInd++) {
                    const ticket = orders[orderInd].tickets[ticketInd];

                    // get seat
                    let seat = ticket.car.seats.find(s => JSON.stringify(s._id) === JSON.stringify(ticket.seat));
                    orders[orderInd].tickets[ticketInd] = JSON.parse(JSON.stringify(orders[orderInd].tickets[ticketInd]),
                        (key, val) => key === 'seat' ? seat : val
                    );

                    // get ride
                    const route = await Route.findOne({'rides._id': ObjectId(ticket.ride)}, 'train rides').populate('train.trainCategory').exec();

                    if (!route) {
                        // route not found, so maybe the corresponding ride to this ticket got deleted
                        orderIsAvailable = false;
                        break;
                    }

                    const rides = route.rides;
                    const ride = rides.find(r => JSON.stringify(r._id) === JSON.stringify(ticket.ride));
                    orders[orderInd].tickets[ticketInd] = JSON.parse(JSON.stringify(orders[orderInd].tickets[ticketInd]),
                        (key, val) => key === 'ride' ? ride : val
                    );

                    // get train
                    orders[orderInd].tickets[ticketInd].train = JSON.parse(JSON.stringify(route.train));
                }

                if (!orderIsAvailable) {
                    orders.splice(orderInd, 1);
                    orderInd--;
                }
            }
        } catch (error) {
            console.error(error);
            return res.status(500).json({err: CONSTANTS.ERRORS.OTHER});
        }

        return res.status(200).json(orders);
    },

    /**
     * Request Example: (with Bearer Token authentication)
     * {
     *     rideId: 5e341r31d13131341,
     *     departureStationId: 5e341e1e12e1,   (Station Id, not RouteStation Id)
     *     arrivalStationId: 5e341e1e1421411,   (Station Id, not RouteStation Id)
     *     tickets: [
     *         {
     *             seatId: 5ee12e1212r41              (Seat Id (within a Car))
     *             travelerCategoryId: 5ee1e14e1412      (Traveler Category Id)
     *         },
     *         {
     *             seatId: 5ee12e123424              (Seat Id (within a Car))
     *             travelerCategoryId: 5e23414e1412      (Traveler Category Id)
     *         }
     *     ]
     * }
     *
     * @param req
     * @param res
     * @returns {Promise<void>}
     */
    placeOrder: async (req, res) => {

        const rideId = req.body.rideId;
        const departureStationId = req.body.departureStationId;
        const arrivalStationId = req.body.arrivalStationId;
        const reqTickets = req.body.tickets;

        if ([rideId, departureStationId, arrivalStationId, reqTickets].includes(undefined)) {

            return res.status(400).json({err: CONSTANTS.ERRORS.MISSING_IMPORTANT_ARGUMENTS});
        }

        if (departureStationId === arrivalStationId) {
            return res.status(400).json({err: CONSTANTS.ERRORS.DEPARTURE_IS_DESTINATION});
        }

        let Config = await configController.getConfig();

        const route = await Route.findOne({ 'rides._id': rideId })
            .populate({
                path: 'rides.routeStations',
                populate: {
                    path: 'station'
                }
            })
            .populate({
                path: 'rides.cars',
                populate: {
                    path: 'departureStation arrivalStation travelClass',
                    populate: {
                        path: 'station'
                    }
                }
            })
            .populate({
                path: 'rides.cars',
                populate: {
                    path: 'seats.reservations',
                    populate: {
                        path: 'order passengerType departureStation arrivalStation',
                        populate: {
                            path: 'station'
                        }
                    }
                }
            })
            .exec();

        const ride = route.rides.find( r => r._id.equals(ObjectId(rideId)) );

        const departureRouteStation = ride.routeStations.find( rs => rs.station._id.equals(ObjectId(departureStationId)) );
        const arrivalRouteStation = ride.routeStations.find( rs => rs.station._id.equals(ObjectId(arrivalStationId)) );

        let tickets = [];
        let totalPrice = 0;
        let savedOrder = {};

        for (let reqTicket of reqTickets) {

            let ticket = {};

            if (!reqTicket.seatId || !reqTicket.travelerCategoryId) {
                return res.status(400).json({err: CONSTANTS.ERRORS.MISSING_IMPORTANT_ARGUMENTS});
            }

            try {
                const car = ride.cars.find( c =>
                    c.seats.find( s =>
                        s._id.equals(ObjectId(reqTicket.seatId))
                    )
                );

                const seat = car.seats.find( s => s._id.equals(ObjectId(reqTicket.seatId)) );

                if (module.exports.seatIsReservedBetweenSourceDestination(seat, departureRouteStation, arrivalRouteStation)) {

                    return res.status(400).json({err: CONSTANTS.ERRORS.SEAT_ALREADY_RESERVED});
                }

                const travelerCategory = await TravelerCategory.findById(reqTicket.travelerCategoryId).exec();

                let ticketPrice = Config.kmPrice * (arrivalRouteStation.distance - departureRouteStation.distance);
                ticketPrice *= 1 - travelerCategory.discount / 100;
                ticketPrice *= 1 - car.travelClass.discount / 100;
                ticketPrice = parseFloat(ticketPrice.toFixed(2));
                totalPrice += ticketPrice;

                ticket = {
                    price: ticketPrice,
                    ride: rideId,
                    car: car._id,
                    seat: seat._id,
                    departureStation: departureRouteStation._id,
                    arrivalStation: arrivalRouteStation._id,
                    passengerType: reqTicket.travelerCategoryId
                };

                tickets.push(ticket);

            } catch (error) {
                console.error(error);
                return res.status(500).json({err: CONSTANTS.ERRORS.OTHER});
            }
        }

        try {
            const nextOrderNumber = Config.lastOrderNumber + 1;

            const savedTickets = await Ticket.create(tickets);

            savedOrder = await Order.create({
                number: nextOrderNumber,
                price: totalPrice,
                user: req.userData._id,
                tickets: savedTickets
            });

            await Ticket.updateMany({ _id: { $in: savedTickets.map(t => t._id) } },
                { $set: { order: savedOrder } })
                .exec();

            for (let ticket of savedTickets) {

                await Car.updateOne({'seats._id': ticket.seat}, {
                    $push: {
                        'seats.$.reservations': ticket
                    },
                    $set: {
                        'seats.$.selected': false
                    }
                });
            }

            await configController.setConfig({ lastOrderNumber: nextOrderNumber });

        } catch (error) {
            console.error(error);
            return res.status(500).json({err: CONSTANTS.ERRORS.OTHER});
        }

        return res.status(200).json(savedOrder);
    },

    seatIsReservedBetweenSourceDestination: (seat, source, destination) => {

        if (seat.reservations && !seat.reservations.length) {
            return false;
        }

        const reqDep = source.orderNo;
        const reqArr = destination.orderNo;

        for (let reservation of seat.reservations) {

            const busyDep = reservation.departureStation.orderNo;
            const busyArr = reservation.arrivalStation.orderNo;

            if ((reqDep < busyDep && reqArr > busyDep) ||
                reqDep === busyDep ||
                (reqDep > busyDep && reqDep < busyArr)
            ) {
                return true;
            }
        }

        return false;
    }
};