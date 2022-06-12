const jwt = require('jsonwebtoken');

exports.generateToken = async (id) => {
    return await jwt.sign({id}, process.env.SECRET_KEY, {
        expiresIn: "30d",
    });
}