"use strict";

const express = require('express');

const userController = require('../controllers/userController');

const router = express.Router();

router.get('/users', userController.getUsers);
router.post('/user', userController.creatUser);
router.get('/user/:userId', userController.getUser);
router.put('/user/:userId', userController.updateUser);
router.delete('/user/:userId', userController.deleteUser);


module.exports = router;
