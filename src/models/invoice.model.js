'use strict'

const mongoose =  require('mongoose');
const invoiceSchema = mongoose.Schema({
    date: Date,
    quantity: Number,
    subtotal: Number,
    total: Number,
    shoppingCart: {type: mongoose.Schema.ObjectId, ref: 'ShoppingCart'},
    user: {type: mongoose.Schema.ObjectId, ref: 'User'},
    product: {type: mongoose.Schema.ObjectId, ref: 'Product'},
    category: {type: mongoose.Schema.ObjectId, ref: 'Category'},
});

module.exports = mongoose.model('Invoice', invoiceSchema);
