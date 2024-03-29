const User = require("../models/userSchema");
const jwt = require('jsonwebtoken');

exports.verifyAuth = async(req, res, next) => {
    const token = req.headers.authorization;

    if(token){
        try{
            const decoded = jwt.verify(token, process.env.SECRET_KEY);
            req.user = await User.findById(decoded.id).select('-password');
            next()
        }
        catch(err){
            console.log(err);
            res.status(400).json({
                error: "Token verification failed!"
            });
        }
    }
    else{
        res.status(400).json({
            error: "Token missing!"
        });
    }
}