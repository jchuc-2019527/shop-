'use strict'

const Category = require('../models/category.model');
const Product = require('../models/product.model');
const { validateData, searchCategory, checkPermission} = require('../utils/validate');

exports.testCategory = (req, res) => {
    try{
        return res.send({message: 'TestCategory is running...'})
    }catch(err){
        console.log(err);
        return err;
    }
}

exports.addCategory = async (req, res) => {
    try{
        const params = req.body;
        const data = {
            name: params.name
        };
        const msg = validateData(data);
        const already = await searchCategory(params.name);
        if(!msg) {
            if(!already) {
                const category = new Category(data);
                await category.save();
                return res.send({message: 'Category created.'});
            }else return res.send({message: 'This category already exist.'})
        }else return res.status(400).send({message: 'msg'});
    }catch(err){
        console.log(err);
        return err;
    }
}

exports.getCategories = async (req, res) => {
    try{
        const category = await Category.find();
        return res.send({category});
    }catch(err){
        console.log(err);
        return err;
    }
}

exports.updateCategory = async (req, res) => {
    try{
        const params = req.body;
        const data = {
            name: params.name
        };
        const categoryId = req.params.id;
        const searchCategory = await Category.findOne({_id: categoryId});
        const userId = searchCategory.user;
        const msg = validateData(data);
        if(msg) return res.send(msg);
        const permission = await checkPermission (userId, req.user.sub);
        if(permission === true) return res.status(401).send({message: 'Unauthorized to update this category.'});
        const category = await Category.findOneAndUpdate({_id: categoryId}, data, {new: true});
        return res.send({category});
    }catch (err) {
        console.log(err);
        return err;
    }
}

exports.deleteCategory = async (req, res) => {
    try{
        const categoryId = req.params.id;
        const searchId = await Category.findOne({_id: categoryId});
        if(!searchId) return res.send({message: 'Category not found.'});
        const categoryDeleted = await Category.findOneAndDelete({_id: categoryId});
        const searchDefaultCategory = await Category.findOne({name: 'default'});
        await Product.updateMany({category: categoryId}, {category: searchDefaultCategory._id});
        return res.send({message: 'Category deleted', categoryDeleted});
    }catch(err){
        console.log(err);
        return err;
    }
}

