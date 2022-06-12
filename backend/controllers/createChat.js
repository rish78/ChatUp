const Chat = require("../models/chatSchema");

exports.createChat = async (req, res) => {
    const {userid} = req.body;

    if(!userid){
        res.status(400).json({error: "Send user id"})
    }

    var isChat = await Chat.find({
        isGroupChat: false,
        $and: [
            { users: { $elemMatch: { $eq: req.user._id } } },
            { users: { $elemMatch: { $eq: userid } } },
        ]
    }).populate("users", '-password');

    if(isChat.length > 0){
        res.send(isChat[0]);
    }
    else{
        var chatData = {
            chatName: "sender",
            isGroupChat: false,
            users: [req.user._id, userid ]
        };

        try{
            const newChat = await Chat.create(chatData);

            const finalChat = await Chat.findOne({_id: newChat._id}).populate("users", '-password');

            res.status(200).send(finalChat);
        }
        catch(err){
            console.log(err);
            res.status(400).json({
                error: "Couldn't create chat"
            });
        }
    }
}