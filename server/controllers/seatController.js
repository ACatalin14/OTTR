const mongoose = require('mongoose');
const CONSTANTS = require('../constants');
const Car = require("../models/car");
const ObjectId = mongoose.mongo.ObjectId;

let seatDeselectionTimers = {};
let dbLocks = {
    selectSeatLock: false,
    deselectSeat: false
};

module.exports = {

    /**
     * Request Example: { }
     *
     * Response Example:
     * {
     *     deselectSeatTimer: 63
     * }
     *
     * @param req
     * @param res
     * @returns {Promise<cars>}
     */
    selectSeat: async (req, res) => {

        console.log('Select Seat START');

        let updatedCar, updatedSeat, deselectSeatTimer;
        const seatId = req.params.id;

        try {

            updatedCar = await Car.findOneAndUpdate({
                    seats: {
                        $elemMatch: {
                            _id: ObjectId(seatId),
                            $or: [
                                {
                                    selected: false,
                                    selectingUser: null
                                },
                                {
                                    selected: true,
                                    selectingUser: ObjectId(req.userData._id)
                                }
                            ]

                        }
                    },
                }, {
                    $set: {
                        'seats.$.selected': true,
                        'seats.$.selectingUser': req.userData._id
                    }
                }, { new: true }
            ).exec();

            if (!updatedCar) {
                console.log('Select Seat FINISH err');
                dbLocks.selectSeatLock = true;
                return res.status(400).json({ err: CONSTANTS.ERRORS.SEAT_ALREADY_SELECTED });
            }

            updatedSeat = updatedCar.seats.find(s => s._id.equals(ObjectId(seatId)));

            // clear old timer if existent
            if (seatDeselectionTimers[seatId]) {
                clearTimeout(seatDeselectionTimers[seatId]);
                delete seatDeselectionTimers[seatId];
            }

            // add the timer by indexing after seat id
            deselectSeatTimer = setTimeout(module.exports.automaticallyDeselectSeat, CONSTANTS.SEAT_SELECTION_TIMEOUT, updatedSeat);
            seatDeselectionTimers[seatId] = deselectSeatTimer;

            console.log('After addition:');
            console.log(Object.keys(seatDeselectionTimers));
            console.log('Select Seat FINISH');

        } catch (error) {

            console.error(error);
            dbLocks.selectSeatLock = true;
            return res.status(500).json({err: CONSTANTS.ERRORS.FAILED_TO_UPDATE_SEAT});
        }

        dbLocks.selectSeatLock = true;
        return res.status(200).json(updatedSeat);
    },

    /**
     * Request Example: { }
     *
     * Response Example:
     * {
     *      selectingUser: null,
     *      reservations: [],
     *      _id: 5eb888e3e733662808ef4dca,
     *      number: 24,
     *      selected: false
     * }
     *
     *
     * @param req
     * @param res
     * @returns {Promise<*>}
     */
    deselectSeat: async (req, res) => {
        console.log('Deselect Seat START');
        let updatedCar, updatedSeat;
        const seatId = req.params.id;

        try {

            updatedCar = await Car.findOneAndUpdate(
                {
                    seats: {
                        $elemMatch: {
                            _id: ObjectId(seatId),
                            selected: true,
                            selectingUser: req.userData._id
                        }
                    }
                },
                {
                    $set: {
                        'seats.$.selected': false,
                        'seats.$.selectingUser': null
                    }
                },
                { new: true }
            ).exec();

            if (!updatedCar) {
                console.log('Deselect Seat FINISH err');

                return res.status(500).json({err: CONSTANTS.ERRORS.FAILED_TO_DESELECT_SEAT});
            }

            updatedSeat = updatedCar.seats.find(s => s._id.equals(ObjectId(seatId)));

            // remove the timer indexed after seat id
            clearTimeout(seatDeselectionTimers[seatId]);
            delete seatDeselectionTimers[seatId];

            console.log('After remove:');
            console.log(Object.keys(seatDeselectionTimers));
            console.log('Deselect Seat FINISH');

        } catch (error) {

            console.error(error);
            return res.status(500).json({err: CONSTANTS.ERRORS.FAILED_TO_DESELECT_SEAT});
        }

        return res.status(200).json(updatedSeat);
    },

    automaticallyDeselectSeat: async (seat) => {
        console.log('AutoDeselect Seat START');

        try {

            await Car.findOneAndUpdate(
                {
                    seats: {
                        $elemMatch: {
                            _id: ObjectId(seat._id),
                            selected: true
                        }
                    }
                },
                {
                    $set: {
                        'seats.$.selected': false,
                        'seats.$.selectingUser': null
                    }
                }
            ).exec();

            delete seatDeselectionTimers[seat._id];

            console.log('After automatic remove:');
            console.log(Object.keys(seatDeselectionTimers));
            console.log('AutoDeselect Seat FINISH')

        } catch (error) {

            console.error('Something bad happened when autodeselecting a seat.');
            console.error(error);
        }

    }
};