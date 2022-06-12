const Message = require("../models/messageSchema")

exports.getAllMessages = async (req, res) => {
    try{
        const messages = await Message.find({chat: req.params.chatid}).populate("sender", "username").populate("chat")
        res.json(messages);
    }catch(err){
        res.status(500).json({error: "Error occured"})
    }
}