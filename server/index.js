const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');

const config = require('./config');
const seederService = require('./services/seederService');
const configController = require('./controllers/configController');

const app = express();
const PORT = process.env.PORT || 3000;

mongoose.set("useCreateIndex", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useUnifiedTopology", true);
mongoose
    .connect(config.db.connection, { useNewUrlParser: true})
    .then(() => {
        console.log('Connected to the database.');
    })
    .catch(err => {
        console.error({database_err: err});
    });

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const corsConfig = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', 'http://localhost:8080');
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE,PATCH');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    next()
};

app.use(corsConfig);

const router = require('./routes');
app.use('/api', router);

if (config.shouldSeedData) {
    seederService.seedData()
}

configController.createIfNotCreated();

app.listen(PORT, () => console.log(`OTTR Server is listening on port ${PORT}.`));
