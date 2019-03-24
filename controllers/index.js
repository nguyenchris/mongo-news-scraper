const express = require('express');
const router = express.Router();

exports.getIndex = (req, res, next) => {
  res.render('index', {
    title: 'Home',
    isLoggedIn: true
  });
};
