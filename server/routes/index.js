const express = require("express");
const router = express.Router();

// const bcrypt = require('bcryptjs');
// const uuid = require('uuid');
// const jwt = require('jsonwebtoken');
//
// const trainController = require("../controllers/trainController");
//
// const userMiddleware = require('../middlewares/authorization.js');
//
// router.get("/trains", trainController.getAll.bind(trainController));
// router.get("/trains/:trainId", trainController.getById.bind(trainController));
//
// router.post('/register', (req, res, next) => {});
// router.post('/login', (req, res, next) => {});
// router.get('/secret-route', (req, res, next) => {
//     res.send('This is the secret content. Only logged in users can see that!');
// });

router.use('/user', require('./user'));

module.exports = router;