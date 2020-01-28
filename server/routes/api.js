const express = require("express");
const router = express.Router();
const trainController = require("../controllers/trainController");

router.get("/trains", trainController.getAll.bind(trainController));
router.get("/trains/:trainId", trainController.getById.bind(trainController));

module.exports = router;