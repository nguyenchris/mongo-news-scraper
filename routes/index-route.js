const express = require('express');
const router = express.Router();
const indexController = require('../controllers/index');
const isAuth = require('../middleware/is-auth');

router.get('/', isAuth, indexController.getIndex);

module.exports = router;
