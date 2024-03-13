"use strict";

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const carteRoutes = require('./routes/carte');
const paquetRoutes = require('./routes/paquet');
const userRoutes = require('./routes/user');
const seed = require("./routes/db");
const app = express();

const port = 3000;

app.use(bodyParser.json()); // application/json

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'OPTIONS, GET, POST, PUT, PATCH, DELETE'
  );
  next();
});

app.use(carteRoutes);
app.use(paquetRoutes);
app.use(userRoutes);
app.use(seed);


app.use((error, req, res, next) => {
  console.log("Erreur:", error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

mongoose
  .connect('mongodb://127.0.0.1:27017/flashcard')
  .then(() => {
    app.listen(port);
		console.log("Serveur à l'écoute sur : http://localhost:" + port);

  })
  .catch(err => console.log(err));
