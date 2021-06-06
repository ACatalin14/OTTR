const express = require("express");
const router = express.Router();
const adminAuthorize = require('../middlewares/adminAuthorization.js');
const stationController = require('../controllers/stationController');

router.get('/', stationController.index);
router.get('/:id', stationController.show);
router.get('/code/:code', stationController.getByCode);
router.get('/name/:name', stationController.getByName);
router.post('/', adminAuthorize, stationController.create);
router.put('/:id', adminAuthorize, stationController.update);
router.delete('/:id', adminAuthorize, stationController.delete);

module.exports = router;
