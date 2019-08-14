const Routes = require('express').Router();
const usersController = require('../controller/users');

//Routes.get('/users', usersController.permission('users_read'), usersController.read);
Routes.post('/users', usersController.permission('users_edit'), usersController.create);
Routes.put('/users', usersController.permission('users_edit'), usersController.update);
//Routes.delete('/users', usersController.permission('users_edit'), usersController.delete);

Routes.post('/users/authorize', usersController.authorize);
Routes.post('/users/authenticate', (req, res)=>{res.send(req.user)});

module.exports = Routes;