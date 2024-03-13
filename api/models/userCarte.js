"use strict";

const mongoose = require("mongoose");
const date = new Date();

const userCarteRelationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  carteId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Carte",
  },
  bonnesReponses: {
    type: Number,
    default:0
  },
  dateProchaineRevision: {
    type: Date,
    default: date.setDate(date.getDate())
  },
});

module.exports = mongoose.model("UserCarteRelation", userCarteRelationSchema);
