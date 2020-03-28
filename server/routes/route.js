const express = require("express");
const router = express.Router();
const adminAuthorize = require('../middlewares/adminAuthorization.js');
const routeController = require('../controllers/routeController');
const routeRideController = require('../controllers/routeRideController');

router.get('/', adminAuthorize, routeController.index);
router.get('/:id', adminAuthorize, routeController.show);
router.post('/', adminAuthorize, routeController.create);
router.put('/:id', adminAuthorize, routeController.update);
router.delete('/:id', adminAuthorize, routeController.delete);

// router.get('/:id/carTemplate', adminAuthorize, routeController.getCarTemplates);
// router.get('/:id/carTemplate/:carTemplateId', adminAuthorize, routeController.getCarTemplate);
// router.post('/:id/carTemplate', adminAuthorize, routeController.addCarTemplate);
// router.put('/:id/carTemplate/:carTemplateId', adminAuthorize, routeController.updateCarTemplate);
// router.delete('/:id/carTemplate/:carTemplateId', adminAuthorize, routeController.deleteCarTemplate);
//
// router.get('/:routeId/ride', adminAuthorize, routeRideController.index);
// router.get('/:routeId/ride/:rideId', adminAuthorize, routeRideController.show);
// router.post('/:routeId/ride', adminAuthorize, routeRideController.create);
// router.put('/:routeId/ride/:rideId', adminAuthorize, routeRideController.update);
// router.delete('/:routeId/ride/:rideId', adminAuthorize, routeRideController.delete);

module.exports = router;