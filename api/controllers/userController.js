"use strict";

const User = require("../models/user");
const gererException = require("../fonctions/fonctionsUtiles").gererException;

// Récupérer tous les utilisateurs
exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    if (!users) {
      throw gererException("Aucun utilisateur trouvé !", "UserError", 404);
    }
    res.status(200).json(users);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

// Créer un utilisateur
exports.creatUser = async (req, res, next) => {
  try {
    const { nom, prenom, courriel } = req.body;

    const utilisateur = new User({ nom, prenom, courriel });
    const utilisateurCree = await utilisateur.save();
    res.location("/user/" + utilisateurCree.id);
    res.status(201).json(utilisateurCree);
  } catch (err) {
    if (err.name === "ValidationError") {
      err.statusCode = 400;
    }
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

// Obtenir un utilisateur par son Id
exports.getUser = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const utilisateur = await User.findById(userId);

    if (!utilisateur) {
      throw gererException(`utilisateur de l'ID ${userId} est introuvable!`, "UserError", 404);
    }
    res.status(200).json(utilisateur);
  } catch (err) {
    if (err.name == "CastError") {
      err.message = "ID d'utilisateur invalide";
      err.statusCode = 400;
    }
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

//Update un User
exports.updateUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { nom, prenom, courriel } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      throw gererException(`utilisateur de l'ID ${userId} est introuvable!`, "UserError", 404);
    }

    Object.assign(user, { nom, prenom, courriel });
    const userUpdated = await user.save();

    res.status(200).json(userUpdated);
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

// Delete un utilisateur
exports.deleteUser = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);

    if (!user) {
      throw gererException(`utilisateur de l'ID ${userId} est introuvable!`, "UserError", 404);
    }
    const deletedUser = await user.deleteOne();
    res.status(204).json(deletedUser);
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};
