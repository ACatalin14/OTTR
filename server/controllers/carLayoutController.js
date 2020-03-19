const CONSTANTS = require('../constants');
const CarLayout = require("../models/carLayout");

const carLayoutController = {
    index: async (req, res) => {

        await CarLayout
            .find({})
            .then((carLayouts) => {
                if (carLayouts) {
                    return res.status(200).json(carLayouts);
                }
                return res.status(500).json({ err: CONSTANTS.ERRORS.OTHER });
            })
            .catch(() => {
                return res.status(500).json({ err: CONSTANTS.ERRORS.OTHER });
            });
    },

    show: async (req, res) => {

        await CarLayout
            .findById(req.params.id)
            .then((carLayout) => {
                if (carLayout) {
                    return res.status(200).json(carLayout);
                }
                return res.status(500).json({err: CONSTANTS.ERRORS.OTHER});
            })
            .catch(() => {
                return res.status(500).json({ err: CONSTANTS.ERRORS.OTHER });
            });
    },

    getByName: async (req, res) => {

        await CarLayout
            .find({ name: req.params.name })
            .then((carLayouts) => {
                if (carLayouts[0]) {
                    return res.status(200).json(carLayouts[0]);
                }
                return res.status(500).json({err: CONSTANTS.ERRORS.CAR_LAYOUT_NOT_FOUND});
            })
            .catch(() => {
                return res.status(500).json({ err: CONSTANTS.ERRORS.CAR_LAYOUT_NOT_FOUND });
            });
    },

    create: async (req, res) => {

        const carLayout = {
            name: req.body.name,
            seatingCapacity: req.body.seatingCapacity,
            width: req.body.width,
            height: req.body.height,
            cellSize: req.body.cellSize,
            lastElementId: req.body.lastElementId,
            elements: req.body.elements
        };

        let error = carLayoutController.checkIfArrayOfLayoutElements(carLayout.elements);

        if (error) {
            return res.status(400).json({err: error});
        }

        await CarLayout
            .create(carLayout)
            .then((createdCarLayout) => {
                if (createdCarLayout) {
                    return res.status(201).json(createdCarLayout);
                }
                return res.status(500).json({err: CONSTANTS.ERRORS.DB_OBJECT_CREATE_FAILED});
            })
            .catch((err) => {
                if (err.errmsg.includes('duplicate key error') &&
                    err.errmsg.includes('name')
                ) {
                    return res.status(400).json({err: CONSTANTS.ERRORS.NAME_IS_TAKEN});
                }
                return res.status(500).json({err: CONSTANTS.ERRORS.DB_OBJECT_CREATE_FAILED});
            });
    },

    update: async (req, res) => {

        const newCarLayoutFields = {
            name: req.body.name,
            seatingCapacity: req.body.seatingCapacity,
            width: req.body.width,
            height: req.body.height,
            cellSize: req.body.cellSize,
            lastElementId: req.body.lastElementId,
            elements: req.body.elements
        };

        // Sanitize request
        for (let field of Object.keys(newCarLayoutFields)) {
            if (typeof newCarLayoutFields[field] === 'undefined') {
                delete newCarLayoutFields[field];
            }
        }

        // if layout elements are given, they must be fully given
        let error = carLayoutController.checkIfArrayOfLayoutElements(newCarLayoutFields.elements);

        if (error) {
            return res.status(400).json({err: error});
        }

        // Update
        await CarLayout
            .findByIdAndUpdate(
                req.params.id,
                { $set: newCarLayoutFields },
                { new: true })
            .then((updatedCarLayout) => {
                if (updatedCarLayout) {
                    return res.status(200).json(updatedCarLayout);
                }
                return res.status(500).json({ err: CONSTANTS.ERRORS.DB_OBJECT_UPDATE_FAILED });
            })
            .catch((err) => {
                if (err.errmsg.includes('duplicate key error') &&
                    err.errmsg.includes('name')
                ) {
                    return res.status(400).json({err: CONSTANTS.ERRORS.NAME_IS_TAKEN});
                }
                return res.status(500).json({ err: CONSTANTS.ERRORS.DB_OBJECT_UPDATE_FAILED });
            });
    },

    delete: async (req, res) => {

        await CarLayout
            .findByIdAndRemove(req.params.id)
            .then((deletedCarLayout) => {
                if (deletedCarLayout) {
                    return res.status(200).json(deletedCarLayout);
                }
                return res.status(500).json({ err: CONSTANTS.ERRORS.DB_OBJECT_DELETE_FAILED });
            })
            .catch(() => {
                return res.status(500).json({ err: CONSTANTS.ERRORS.DB_OBJECT_DELETE_FAILED });
            });
    },

    checkIfArrayOfLayoutElements: (elements) => {

        if (!Array.isArray(elements)) {
            return CONSTANTS.ERRORS.LAYOUT_ELEMENTS_NOT_ARRAY;
        }

        for (let element of elements) {
            if (typeof element.type === 'undefined' ||
                typeof element.i === 'undefined' ||
                typeof element.x === 'undefined' ||
                typeof element.y === 'undefined' ||
                typeof element.w === 'undefined' ||
                typeof element.h === 'undefined'
            ) {
                return CONSTANTS.ERRORS.LAYOUT_ELEMENT_UNKNOWN_TYPE;
            }

            if ([
                    CONSTANTS.LAYOUT.ELEMENTS.SEAT_LEFT,
                    CONSTANTS.LAYOUT.ELEMENTS.SEAT_RIGHT,
                    CONSTANTS.LAYOUT.ELEMENTS.SEAT_UP,
                    CONSTANTS.LAYOUT.ELEMENTS.SEAT_DOWN
                ].includes(element.type) &&
                typeof element.seatNumber === 'undefined'
            ) {
                return CONSTANTS.ERRORS.LAYOUT_ELEMENT_SEAT_NUMBER_MISSING;
            }
        }

        return 0;
    }
};

module.exports = carLayoutController;