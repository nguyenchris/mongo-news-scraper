const express = require('express');
const router = express.Router();
const cheerio = require('cheerio');

router.get('/test', (req, res, next) => {
  res.json({
    test: 'hi'
  })
})

module.exports = router;