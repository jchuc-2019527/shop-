'use strict'

const invoiceController = require('../controllers/invoice.controller');
const express = require('express');
const api = express.Router();
const mdAuth = require('../services/aunthenticated');
const { get } = require('express/lib/response');

api.get('/testInvoice', invoiceController.testInvoice);
api.get('/buyShoppingCart', [mdAuth.ensureAuth],invoiceController.buyShoppingCart);
api.put('/updateInvoice/:id', [mdAuth.ensureAuth, mdAuth.isAdmin],invoiceController.updateInvoice);
api.get('/getInvoiceUser/:id', [mdAuth.ensureAuth, mdAuth.isAdmin], invoiceController.getInvoiceUser);
api.get('/getInvoiceProducts/:id', [mdAuth.ensureAuth, mdAuth.isAdmin], invoiceController.getInvoiceProducts)

module.exports = api;