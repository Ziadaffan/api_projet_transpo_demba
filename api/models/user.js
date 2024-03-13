"use strict";

const mongoose = require("mongoose");

// Créer un schéma pour les users
const userSchema = new mongoose.Schema(
  {
    nom: {
      type: String,
      required: [true, "Le nom ne peut pas etre vide"],
      minlength: [3, "Le nom doit contenir au moins 3 caractères"],
      maxlength: [50, "Le nom doit contenir au plus 50 caractères"],
    },
    prenom: {
      type: String,
      required: [true, "Le prenom ne peut pas etre vide"],
      minlength: [3, "Le prenom doit contenir au moins 3 caractères"],
      maxlength: [50, "Le prenom doit contenir au plus 50 caractères"],
    },
    courriel: {
      type: String,
      required: [true, "Le courriel ne peut pas etre vide"],
      validate: [
        {
          validator: async function (courriel) {
            const courielExist = await mongoose.models.User.findOne({
              courriel: courriel,
            });
            return !courielExist;
          },
          message: "Le courriel de ce user existe déjà",
        },
        {
          validator: function (v) {
            return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(v);
          },
          message: (props) => `${props.value} n'est pas un courriel valide!`,
        },
      ],
    },
    relationsCartes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserCarteRelation",
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Créer un modèle à partir du schéma
module.exports = mongoose.model("User", userSchema);
