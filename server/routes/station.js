const express = require("express");
const router = express.Router();
const adminAuthorize = require('../middlewares/adminAuthorization.js');
const stationController = require('../controllers/stationController');

router.get('/', adminAuthorize, stationController.index);
router.get('/:id', adminAuthorize, stationController.show);
router.post('/', adminAuthorize, stationController.create);
router.put('/:id', adminAuthorize, stationController.update);
router.delete('/:id', adminAuthorize, stationController.delete);

module.exports = router;