'use strict'
const mongoose = require('mongoose');
function init() {
    const uriMongo = 'mongodb://127.0.0.1:27017/shop';
    mongoose.Promise = global.Promise;

    mongoose.connection.on('error', (err) => {
        console.log('mongoDB | Could not connected to the dataBase existing ...');
    });
    mongoose.connection.on('disconnected', () => {
        console.log('MongoDB disconnected.');
    });
    mongoose.connection.on('reconnected', () =>{
        console.log('MongoDB reconnected.');
    });
    mongoose.connection.on('connecting', () => {
        console.log('Connecting to the mongoDB...');
    });
    mongoose.connection.on('connected', () => {
        console.log('Connected to the mongoDB.');
    });
    mongoose.connection.on('open', () => {
        console.log('MongoDB | Successfuly connected to the dataBase.');
    });
    mongoose.connect(uriMongo, {
        maxPoolSize: 15,
        wtimeoutMS: 2500,
        useNewUrlParser: true
    }).catch(err => {
        console.log(err)
    })
}

module.exports.init = init;