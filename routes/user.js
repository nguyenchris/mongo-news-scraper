const express = require('express');
const { body } = require('express-validator/check');
const db = require('../models/index');
const userController = require('../controllers/user');
const router = express.Router();

router.get('/login', userController.getLogin);
router.get('/signup', userController.getSignup);

router.post(
  '/login',
  [
    body('email')
      .isEmail()
      .withMessage('Please enter a valid email address.')
      .normalizeEmail(),
    body('password').trim()
  ],
  userController.postLogin
);

router.post(
  '/signup',
  body('email').isEmail(),
  body('password').trim(),
  userController.postSignup
);

router.get('/logout', userController.getLogout);

module.exports = router;
