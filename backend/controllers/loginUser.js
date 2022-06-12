const User = require("../models/userSchema");
const {generateToken} = require("../utils/generateToken");

const bcrypt = require('bcryptjs');


exports.loginUser = async (req, res) => {
    const {email, password} = req.body;

    const user = await User.findOne({ email: email});

    if(!user){
        res.status(400).json({error: "User does not exist, sign up instead!"})
    }
    else{
        bcrypt.compare(password, user.password, async (err, result) => {
            // result == true
            if(err){
                console.log(err);
                res.status(500).json({error:"Internal Server Error!"});
            }
            else if(result===true){
                res.status(200).json({
                    message: "User logged in!",
                    _id: user._id,
                    username: user.username,
                    name: user.name,
                    email:user.email,
                    token: await generateToken(user._id),
                });
            }
            else{
                res.status(400).json({error: "Incorrect password!"})
            }
        })
    }
}