const express =require('express');
const { createChat } = require('../controllers/createChat');
const { fetchChat } = require('../controllers/fetchChat');
const { verifyAuth } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/', verifyAuth, createChat);
router.get('/', verifyAuth, fetchChat);

module.exports = router;