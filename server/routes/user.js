const express = require("express");
const router = express.Router();
const authorize = require('../middlewares/authorization.js');
const userController = require('../controllers/userController');
const validateRegister = require("../middlewares/userRegisterValidation");

router.post('/register', validateRegister, userController.register);
router.post('/login', userController.login);

router.get('/my-account', authorize, userController.getUserDetails);
router.get('/secret-route', authorize, (req, res, next) => {
    res.send('This is the secret content. Lucky you, only logged in users can see that!');
});

module.exports = router;