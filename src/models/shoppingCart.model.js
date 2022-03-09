'use strict'

const mongoose = require('mongoose');
const shoppingCartSchema = mongoose.Schema({
    quantity: Number,
    user: {type: mongoose.Schema.ObjectId, ref: 'User'},
    product: {type: mongoose.Schema.ObjectId, ref: 'Product'}
});
module.exports = mongoose.model('ShoppingCart', shoppingCartSchema);