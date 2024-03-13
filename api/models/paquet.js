"use strict";

const mongoose = require("mongoose");

// Créer un schéma pour les paquets
const paquetSchema = new mongoose.Schema(
  {
    nom: {
      type: String,
      required: [true, "le nom ne peut pas etre vide"],
      minlength: [3, "Le nom doit contenir au moins 3 caractères"],
      maxlength: [50, "Le nom doit contenir au plus 50 caractères"],

      validate: {
        validator: async function (nom) {
          const paquetExist = await mongoose.models.Paquet.findOne({
            nom: nom,
          });
          return !paquetExist;
        },
        message: "Le nom de paquet existe déjà",
      },
    },
    description: {
      type: String,
      required:[true,"Le paquet ne peut pas etre vide"]
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "userId ne peut pas etre vide"],

      validate: {
        validator: async function (userId) {
          const paquetExisteAvecMemeUser = await mongoose.models.Paquet.findOne(
            {
              userId: userId,
            }
          );
          return !paquetExisteAvecMemeUser;
        },
        message: "Le paquet existe deja par le meme User",
      }
    },
  },
  {
    timestamps: true,
  }
);

// Créer un modèle à partir du schéma
module.exports = mongoose.model("Paquet", paquetSchema);
