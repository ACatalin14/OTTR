const express = require("express");
const router = express.Router();
const adminAuthorize = require('../middlewares/adminAuthorization.js');
const routeController = require('../controllers/routeController');
const routeRideController = require('../controllers/routeRideController');

router.get('/', adminAuthorize, routeController.index);     // get routes which are not (soft) deleted
router.get('/all', adminAuthorize, routeController.indexAll);   // get ALL routes (deleted counted too)
router.get('/name/:name', adminAuthorize, routeController.getByName);   // get one route by its name
router.get('/name/:name/rides', adminAuthorize, routeRideController.getRidesForRoute);   // get rides for one route by its name
router.get('/:id', adminAuthorize, routeController.show);
router.post('/', adminAuthorize, routeController.create);
router.post('/:id/rides', adminAuthorize, routeRideController.createRides);
router.put('/:id', adminAuthorize, routeController.update);
router.delete('/:id', adminAuthorize, routeController.delete);
router.delete('/name/:name/ride/:id', adminAuthorize, routeRideController.deleteRide);

module.exports = router;