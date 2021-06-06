const express = require("express");
const router = express.Router();
const rideController = require('../controllers/rideController');

router.get('/', rideController.index);

router.get('/source/:sourceId/destination/:destinationId/date/:date', rideController.getFilteredRides);
router.get('/source/:sourceId/destination/:destinationId/date/:date/via/:viaStationId', rideController.getFilteredRides);
router.get('/source/:sourceId/destination/:destinationId/date/:date/travelClass/:travelClassId', rideController.getFilteredRides);
router.get('/source/:sourceId/destination/:destinationId/date/:date/via/:viaStationId/travelClass/:travelClassId', rideController.getFilteredRides);
router.get('/source/:sourceId/destination/:destinationId/date/:date/travelClass/:travelClassId/via/:viaStationId', rideController.getFilteredRides);

router.get('/source/:sourceId/destination/:destinationId/date/:date/departureTime/:departureTime/arrivalTime/:arrivalTime', rideController.getRideByDetails);

module.exports = router;
