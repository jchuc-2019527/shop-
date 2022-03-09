'use strict'

const userController = require('../controllers/user.controller');
const express = require('express');
const api = express.Router();
const mdAuth = require('../services/aunthenticated');

api.get('/testUser', userController.testUser);
api.post('/register', userController.register);
api.post('/login', userController.login);
api.put('/update/:id', [mdAuth.ensureAuth], userController.update);
api.delete('/delete/:id', [mdAuth.ensureAuth], userController.delete);
api.post('/addShoppingCart', [mdAuth.ensureAuth], userController.addShoppingCart);

module.exports = api;