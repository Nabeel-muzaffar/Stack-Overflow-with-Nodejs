const express  = require('express');
const userController = require('../controller/userController');
const user = require('../models/user');
const Route = express.Router();
const isAuth = require('../controller/isAuth');

Route.get('/' , userController.mainPage)

Route.get('/signup' , userController.getsignup)

Route.post('/signup', userController.postsignup)

Route.get('/discuss' , isAuth , userController.getdiscuss);

Route.get('/category/' , isAuth  ,userController.getLanguage);

Route.post('/category/' , userController.postLanguage);

Route.get('/questions'  ,userController.getquestion)

Route.get('/loadQuestion/:questionID', isAuth ,userController.getQuestion);

Route.post('/loadQuestion/:questionID' , userController.postANS);

Route.get('/login',userController.getlogin);

Route.post('/login',userController.postLogin);

Route.post('/logout' , userController.postLogout);



module.exports = Route;