const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator/check');
const db = require('../models/index');

exports.getLogin = (req, res, next) => {
  res.render('login', {
    activeLogin: true,
    path: '/login',
    title: 'Login'
  });
};

exports.getSignup = (req, res, next) => {
  res.render('signup', {
    title: 'Signup',
    activeSignup: true
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const submittedUser = req.body;
  const errorMsg = {
    error: 'Email or password is incorrect.'
  };

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ error: errors.array()[0].msg });
  }
  if (!submittedUser) {
    return res.status(422).json(errorMsg);
  }

  db.User.findOne({
    email: email
  })
    .then(user => {
      if (!user) {
        return res.status(422).json(errorMsg);
      }
      bcrypt
        .compare(password, user.password)
        .then(doMatch => {
          if (doMatch) {
            req.session.user = user;
            req.session.isLoggedIn = true;
            return res.status(201).json('Success');
          }
          return res.status(422).json(errorMsg);
        })
        .catch(err => {
          console.log(err);
          res.redirect('/login');
        });
    })
    .catch(err => {
      const error = new Error(err);
      console.log(error);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  const name = req.body.name;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors.array());
    return res.status(422).json({ error: errors.array()[0].msg });
  }

  db.User.findOne({
    email: email
  })
    .then(fetchedUser => {
      if (fetchedUser) {
        return res.status(422).json({ error: 'Email is already taken.' });
      }
      bcrypt
        .hash(password, 10)
        .then(hashedPassword => {
          const user = new db.User({
            name: name,
            email: email,
            password: hashedPassword
          });
          return user.save();
        })
        .then(result => {
          req.session.user = result;
          req.session.isLoggedIn = true;
          res.status(201).json('Success');
        });
    })
    .catch(err => {
      const error = new Error(err);
      console.log(error);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getLogout = (req, res, next) => {
  req.session.destroy(err => {
    if (err) {
      console.log(err);
    }
    res.redirect('/');
  });
};
