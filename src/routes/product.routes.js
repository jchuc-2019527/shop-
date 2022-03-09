'use strict'

const productController = require('../controllers/product.controller');
const express = require('express');
const api = express.Router();
const mdAuth = require('../services/aunthenticated');

api.get('/testProduct', productController.testProduct);
api.post('/addProduct', [mdAuth.ensureAuth, mdAuth.isAdmin], productController.addProduct);
api.get('/getProducts', [mdAuth.ensureAuth], productController.getProducts);
api.get('/getProduct/:id', [mdAuth.ensureAuth], productController.getProduct);
api.put('/updateProduct/:id', [mdAuth.ensureAuth, mdAuth.isAdmin], productController.updateProduct);
api.delete('/deleteProduct/:id', [mdAuth.ensureAuth, mdAuth.isAdmin], productController.deleteProduct);
api.post('/getSolOutProducts', [mdAuth.ensureAuth], productController.getSolOutProducts);
api.post('/getMostSelledProducts', [mdAuth.ensureAuth], productController.getMostSelledProducts);
api.post('/searchProduct', [mdAuth.ensureAuth], productController.searchProduct);
api.post('/searchCategoryAndProduct', [mdAuth.ensureAuth], productController.searchCategoryAndProduct);

module.exports = api;