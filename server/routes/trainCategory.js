const express = require("express");
const router = express.Router();
const adminAuthorize = require('../middlewares/adminAuthorization.js');
const trainCategoryController = require('../controllers/trainCategoryController');

router.get('/', trainCategoryController.index);
router.get('/:id', trainCategoryController.show);
router.post('/', adminAuthorize, trainCategoryController.create);
router.put('/:id', adminAuthorize, trainCategoryController.update);
router.delete('/:id', adminAuthorize, trainCategoryController.delete);

module.exports = router;