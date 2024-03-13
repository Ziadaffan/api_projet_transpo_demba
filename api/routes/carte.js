"use strict";

const express = require('express');
const carteController = require('../controllers/carteController');
const router = express.Router();

router.get('/cartes', carteController.getCartes);
router.post('/carte', carteController.createCarte);
router.get('/carte/:carteId', carteController.getCarte);
router.put('/carte/:carteId', carteController.updateCarte);
router.delete('/carte/:carteId', carteController.deleteCarte);
router.get('/carteAleatoire/:userId', carteController.getCarteAliatoire);
router.post('/carte/:carteId/:userId/reponse',carteController.createReponse);

module.exports = router;
