const mongoose = require('mongoose');
const CONSTANTS = require('../constants');
const Car = require("../models/car");
const ObjectId = mongoose.mongo.ObjectId;

let seatDeselectionTimers = {};

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
                                // {
                                //     selected: true,
                                //     selectingUser: ObjectId(req.userData._id)
                                // }
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

                return res.status(400).json({ err: CONSTANTS.ERRORS.SEAT_ALREADY_SELECTED });
            }

            updatedSeat = updatedCar.seats.find(s => s._id.equals(ObjectId(seatId)));

            // add the timer by indexing after seat id
            deselectSeatTimer = setTimeout(module.exports.automaticallyDeselectSeat, CONSTANTS.SEAT_SELECTION_TIMEOUT, updatedSeat._id);
            seatDeselectionTimers[seatId] = deselectSeatTimer;

        } catch (error) {

            console.error(error);
            return res.status(500).json({err: CONSTANTS.ERRORS.FAILED_TO_UPDATE_SEAT});
        }

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

                return res.status(500).json({err: CONSTANTS.ERRORS.FAILED_TO_DESELECT_SEAT});
            }

            updatedSeat = updatedCar.seats.find(s => s._id.equals(ObjectId(seatId)));

            // remove the timer indexed after seat id
            clearTimeout(seatDeselectionTimers[seatId]);
            delete seatDeselectionTimers[seatId];

        } catch (error) {

            console.error(error);
            return res.status(500).json({err: CONSTANTS.ERRORS.FAILED_TO_DESELECT_SEAT});
        }

        return res.status(200).json(updatedSeat);
    },

    automaticallyDeselectSeat: async (seatId) => {

        try {

            await Car.findOneAndUpdate(
                {
                    seats: {
                        $elemMatch: {
                            _id: ObjectId(seatId),
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

            delete seatDeselectionTimers[seatId];

        } catch (error) {

            console.error('Something bad happened when autodeselecting a seat.');
            console.error(error);
        }
    },

    preserveSeat: (req, res) => {

        const seatId = req.params.id;

        if (!seatId || !seatDeselectionTimers[seatId]) {

            return res.status(400).json({err: CONSTANTS.ERRORS.NO_SEAT_TO_PRESERVE});
        }

        // clear old timer
        clearTimeout(seatDeselectionTimers[seatId]);
        delete seatDeselectionTimers[seatId];

        // reset the timer starting from now
        seatDeselectionTimers[seatId] = setTimeout(module.exports.automaticallyDeselectSeat, CONSTANTS.SEAT_SELECTION_TIMEOUT, seatId);

        return res.status(200).json({seatId});
    }
};