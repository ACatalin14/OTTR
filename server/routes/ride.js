const express = require("express");
const router = express.Router();
const adminAuthorize = require('../middlewares/adminAuthorization.js');
const rideController = require('../controllers/rideController');

router.get('/', rideController.index);
router.get('/source/:sourceId/destination/:destinationId', rideController.getFilteredRides);

module.exports = router;