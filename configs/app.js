'use strict'
const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const cors = require('cors');
const categoryRoutes = require('../src/routes/category.routes');
const invoiceRoutes = require('../src/routes/invoice.routes');
const productRoutes = require('../src/routes/product.routes');
const userRoutes = require('../src/routes/user.routes');
const { application } = require('express');
const app = express();
app.use(helmet());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use('/category', categoryRoutes);
app.use('/invoice', invoiceRoutes);
app.use('/product', productRoutes);
app.use('/user', userRoutes);

module.exports = app;

