const User = require("../models/userSchema");
const { generateToken } = require("../utils/generateToken");

const bcrypt = require('bcryptjs');

exports.registerUser = async(req, res) => {
    const {username, name, email, password} = req.body;

    if(!name || !email || !password || !username) {
        res.status(400).json({
            error: "Enter all details!"
        });

    }

    console.log(username)

    const emailExists = await User.findOne({ email });
    const usernameExists = await User.findOne({ username });

    if(emailExists){
        return res.status(400).json({
            error: "Email already registered!"
        });
    }

    if(usernameExists){
        console.log("here")
        return res.status(400).json({
            error: "Username already taken!"
        });
    }
    

    bcrypt.hash(password, 10, async (err, hash) => {
        if (err){
            console.log(err)
            res.status(500).json({
                error: "Internal Server Error",
            });
        }
        const user = await User.create({
            username,
            name,
            email,
            password: hash
        })
        if(user){
            res.status(201).json({
                _id: user._id,
                username: user.username,
                name: user.name,
                email:user.email,
                token: await generateToken(user._id),
            });
        }
        else{
            res.status(400).json({
                error: "User registration failed!"
            });
        }
    })
   

    

    
}

