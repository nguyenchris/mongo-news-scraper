const express = require('express');
const router = express.Router();
const cheerio = require('cheerio');
const axios = require('axios');
const db = require('../models/index');
const fs = require('fs');
const moment = require('moment');

// Cateogries: Sports, travel, realestate, us, world, business, technology, science, food, health, jobs, politics

router.get('/scrape/:category', (req, res, next) => {
  const category = req.params.category;
  console.log(category);
  const articles = [];
  axios
    .get(`https://www.nytimes.com/section/${category}`)
    .then(res => {
      const $ = cheerio.load(res.data, {
        normalizeWhitespace: true
      });

      $('.css-ye6x8s').each(function() {
        const article = {};
        article.category = category;
        let title = $(this)
          .find('h2')
          .text();
        if (title) {
          article.title = title;
        } else {
          return;
        }

        let summary = $(this)
          .find('.css-1echdzn')
          .text();
        if (summary) {
          article.summary = summary;
        } else {
          return;
        }

        let image = $(this)
          .find('figure')
          .attr('itemid');
        let modImage;
        if (image) {
          image.includes('thumbWide')
            ? (modImage = image.replace('thumbWide', 'superJumbo'))
            : (modImage = image);

          modImage.includes('quality=30')
            ? (image = modImage.replace('quality=30', 'quality=100'))
            : (image = modImage);
          article.image = image;
        } else {
          return;
        }

        let link = $(this)
          .find('a')
          .attr('href');
        article.link = `https://www.nytimes.com${link}`;

        let author = $(this)
          .find('.css-1n7hynb')
          .text();
        if (author) {
          article.author = author;
        } else {
          return;
        }

        db.Article.create(article)
          .then(result => {
            if (result) {
              articles.push(result);
            }
          })
          .catch(err => {
            next(err);
          });
      });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
});

module.exports = router;
