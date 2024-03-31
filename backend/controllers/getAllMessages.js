const redisClient = require("../config/cache");
const Message = require("../models/messageSchema");

exports.getAllMessages = async (req, res) => {
    try {
        const chatId = req.params.chatid;
        const cacheKey = `messages:${chatId}`;

        // Check if messages are cached
        redisClient.lrange(cacheKey, 0, -1, async (err, cachedMessages) => {
            if (err) throw err;


            if (cachedMessages && cachedMessages.length) {
                // Messages are cached
                const messages = cachedMessages.map(msg => JSON.parse(msg));
                return res.json(messages);
            } else {
                // Messages not cached, fetch from the database
                const messages = await Message.find({ chat: chatId })
                                              .populate("sender", "username")
                                              .populate("chat");

                // Cache each message in Redis list
                messages.forEach(message => {
                    redisClient.rpush(cacheKey, JSON.stringify(message));
                });
                redisClient.expire(cacheKey, 3600);

                return res.json(messages);
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error occurred" });
    }
};
