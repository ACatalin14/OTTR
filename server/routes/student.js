const express = require("express");
const router = express.Router();
const adminAuthorize = require('../middlewares/adminAuthorization.js');
const studentController = require('../controllers/studentController');

router.get('/', adminAuthorize, studentController.index);
router.get('/:id', adminAuthorize, studentController.show);
router.post('/', adminAuthorize, studentController.create);
router.put('/:id', adminAuthorize, studentController.update);
router.delete('/:id', adminAuthorize, studentController.delete);

module.exports = router;