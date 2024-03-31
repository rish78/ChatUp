const redisClient = require("../config/cache");
const Message = require("../models/messageSchema");
const User = require("../models/userSchema");

exports.sendMessage = async (req, res) => {
    const {content, chatid} = req.body;

   

    var newMessage = {
        sender: req.user._id,
        content: content,
        chat: chatid
    };

    try{
        var message = await Message.create(newMessage);
        message = await message.populate("sender", "username");
        message = await message.populate("chat");

        message = await User.populate(message, {
            path: 'chat.users',
            select: "-password",
        })
       
        //caching
        const messageForCache = JSON.stringify(message);
        const cacheKey = `messages:${chatid}`;
        redisClient.rpush(cacheKey, messageForCache, (err) => {
            if (err) {
                console.error("Failed to cache message:", err);
            }
        });
        redisClient.expire(cacheKey, 3600);

        res.json(message);
    }catch(err){
        console.log(err)
        res.status(500).json({error: "Error occured"})
    }


}