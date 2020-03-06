const express = require("express");
const router = express.Router();
const adminAuthorize = require('../middlewares/adminAuthorization.js');
const travelClassController = require('../controllers/travelClassController');

router.get('/', adminAuthorize, travelClassController.index);
router.get('/:id', adminAuthorize, travelClassController.show);
router.post('/', adminAuthorize, travelClassController.create);
router.put('/:id', adminAuthorize, travelClassController.update);
router.delete('/:id', adminAuthorize, travelClassController.delete);

module.exports = router;