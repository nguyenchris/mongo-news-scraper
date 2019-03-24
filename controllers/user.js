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
  const submittedUSer = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422);
  }

  console.log(email);
  console.log(password);
  console.log(submittedUSer);
  db.User.findOne({
    email: email
  })
    .then(user => {
      console.log(user);
      if (user) {
        return res.json(false);
      }
      bcrypt
        .compare(password, user.password)
        .then(doMatch => {
          if (doMatch) {
            req.session.user = user;
            req.session.isLoggedIn = true;
            return req.session.save(() => {
              res.redirect('/');
            });
          }
          return res.status(422).json(false);
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
    return res.status(422);
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
      console.log(result);
      req.user = result;
      res.redirect('/');
    })
    .catch(err => {
      const error = new Error(err);
      console.log(error);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    if (err) {
      console.log(err);
    }
    res.redirect('/');
  });
};
