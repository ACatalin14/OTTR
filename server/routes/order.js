const express = require("express");
const router = express.Router();
const authorize = require('../middlewares/authorization.js');
const adminAuthorization = require('../middlewares/adminAuthorization.js');
const orderTicketController = require('../controllers/orderTicketController');

router.get('/', adminAuthorization, orderTicketController.index);
router.post('/', authorize, orderTicketController.placeOrder);

module.exports = router;