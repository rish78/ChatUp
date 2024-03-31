const Chat = require("../models/chatSchema");
const Message = require("../models/messageSchema");

exports.deleteChat = async (req, res) => {
    const chatId = req.params.chatid;

    console.log(chatId);

    try {
        const chat = await Chat.findById(chatId);
        if (!chat) {
            return res.status(404).json({ message: 'Chat not found' });
        }
       
        if(chat.users[0]._id.toString() != req.user._id.toString()) console.log("here")
        //auth check
        if(chat.users[0]._id.toString() !== req.user._id.toString() && chat.users[1]._id !== req.user._id){
            return res.status(401).json({ message: 'Unauthorized' });
        }

        await Chat.findByIdAndDelete(chatId);

        await Message.deleteMany({ chat: chatId });

        //deleting from cache
        const cacheKey = `chat_messages:${chatId}`;
        redisClient.del(cacheKey, (err, reply) => {
            if (err) {
                console.error('Failed to delete chat messages from cache: ', err);
            }
            console.log(`Cache for ${cacheKey} cleared, reply: `, reply);
        });

        return res.status(200).json({ message: 'Chat and associated messages deleted successfully' });
    } catch (error) {
        console.error('Failed to delete chat: ', error);
        return res.status(500).json({ message: 'Server error' });
    }
}