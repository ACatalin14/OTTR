const CONSTANTS = require('../constants');
const Config = require("../models/config");

module.exports = {

    getHttp: async (req, res) => {
        await Config.findOne({}, (err, config) => {
            if (err) {
                return res.status(500).json({err: CONSTANTS.ERRORS.OTHER});
            }
            return res.status(200).json(config);
        });
    },

    getConfig: async () => {

        return Config.findOne({}).exec();
    },

    setConfig: async (settings) => {

        await Config.updateOne({}, {
            $set: settings
        });
    },

    createIfNotCreated: async () => {

        const configObject = await Config.findOne({}).exec();

        if (configObject) {
            return;
        }

        const config = {
            kmPrice: 0.13,
            lastOrderNumber: 14297
        };

        await Config.create(config, (err) => {
            if (err) {
                throw Error(err);
            }
        });
    },

    updateHttp: async (req, res) => {
        let newConfigFields = {};

        if (req.body.kmPrice) {
            newConfigFields.kmPrice = req.body.kmPrice;
        }

        await Config.update({}, newConfigFields,
            (err) => {
                if (err) {
                    res.status(500).json({ err: CONSTANTS.ERRORS.DB_OBJECT_UPDATE_FAILED });
                }
            }
        );

        await Config.findOne({}, (err, updatedConfig) => {
            if (err) {
                return res.status(500).json({err: CONSTANTS.ERRORS.OTHER});
            }
            return res.status(200).json(updatedConfig);
        });

    }
};