'use strict'

const req = require('express/lib/request');
const res = require('express/lib/response');
const jwt = require('jwt-simple');
const secretKey = 'SecretKey';

exports.ensureAuth = (req, res, next) => {
	if (!req.headers.authorization) {
		return res.status(403).send({ message: 'The request does not contain the authentication headers (TOKEN)' })
	} else {
		try {
			let token = req.headers.authorization.replace(/['"]+/g, '');
			var payload = jwt.decode(token, secretKey); 
		} catch(err){
			console.log(err);
			return res.status(403).send({ message: 'Token is not valid or expired' });
		}
		req.user = payload;
		next();
	}
}

exports.isAdmin = async (req, res, next) => {
	try {
		const user = req.user;
		if(user.role === 'ADMIN') next();
		else return res.status(403).send({ message: 'User unauthorized.'})
	}catch(err) {
		console.log(err);
		return err;
	}
}