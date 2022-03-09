'use strict'

const jwt = require('jwt-simple');
const secretKey = 'SecretKey';
const moment = require('moment');

exports.createToken = async (user) => {
    try {
        const payload = {
            sub: user._id,
            name: user.name,
            surname: user.surname,
            username: user.username,
            email: user.email,
            role: user.role,
            iat: moment().unix(),
            exp: moment().add(8, 'hours').unix()
        }
        return jwt.encode(payload, secretKey);
    }catch(err) {
        console.error(err);
        return err;
    }
}
