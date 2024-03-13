"use strict";

const express = require('express');

const paquetController = require('../controllers/paquetController');

const router = express.Router();

router.get('/paquets', paquetController.getPaquets);
router.get('/paquets/recherche/:mot', paquetController.getPaquetMot);
router.post('/paquet', paquetController.createPaquet);
router.get('/paquet/:paquetId', paquetController.getPaquet);
router.put('/paquet/:paquetId', paquetController.updatePaquet);
router.delete('/paquet/:paquetId',paquetController.deletePaquet);



module.exports = router;
