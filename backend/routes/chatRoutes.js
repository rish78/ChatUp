const express =require('express');
const { createChat } = require('../controllers/createChat');
const { fetchChat } = require('../controllers/fetchChat');
const { verifyAuth } = require('../middlewares/authMiddleware');
const { deleteChat } = require('../controllers/deleteChat');

const router = express.Router();

router.post('/', verifyAuth, createChat);
router.get('/', verifyAuth, fetchChat);
router.delete('/:chatid', verifyAuth, deleteChat);

module.exports = router;