const express = require("express");
const routes = express.Router();
const multer = require("multer");
const path = require("path");
const animalController = require('../controllers/animalController');
const doadorController = require('../controllers/doadorController');

// Configuração do multer (certifique-se de que está igual ao controller)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const nomeUnico = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, nomeUnico + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

routes.get('/doadores', doadorController.listarDoadores) // Sem ; aqui
routes.post('/doadores', upload.single('imagem'), doadorController.cadastrarDoador) // Sem ; aqui
routes.get('/doadores/:id', doadorController.buscarDoadorPorId)
routes.put('/doadores/:id', upload.single('imagem'), doadorController.atualizarDoador)
routes.delete('/doadores/:id', doadorController.deletarDoador)

// Rotas de animais (mantenha como estava funcionando)
routes.get('/listar/animais', animalController.procurarAnimais)
routes.post("/animais", upload.single("imagem"), animalController.cadastrarAnimal)
routes.get("/animais/:id", animalController.buscarAnimalPorId)

module.exports = routes;