const express =require('express');
const { loginUser } = require('../controllers/loginUser');
const { registerUser } = require('../controllers/registerUser');
const { searchUser } = require('../controllers/searchUser');
const { verifyAuth } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/', verifyAuth, searchUser);

module.exports = router;