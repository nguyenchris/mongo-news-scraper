const express = require('express');
const cheerio = require('cheerio');
const axios = require('axios');
const db = require('../models/index');
const fs = require('fs');
const moment = require('moment');

// Cateogries: Sports, travel, realestate, us, world, business, technology, science, food, health, jobs, politics

exports.getScrape = (req, res, next) => {
  const category = req.params.category;
  const articlesArr = [];
  axios
    .get(`https://www.nytimes.com/section/${category}`)
    .then(response => {
      const $ = cheerio.load(response.data, {
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
            ? (modImage = image.replace('thumbWide', 'threeByTwoSmallAt2X'))
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

        articlesArr.push(article);

        db.Article.create(article)
          .then(result => {
            console.log(result);
          })
          .catch(err => {
            console.log(err);
          });
      });
      res.json(articlesArr);
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.getNews = (req, res, next) => {
  const currentPage = req.query.page || 1;
  const category = req.params.category;
  const perPage = 9;
  let totalArticles;
  db.Article.find({ category: category })
    .sort({ createdAt: -1 })
    .count()
    .then(count => {
      console.log(count);
      totalArticles = count;
      return db.Article.find({ category: category })
        .skip((currentPage - 1) * perPage)
        .limit(perPage);
    })
    .then(articles => {
      console.log('LENGTH', Date.now(articles[2].createdAt));
      res.status(200).json({
        message: 'Success',
        articles: articles,
        totalArticles: totalArticles
      });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
