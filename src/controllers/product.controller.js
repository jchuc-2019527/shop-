'use strict'

const {validateData, checkPermission} = require('../utils/validate');
const Product = require('../models/product.model');
const Category = require('../models/category.model');

exports.testProduct = async (req, res) => {
    try {
        return res.send({message: 'TestProduct is running...'});
    }catch(err) {
        console.log(err);
        return err;
    }
}

exports.addProduct = async (req, res) => {
    try{
        const params = req.body;
        const data = {
            name: params.name,
            stock: params.stock,
            sales: 0,
            price: params.price,
            status: params.status,
            aditional: params.aditional,
            category: params.category
        };
        const msg = validateData(data);
        if(!msg) {
            data.description =params.description;
            const product = new Product(data);
            await product.save();
            return res.send({message: 'Product saved successfully.'});
        }else return res.status(400).send(msg);
    }catch(err) {
        console.log(err);
        return err;
    }
}

exports.getProducts = async (req, res) => {
    try{
        const products = await Product.find();
        return res.send({products});
    }catch(err) {
        console.log(err);
        return err;
    }
}

exports.getProduct = async (req, res) => {
    try{
        const productId = req.params.id;
        const product = await Product.findOne({_id: productId});
        if(!product) return res.send({message: 'Product is not found.'});
        return res.send({product});
    }catch(err) {
        console.log(err);
        return err;
    }
}

exports.updateProduct = async (req, res) => {
    try{
        const params = req.body;
        const data = {
            name: params.name,
            stock: params.stock,
            sales: params.sales,
            price: params.price,
            status: params.status,
            description: params.description
        };
        const productId = req.params.id;
        const searchProduct = await Product.findOne({_id: productId});
        const userId = searchProduct.user;
        const msg = validateData(data);
        if(msg) return res.send(msg);
        const permission = await checkPermission (userId, req.user.sub);
        if(permission === true) return res.status(401).send({message: 'Unauthorized to update this product.'});
        const product = await Product.findOneAndUpdate({_id: productId}, data, {new: true});
        return res.send({product});
    }catch(err){
        console.log(err);
        return err;
    }
}

exports.deleteProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const productDeleted = await Product.findOneAndDelete({_id: productId});
        if(!productDeleted) return res.status(500).send({message: 'Animal not found or already deleted.'});
        return res.send({productDeleted, message: 'Product deleted.'});
    }catch(err) {
        console.log(err);
        return err;
    }
}

exports.getSolOutProducts = async (req, res) => { //Producto Agotado
    try {
        const params= req.body;
        const data = {
            status: params.status
        };
        const msg = validateData(data);
        if(!msg) {
            const product = await Product.find({status: {$regex:params.status, $options: 'i'}});
            return res.send({product});
        } else return res.status(400).send(msg);
    }catch(err) {
        console.log(err);
        return err;
    }
}

exports.getMostSelledProducts = async (req, res) => {
    try {
        const params = req.body;
        const data = {
            aditional: params.aditional
        };
        const msg = validateData(data);
        if(!msg) {
            const product = await Product.find({aditional: {$regex:params.aditional, $options: 'i'}});
            return res.send({product});
        }else return res.status(400).send(msg);
    }catch(err) {
        console.log(err);
        return err;
    }
}

exports.searchProduct = async (req, res) => {
    try{
        const params = req.body;
        const data = {
            name: params.name
        };
        const msg = validateData(data);
        if(!msg) {
            const product = await Product.find({name: {$regex: params.name, $options: 'i'}});
            return res.send({product});
        }else return res.status(400).send(msg);
    }catch(err) {
        console.log(err);
        return err;
    }
}
exports.searchCategoryAndProduct = async (req, res) => {
    try{
        const params = req.body;
        const data = {
            category: params.category
        };
        const msg = validateData(data);
        if(!msg) {
            const products = await Product.find({category: params.category})
            .populate('category');
            return res.send({message: 'Products' ,products});
        }else return res.status(400).send(msg);
        //delete data.products._id;
        //products.category.name = undefined;
        
    }catch(err){
        console.log(err);
        return err;
    }
}