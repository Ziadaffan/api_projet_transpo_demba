"use strict";
const Carte = require("../models/carte");
const Paquet = require("../models/paquet");
const User = require("../models/user");
const Relation = require("../models/userCarte");
const gererException = require("../fonctions/fonctionsUtiles").gererException;
const compterNombreJour =
  require("../fonctions/fonctionsUtiles").compterNombreJour;

// Récupérer toutes les cartes
exports.getCartes = async (req, res, next) => {
  try {
    const cartes = await Carte.find();
    if (!cartes) {
      throw gererException("Aucune carte trouvée !", "CarteError", 404);
    }

    res.status(200).json(cartes);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

// Créer une nouvelle carte
exports.createCarte = async (req, res, next) => {
  try {
    const { question, reponse, paquetId } = req.body;

    if (!(await Paquet.findOne({ _id: paquetId })))
      throw gererException(
        `La paquet de l'ID ${paquetId} est introuvable`,
        "",
        404
      );
    if (reponse === question)
      throw gererException(
        "La réponse ne doit pas contenir la question",
        "",
        null
      );

    const carte = new Carte({ question, reponse, paquetId });
    const carteCreee = await carte.save();

    res.location("/carte/" + carteCreee.id);
    res.status(201).json(carteCreee);
  } catch (error) {
    if (error.name === "ValidationError") {
      error.statusCode = 400;
    }
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

// Obtenir une carte par son Id
exports.getCarte = async (req, res, next) => {
  try {
    const { carteId } = req.params;

    const carte = await Carte.findById(carteId);
    if (!carte) {
      throw gererException(
        `La carte de l'ID ${carteId} est introuvable`,
        "TypeError",
        404
      );
    }

    const carteInfo = {
      _id: carte._id,
      question: carte.question,
      reponse: carte.reponse,
      paquetId: carte.paquetId,
    };

    res.status(200).json(carteInfo);
  } catch (error) {
    if (error.name == "CastError") {
      error.message = `ID de carte invalide`;
      error.statusCode = 400;
    }

    if (!error.statusCode) {
      error.message = "Une erreur s'est produit en arrière";
      error.statusCode = 500;
    }

    next(error);
  }
};

// Update une carte par son Id
exports.updateCarte = async (req, res, next) => {
  try {
    const { carteId } = req.params;
    const { question, reponse, paquetId } = req.body;

    const carte = await Carte.findById(carteId);

    if (!carte) {
      throw gererException(
        `La carte de l'ID ${carteId} est introuvable`,
        "TypeError",
        404
      );
    }

    Object.assign(carte, { question, reponse, paquetId });
    const carteUpdated = await carte.save();

    res.status(200).json(carteUpdated);
  } catch (error) {
    if (!error.statusCode) {
      console.log(error.name);
      error.message = "Une erreur s'est produit en arrière";
      error.statusCode = 500;
    }
    next(error);
  }
};

// Supprimer une carte par son Id
exports.deleteCarte = async (req, res, next) => {
  try {
    const { carteId } = req.params;
    const carte = await Carte.findById(carteId);

    if (!carte) {
      throw gererException(
        `La carte de l'ID ${carteId} est introuvable`,
        "TypeError",
        404
      );
    }

    const deletedCarte = await carte.deleteOne();
    res.status(204).json(deletedCarte);
  } catch (error) {
    if (!error.statusCode) {
      console.log(error.name);
      error.message = "Une erreur s'est produit en arrière";
      error.statusCode = 500;
    }
    next(error);
  }
};

// Obtient une carte aléatoire pour l'utilisateur avec l'ID "idUser"
exports.getCarteAliatoire = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const relations = await Relation.find({ userId: userId });

    const carteIdsAvecRelation = relations.map((relation) =>
      relation.carteId.toString()
    );

    const cartesSansRelationAvecUser = await Carte.find({
      _id: { $nin: carteIdsAvecRelation },
    });

    const date = new Date();
    const relation = await Relation.find({
      $and: [{ userId: userId }, { dateProchaineRevision: { $lte: date } }],
    });

    const cartesAReviser = [];
    relation.forEach(async (element) => {
      const carte = await Carte.findById(element.carteId);
      cartesAReviser.push(carte);
    });

    const cartes = [...cartesSansRelationAvecUser, ...cartesAReviser];

    res.status(200).json(cartes[Math.floor(Math.random() * cartes.length)]);
  } catch (error) {
    if (!error.statusCode) {
      console.log(error.name);
      error.message = "Une erreur s'est produit en arrière";
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.createReponse = async (req, res, next) => {
  try {
    const { carteId, userId } = req.params;
    const date = new Date();

    if (!(await User.findById(userId)))
      throw new gererException(
        `Utilisateur de l'ID ${userId} non trouvé`,
        "UserError",
        404
      );

    if (!(await Carte.findById(carteId)))
      throw new gererException(
        `carte de l'ID ${carteId} introuvable`,
        "CarteError",
        404
      );

    let relation = await Relation.findOne({ carteId: carteId, userId: userId });
    let x = 0;

    if (req.body.reponse.toLowerCase() === "ok") {
      x = relation && relation.bonnesReponses ? relation.bonnesReponses + 1 : 1;
      if (x > 8) x = 8;
      date.setDate(date.getDate() + compterNombreJour(x));
    }

    if (relation) {
      relation.bonnesReponses = x;
      relation.dateProchaineRevision = date;
      await relation.save();
    } else {
      relation = new Relation({
        userId,
        carteId,
        bonnesReponses: x,
        dateProchaineRevision: date,
      });
      await relation.save();
      res.location(`/carte/${carteId}/${userId}`);
    }

    res.status(200).json(relation);
  } catch (error) {
    if (!error.statusCode) {
      error.message = "Une erreur s'est produit en arrière";
      error.statusCode = 500;
    }
    next(error);
  }
};
