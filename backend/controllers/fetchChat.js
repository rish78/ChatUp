const Chat = require("../models/chatSchema")


exports.fetchChat = async (req, res) => {
    try{
        const chat = await Chat.find({users: {$elemMatch: { $eq: req.user._id}}}).populate("users", "-password");
        res.send(chat);
    }
    catch(err){
        console.log(err);
        res.status(400).json({
            error: "Couldn't find chat"
        });
    }
    
}