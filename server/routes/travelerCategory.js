const express = require("express");
const router = express.Router();
const adminAuthorize = require('../middlewares/adminAuthorization.js');
const travelerCategoryController = require('../controllers/travelerCategoryController');

router.get('/', adminAuthorize, travelerCategoryController.index);
router.get('/:id', adminAuthorize, travelerCategoryController.show);
router.post('/', adminAuthorize, travelerCategoryController.create);
router.put('/:id', adminAuthorize, travelerCategoryController.update);
router.delete('/:id', adminAuthorize, travelerCategoryController.delete);

module.exports = router;