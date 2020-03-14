const express = require("express");
const router = express.Router();
const adminAuthorize = require('../middlewares/adminAuthorization.js');
const carLayoutController = require('../controllers/carLayoutController');

router.get('/', adminAuthorize, carLayoutController.index);
router.get('/:id', adminAuthorize, carLayoutController.show);
router.post('/', adminAuthorize, carLayoutController.create);
router.put('/:id', adminAuthorize, carLayoutController.update);
router.delete('/:id', adminAuthorize, carLayoutController.delete);

module.exports = router;