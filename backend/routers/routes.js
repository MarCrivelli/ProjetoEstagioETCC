const express = require('express');
const routes = express.Router();

const userController = require('../controllers/userController');

routes.get('/encontrar_usuarios', userController.procurarUsuarios);
routes.post('/usuario', userController.cadastrarUsuario);
routes.delete('/usuario/:id', userController.deletarUsuario);
routes.put('/usuario/:id', userController.modificarDadosUsuario);
routes.post('/usuario/autenticar', userController.autenticarUsuario);


module.exports = routes;
