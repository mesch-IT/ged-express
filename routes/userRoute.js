const express = require('express');
const userController = require('../controllers/userController');
const router = express.Router();




router.get('/users', userController.getUser)
router.post('/users', userController.createUser)
router.post('/login', userController.login)


module.exports = router