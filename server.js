const express = require('express');
const path = require('path');
const helmet = require('helmet');
const compression = require('compression');
const expressHbs = require('express-handlebars');
// const logger = require('morgan');
const mongoose = require('mongoose');

const apiRoutes = require('./controllers/api');

const app = express();

const PORT = process.env.PORT || 3000;

const MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://localhost/mongo-scraper';

// app.use(helmet());
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

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/login', (req, res) => {
  res.render('login');
});
app.use('/api', apiRoutes);

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

mongoose
  .connect(MONGODB_URI, { useNewUrlParser: true })
  .then(res => {
    app.listen(PORT, () => {
      console.log(`Listening to port ${PORT}`);
    });
  })
  .catch(err => console.log(err));
