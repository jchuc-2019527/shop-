'use strict'

const categoryController = require('../controllers/category.controller');
const express = require('express');
const mdAuth = require('../services/aunthenticated');
const api = express.Router();

api.get('/testCategory', categoryController.testCategory);
api.post('/addCategory', [mdAuth.ensureAuth, mdAuth.isAdmin], categoryController.addCategory);
api.get('/getCategories', [mdAuth.ensureAuth], categoryController.getCategories);
api.put('/updateCategory/:id', [mdAuth.ensureAuth, mdAuth.isAdmin], categoryController.updateCategory);
api.delete('/deleteCategory/:id', [mdAuth.ensureAuth, mdAuth.isAdmin], categoryController.deleteCategory);

module.exports = api;