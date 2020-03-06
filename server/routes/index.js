const express = require("express");
const router = express.Router();

router.use('/user', require('./user'));
router.use('/station', require('./station'));
router.use('/train-category', require('./trainCategory'));

module.exports = router;