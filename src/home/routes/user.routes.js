const express = require('express');
const userRouter = express.Router();
const { registerController, loginController } = require('../controllers/user.controller')



userRouter.get('/register', async (req, res, next) => {
    res.render('register', { title: 'Register' });
});

userRouter.post('/register', registerController)


userRouter.get('/login', async (req, res, next) => {
    res.render('login', { title: 'Login' });
});

userRouter.post('/login', loginController);

module.exports = userRouter;
