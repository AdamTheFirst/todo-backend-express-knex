const express = require("express");
const router = express.Router();
const controller = require('../controller/auth-controller')

router.post('/register', controller.registerUser);
router.post('/register-org', controller.registerOrg);
router.post('/login', controller.login);

module.exports = router;