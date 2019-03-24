const express = require('express');
const db = require('../models/index');
const newsController = require('../controllers/news');
const router = express.Router();
const isAuth = require('../middleware/is-auth');

router.get('/scrape/:category', isAuth, newsController.getScrape);

module.exports = router;
