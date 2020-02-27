const express = require("express");
const router = express.Router();
const authorize = require('../middlewares/authorization.js');
const stationController = require('../controllers/stationController');

router.get('/', authorize, stationController.index);
router.get('/:id', authorize, stationController.show);
router.post('/', authorize, stationController.create);
router.put('/:id', authorize, stationController.update);
router.delete('/:id', authorize, stationController.delete);

module.exports = router;