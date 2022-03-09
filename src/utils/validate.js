'use strict'
const bcrypt = require('bcrypt-nodejs');
const User = require('../models/user.model');
const Category = require('../models/category.model');

exports.validateData = (data) => {
    try {
        let keys = Object.keys(data), msg ='';
        for(let key of keys) {
            if(data[key] !== null && data[key] !== undefined && data[key] !== '') continue;
            msg += `El parametro ${key} es obligatorio \n`;
        }
        return msg.trim();
    }catch(err) {
        console.error(err);
        return err ;
    }
}

exports.searchUser= async (username) => {
    try {
        let exist = User.findOne({username: username}).lean();
        return exist;
    }catch(err) {
        console.error(err);
        return err;
    }
}
exports.encrypt = async (password) => {
    try {
        return bcrypt.hashSync(password);
    }catch(err) {
        console.log(err);
        return err;
    }
}

exports.checkPassword = async (password, hash) => {
    try {
        return bcrypt.compareSync(password, hash);
    }catch(err) {
        console.error(err);
        return err;
    }
}

exports.checkPermission = async (userId, sub) => {
    try {
        if(userId != sub) return false;
        else return true;
    }catch (err) {
        console.log(err);
        return err;
    }
}

exports.checkUpdate = async (user) => {
    try {
        if(user.password || Object.entries(user).length === 0 || user.role)
            return false;
                else
                    return true;
    }catch (err) {
        console.log(err);
        return err;
    }
}

exports.searchCategory = async (name) => {
    try{
        let exist = Category.findOne({name:name}).lean();
        return exist;
    }catch(err) {
        console.log(err);
        return err;
    }
}

exports.deleteSensitiveDataCart = (data)=>{
    try{
        delete data._id;
        delete data.user._id;
        delete data.user.password;
        delete data.user.role;
        delete data.category._id;
        delete data.shoppingCart;
        delete data.product._id;
        delete data.product.category;
        delete data.category._id;
        return data;
    }catch(err){
        console.log(err);
        return err;
    }
}
exports.checkCategories = async (params) => {
    try {
        if (params.category || Object.entries(params).length === 0)
            return false;
        return true;
    } catch (err) {
        console.log(err);
        return err;
    }
}