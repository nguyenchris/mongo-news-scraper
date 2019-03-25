const express = require('express');
const path = require('path');
const helmet = require('helmet');
const compression = require('compression');
const expressHbs = require('express-handlebars');
// const logger = require('morgan');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const db = require('./models/index');
const newsRoutes = require('./routes/news');
const userRoutes = require('./routes/user');
const indexRoute = require('./routes/index-route');
// const Promise = require('bluebird');
// Promise.promisifyAll(require('mongoose'));

const app = express();

const PORT = process.env.PORT || 3000;
require('dotenv').config();

const MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://localhost/mongo-scraper';

const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions'
});

app.use(helmet());
// app.use(logger('dev'));
app.engine(
  'hbs',
  expressHbs({
    layoutsDir: 'views/layouts/',
    defaultLayout: 'main-layout',
    extname: 'hbs'
  })
);
app.set('view engine', 'hbs');

app.use(
  express.urlencoded({
    extended: true
  })
);
app.use(express.json());
app.use(express.static(path.join(__dirname, '/dist')));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: store
  })
);

app.use((req, res, next) => {
  res.locals.isLoggedIn = req.session.isLoggedIn;
  console.log(req.session.isLoggedIn);
  next();
});

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  db.User.findById(req.session.user._id)
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => {
      next(err);
    });
});

app.use(indexRoute);
app.use('/news', newsRoutes);
app.use(userRoutes);

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ error: message, data: data });
});

mongoose
  .connect(MONGODB_URI, { useNewUrlParser: true })
  .then(res => {
    app.listen(PORT, () => {
      console.log(`Listening to port ${PORT}`);
    });
  })
  .catch(err => console.log(err));
