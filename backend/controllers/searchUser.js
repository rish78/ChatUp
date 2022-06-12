const User = require("../models/userSchema");

exports.searchUser = async(req, res) => {
    try{
        const searchName = req.query.search
        ? {
            $or: [
                { username: { $regex: req.query.search, $options: "i" } },
                { name: { $regex: req.query.search, $options: "i" } },
                { email: { $regex: req.query.search, $options: "i" } },
            ],
          }
        : {};
    
        const users = await (await User.find(searchName).find({ _id: {$ne: req.user._id}}));
    
        res.send(users);
    }
    catch(err){
        console.log(err);
    }
    

}