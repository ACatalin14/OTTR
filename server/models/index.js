const fs = require('fs');
const path = require('path');
const db = {};

fs.
    readdirSync(__dirname).
    forEach(file => {
        if (file === path.basename(__filename)) {
            return;
        }

        const model = require(__dirname + '/' + file);

        db[model.modelName] = model;
    });

module.exports = db;