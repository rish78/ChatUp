const express =require('express');
const { getAllMessages } = require('../controllers/getAllMessages');
const { sendMessage } = require('../controllers/sendMessage');
const { verifyAuth } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/', verifyAuth, sendMessage);
router.get('/:chatid', verifyAuth, getAllMessages);

module.exports = router;