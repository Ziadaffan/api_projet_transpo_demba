"use strict";

const Carte = require("../models/carte");
const Paquet = require("../models/paquet");
const User = require("../models/user");
const UserCarteRelation = require("../models/userCarte");

const cartes = require("../seeds/cartes");
const paquets = require("../seeds/paquets");
const users = require("../seeds/users");
const userCarteRelations = require("../seeds/userCarteRelations");

exports.seed = async (req, res, next) => {
  const result = {};

  try {
    await Promise.all([
      Paquet.deleteMany(),
      Carte.deleteMany(),
      User.deleteMany(),
      UserCarteRelation.deleteMany(),
    ]);

    const [usersInsert, paquetsInsert, cartesInsert, userCarteInsert] = await Promise.all([
      User.insertMany(users),
      Paquet.insertMany(paquets),
      Carte.insertMany(cartes),
      UserCarteRelation.insertMany(userCarteRelations),
    ]);

    if (cartesInsert.length > 0) {
      result.cartes = cartesInsert;
    }

    if (paquetsInsert.length > 0) {
      result.paquets = paquetsInsert;
    }

    if (usersInsert.length > 0) {
      result.users = usersInsert;
    }

    if (userCarteInsert.length > 0) {
      result.userCarteRelations = userCarteInsert;
    }

    res.status(200).json(result);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};