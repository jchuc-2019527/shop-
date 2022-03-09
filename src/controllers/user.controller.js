'use strict'

const User = require('../models/user.model');
const Product = require('../models/product.model');
const Category = require('../models/category.model');
const ShoppingCart = require('../models/shoppingCart.model');
const Invoice = require('../models/invoice.model');

const {validateData, searchUser, encrypt, checkPassword, checkPermission, checkUpdate, deleteSensitiveDataCart} = require('../utils/validate');
const jwt = require('../services/jwt');

exports.testUser = (req, res) => {
    return res.send({message: 'Function testUser is running...'});
}
exports.register = async (req, res) => {
    try{
        const params = req.body;
        const data = {
            name: params.name,
            surname: params.surname,
            username: params.username,
            password: params.password,
            email: params.email,
            role: 'CLIENT'
        }
        const msg = validateData(data);
        if(!msg) {
            let userExist = await searchUser(params.username);
            if(!userExist) {
                data.phone = params.phone;
                data.password = await encrypt(params.password);
                let user = new User(data);
                await user.save();
                return res.send({message:'Data recived, user created successfully.'});
            }else {
                return res.send({message: 'Data is not recived, username already exists, choose another username...'});
            }
        }else {
            return res.status(400).send(msg);
        }
    }catch(err){
        console.log(err);
        return err;
    }
}
exports.login = async (req, res) => {
    try {
        const params = req.body;
        const data = {
            username: params.username,
            password: params.password
        }
        let msg = validateData(data);
        if(!msg) {
            let userExist = await searchUser(params.username);
            if(userExist && await checkPassword(params.password, userExist.password)) {
                const searchCategory = await Category.findOne({name: 'default'});
                if(searchCategory){} else{
                    const category = new Category({name:'default'});
                    await category.save();
                }
                const invoices = await Invoice.find({username: userExist._id})
                .populate('user')
                .populate('product')
                .populate('category')
                .lean();
                const token = await jwt.createToken(userExist);
                if(invoices.length === 0) return res.send({message: 'Login suiccesfully', token});
                const clear= [];
                for(let invoice of invoices) {
                    clear.push(await deleteSensitiveDataCart(invoice));
                }//return res.send({message: 'Login suiccesfully', token, invoices});
                return res.send({ token, invoices, message: 'Login succesfully.'})
            }else{
                return res.send({message: 'Username or password incorrect.'})
            }
        }else{
            return res.status(400).send(msg);
        }
    }catch(err) {
        console.log(err);
        return err;
    }
}
exports.update = async (req, res) => {
    try {
        const userId = req.params.id;
        const params = req.body;
        const permission = await checkPe
            const notUpdate = await rmission(userId, req.user.sub);
        if(permission === false) return res.status(403).send({ message:'Unauthorized to update this user...'});
        else {checkUpdate(params);
            if(notUpdate === false) return res.status(400).send({message: 'This params can only update by ADMIN.'});
            const already = await searchUser(params.username);
            if(!already) {
                const userUpdate = await User.findOneAndUpdate({_id: userId}, params, {new: true}).lean();
                return res.send({userUpdate, message: 'User updated.'});
            }else{
                return res.send({message: 'Username already used...'});
            }
        }
    }catch(err) {
        console.log(err);
        return err;
    }
}
exports.delete = async (req, res) => {
    try {
        const userId = req.params.id;
        const permission = await checkPermission(userId, req.user.sub);
        if(permission === false) return res.status(403).send({message: 'Action to nauthorized...'});
        const userDeleted = await User.findOneAndDelete({_id: userId});
        if(userDeleted) return res.send({userDeleted, message: 'Account deleted.'});
        return res.send({userDeleted, message: 'User not found or already deleted'});
    }catch(err) {
        console.log(err);
        return err;
    }
}

exports.addShoppingCart = async (req, res) => {// agregar al carrito de compras 
    try {
        const params = req.body;
        const data = {
            quantity: params.quantity,
            user: req.user.sub,
            product: params.product
        };
        const msg = validateData(data);
        if(!msg) {
            const searchProduct = await Product.findOne({_id: data.product}).lean();
            if(!searchProduct) return res.send({message: 'Product not found'});
            if(data.quantity > searchProduct.stock) return res.send({message: 'Quantity exceeds stock'});
            const addCart = new ShoppingCart(data);
            await addCart.save();
            const stock = searchProduct.stock - data.quantity;
            await Product.findOneAndUpdate({_id: data.product}, {stock:stock}, {new: true});
            return res.send({message: 'Product added to shoppingCart'});
        }else return res.status(400).send(msg);
    }catch(err) {
        console.log(err);
        return err;
    }
}