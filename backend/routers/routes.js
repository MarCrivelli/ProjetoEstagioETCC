const express = require("express");
const routes = express.Router();
const multer = require("multer");
const path = require("path");

const userController = require('../controllers/userController')
const animalController = require('../controllers/animalController')
const doadorController = require('../controllers/doadorController');

// Configuração do multer para upload de imagens
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Pasta onde as imagens serão salvas
  },
  filename: (req, file, cb) => {
    const nomeUnico = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, nomeUnico + path.extname(file.originalname)); // Nome único para o arquivo
  },
});

const upload = multer({ storage });

// Rotas de usuários
routes.get('/encontrar_usuarios', userController.procurarUsuarios);
routes.post('/usuario', userController.cadastrarUsuario);
routes.delete('/usuario/:id', userController.deletarUsuario);
routes.put('/usuario/:id', userController.modificarDadosUsuario);
routes.post('/usuario/autenticar', userController.autenticarUsuario);

// Rotas de animais
routes.get('/listar/animais', animalController.procurarAnimais);
routes.post("/animais", upload.single("imagem"), animalController.cadastrarAnimal);
routes.get("/animais/:id", animalController.buscarAnimalPorId);

// Rotas de doadores 
routes.get('/doadores', doadorController.listarDoadores);
routes.get('/doadores/:id', doadorController.buscarDoadorPorId);
routes.post('/doadores', doadorController.upload.single('imagem'), doadorController.cadastrarDoador);
routes.put('/doadores/:id', doadorController.upload.single('imagem'), doadorController.atualizarDoador);
routes.delete('/doadores/:id', doadorController.deletarDoador);

module.exports = routes;
