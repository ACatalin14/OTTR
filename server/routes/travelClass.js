const express = require("express");
const router = express.Router();
const adminAuthorize = require('../middlewares/adminAuthorization.js');
const travelClassController = require('../controllers/travelClassController');

router.get('/', travelClassController.index);
router.get('/:id', travelClassController.show);
router.get('/code/:code', travelClassController.getByCode);
router.post('/', adminAuthorize, travelClassController.create);
router.put('/:id', adminAuthorize, travelClassController.update);
router.delete('/:id', adminAuthorize, travelClassController.delete);

module.exports = router;