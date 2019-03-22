const express = require('express');
const path = require('path');
const helmet = require('helmet');
const compression = require('compression');
const logger = require('morgan');
const mongoose = require('mongoose');

const apiRoutes = require('./controllers/api');

const app = express();

const PORT = process.env.PORT || 3000;


// app.use(helmet());
app.use(logger('dev'))
app.use(
  express.urlencoded({
    extended: true
  })
);
app.use(express.json());

app.use(express.static(path.join(__dirname, '/dist')));

app.get('/', (req, res) => {
  res.sendFile('index.html');
});

app.use('/api', apiRoutes);


mongoose
  .connect('mongodb://localhost/unit18Populater', { useNewUrlParser: true })
  .then(res => {
    app.listen(PORT, () => {
      console.log(`Listening to port ${PORT}`);
    });
  })
  .catch(err => console.log(err));
