const express = require("express");
const router = express.Router();

router.use('/user', require('./user'));
router.use('/station', require('./station'));

module.exports = router;