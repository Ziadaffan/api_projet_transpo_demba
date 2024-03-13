"use strict";

const Paquet = require("../models/paquet");
const gererException = require("../fonctions/fonctionsUtiles").gererException;
const Carte = require("../models/carte");

// Récupérer tous les paquets
exports.getPaquets = async (req, res, next) => {
  try {
    const paquets = await Paquet.find();
    if (!paquets)
      throw gererException("Aucun paquet trouvé !", "PaquetError", 404);

    res.status(200).json(paquets);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

// Créer un nouveau paquet
exports.createPaquet = async (req, res, next) => {
  try {
    const { nom, description, userId } = req.body;

    const paquet = new Paquet({
      nom,
      description,
      userId,
    });

    const paquetCree = await paquet.save();
    res.location("/paquet/" + paquetCree.id);
    res.status(201).json(paquetCree);
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

// Récupérer une paquets par son Id
exports.getPaquet = async (req, res, next) => {
  try {
    const { paquetId } = req.params;

    const paquet = await Paquet.findById(paquetId);
    const cartes = await Carte.find({ paquetId: paquetId });

    if (!paquet) {
      throw gererException(
        `Le paquet de l'ID ${paquetId} est introuvable`,
        "PaquetError",
        404
      );
    }
    res.status(200).json({ paquet, cartes });
  } catch (err) {
    if (err.name == "CastError") {
      err.message = "ID de paquet invalide";
      err.statusCode = 400;
    }
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

// Update une paquet
exports.updatePaquet = async (req, res, next) => {
  try {
    const { paquetId } = req.params;
    const { nom, description } = req.body;

    const paquet = await Paquet.findById(paquetId);

    if (!paquet) {
      throw gererException(
        `Le paquet de l'ID ${paquetId} est introuvable`,
        "PaquetError",
        404
      );
    }

    Object.assign(paquet, { nom, description });
    const updatedPaquet = await paquet.save();

    res.status(200).json(updatedPaquet);
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

// Delet une paquet
exports.deletePaquet = async (req, res, next) => {
  try {
    const { paquetId } = req.params;
    const paquet = await Paquet.findById(paquetId);

    if (!paquet) {
      throw gererException(
        `Le paquet de l'ID ${paquetId} est introuvable`,
        "PaquetError",
        404
      );
    }
    
    const deletedPaquet = await paquet.deleteOne();
    res.status(204).json(deletedPaquet);
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.getPaquetMot = async (req, res, next) => {
  try {
    const { mot } = req.params;
    const reg = new RegExp(mot, "i");
    const paquets = await Paquet.find({ nom: { $regex: reg } }).sort({
      createdAt: 1,
    });

    if (paquets.length == 0) {
      throw gererException("Aucune paquet trouvé!", "PaquetError", 404);
    }

    res.status(200).json(paquets);
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};
