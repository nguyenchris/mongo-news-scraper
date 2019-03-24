const express = require('express');
const router = express.Router();

exports.getIndex = (req, res, next) => {
  res.render('/', {
    title: 'Home',
    isLoggedIn: true
  });
};
