const express = require('express');

const photoRouter = require('./routes/photo.route');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/photo', photoRouter);

module.exports = app;
