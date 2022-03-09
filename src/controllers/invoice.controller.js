'use strict'

const ShoppingCart = require('../models/shoppingCart.model');
const Invoice = require('../models/invoice.model');
const moment = require('moment');
const {deleteSensitiveDataCart, checkCategories} = require('../utils/validate');
const Product = require('../models/product.model');
const Category = require('../models/category.model');
const User = require('../models/user.model');


exports.testInvoice = (req, res) => {
    return res.send({message: 'Function testInvoice is running...'});
}

exports.buyShoppingCart = async (req, res) => { //Comprar lo agregado al carrito de compras (shoppingCart)
    try {
        const carts = await ShoppingCart.find({ user: req.user.sub }).populate('product').lean();
        if(carts.length === 0) return res.send({message: 'ShoppingCart not found'})
        const clearCarts = [];
        for (const cart of carts) {
            var date = moment();
            const price = cart.product.price;
            const quantity = cart.quantity;
            var subTotal = price * quantity;
            if (!invoice) {
                var total = subTotal;
            } else {
                var sub = invoice.total;
                var total = sub + subTotal;
            }
            if(!numInvoice){
                const searchInvoice = await Invoice.find().lean();
                var searchs = []
                for(let search of searchInvoice){
                    var num = search.NoInvoice;
                    searchs.push(num);
                }
                var max = Math.max.apply(null, searchs);
                var No = await Invoice.findOne({NoInvoice: max}).lean();
                if(!No){ 
                    var numInvoice = 1
                }else{
                    var numero = No.NoInvoice;
                    var numInvoice = numero+1;
                }
                 
            }else{}
            var invoice = new Invoice({ date: 
                date, user: 
                cart.user, shoppingCart: 
                cart._id, product: 
                cart.product, category: 
                cart.product.category,quantity: 
                cart.quantity, subTotal: 
                subTotal, total: 
                total, NoInvoice: 
                numInvoice });
            await invoice.save();
            var bills = await Invoice.find({ date: date }).populate('user').populate('product').populate('category').lean();
            for (let bill of bills)
                clearCarts.push(await deleteSensitiveDataCart(bill));
        }
        await ShoppingCart.deleteMany({ user: req.user.sub });
        
        return res.send(clearCarts);
    } catch (err) {
        console.log(err);
        return err;
    }
}

exports.updateInvoice = async (req, res) => {
    try {
        const invoiceId = req.params.id;
        const params = req.body;
        const searchInvoice = await Invoice.findOne({ _id: invoiceId }).populate('product').lean();
        if (!searchInvoice) return res.send({ message: 'Invoice not found' });
        const notUpdate = await checkCategories(params);
        if (notUpdate === false) return res.status(400).send({ message: 'Data not received' });
        const searchProduct = await Product.findOne({ _id: params.product }).lean();
        if (!searchProduct) return res.send({ message: 'Product not found' });
        if (params.quantity) { 
            if (params.quantity < searchInvoice.quantity) {

                const resultado = searchInvoice.quantity - params.quantity;
                if (resultado > searchProduct.stock) return res.send({ message: 'Not in stock' });
                var stock = searchProduct.stock + resultado;
            }else{} 
            if (searchInvoice.quantity < params.quantity) {
                const qup = params.quantity;
                const qu = searchInvoice.quantity;
                const resultado = qup - qu;
                if (resultado > searchProduct.stock) return res.send({ message: 'Not in stock' });
                var stock = searchProduct.stock - resultado;
            } else {}
            await Product.findOneAndUpdate({ _id: params.product }, { stock: stock }, { new: true });
            const invoiceUpdated = await Invoice.findOneAndUpdate({ _id: invoiceId }, {
                date: params.date, user: params.user, product: params.product, category: searchProduct.category,
                quantity: params.quantity, subTotal: params.subTotal, total: params.total
            }, { new: true }).populate('user').populate('product').populate('category').lean();
            
            return res.send({message: 'Invoice updated', invoiceUpdated})

        } else {
            const invoiceUpdated = await Invoice.findOneAndUpdate({ _id: invoiceId }, {
                date: params.date, user: params.user, product: params.product, category: searchProduct.category,
                 subTotal: params.subTotal, total: params.total
            }, { new: true }).populate('user').populate('product').populate('category').lean();;
            return res.send({message: 'Invoice updated', invoiceUpdated})
        }
    } catch (err) {
        console.log(err);
        return err;
    }
}

exports.getInvoiceUser = async (req, res) => { //Ver las facturas por usuario
    try {
        const userId = req.params.id;
        const searchId = await User.findOne({_id: userId});
        if(!searchId) return res.send({ message: 'User not found'});
        const invoice = await Invoice.find({user: userId})
        .populate('user')
        .populate('product')
        .populate('category')
        .lean();
        if(invoice.length === 0) return res.send({ message: 'The user not have invoices'});
        return res.send(invoice);    
    }catch (err) {
        console.log(err);
        return err;
    }
}

exports.getInvoiceProducts = async (req, res) => {
    try {
        const NoInvoice = req.params.id;
        const searchInvoice = await Invoice.find({ NoInvoice: NoInvoice });
        if(searchInvoice.length === 0)return res.send({message: 'Invoices not found'});
        if (!searchInvoice) return res.send({ message: 'Invoices not found' });
        const bill = await Invoice.find({ NoInvoice: NoInvoice })
        .populate('user')
        .populate('product')
        .populate('category')
        .lean();
        return res.send(bill);
    } catch (err) {
        console.log(err);
        return err;
    }
}