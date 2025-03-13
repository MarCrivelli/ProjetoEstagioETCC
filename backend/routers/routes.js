const express = require("express");
const routes = express.Router();
const multer = require("multer");
const path = require("path");

const userController = require('../controllers/userController')
const animalController = require('../controllers/animalController')

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

module.exports = routes;
