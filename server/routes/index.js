const express = require("express");
const router = express.Router();

router.use('/user', require('./user'));
router.use('/station', require('./station'));
router.use('/train-category', require('./trainCategory'));
router.use('/travel-class', require('./travelClass'));
router.use('/traveler-category', require('./travelerCategory'));
router.use('/student', require('./student'));
router.use('/car-layout', require('./carLayout'));
router.use('/route', require('./route'));

module.exports = router;