const express = require('express');
const newsController = require('../controllers/news');
const router = express.Router();
const isAuth = require('../middleware/is-auth');

router.get('/scrape/:category', isAuth, newsController.getScrape);
router.get('/:category', isAuth, newsController.getNews);
// router.get()

module.exports = router;
