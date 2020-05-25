const express = require("express");
const router = express.Router();
const authorize = require('../middlewares/authorization.js');
const userController = require('../controllers/userController');
const validateRegister = require("../middlewares/userRegisterValidation");

router.post('/register', validateRegister, userController.register);
router.post('/login', userController.login);
router.put('/:id', authorize, userController.update);
router.delete('/:id', authorize, userController.delete);

router.get('/my-account', authorize, userController.getUserDetails);

router.post('/sms', authorize, userController.sendSms);

module.exports = router;