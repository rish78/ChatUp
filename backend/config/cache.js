const Redis = require("ioredis");
const redisUri = process.env.REDIS_URI;
const redisClient = new Redis(redisUri);

module.exports = redisClient;