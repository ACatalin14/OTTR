const express = require("express");
const router = express.Router();
const authorize = require('../middlewares/authorization.js');
const seatController = require('../controllers/seatController');

router.patch('/:id/selected/true', authorize, seatController.selectSeat);
router.patch('/:id/selected/false', authorize, seatController.deselectSeat);
router.patch('/:id/preserve', authorize, seatController.preserveSeat);

module.exports = router;
