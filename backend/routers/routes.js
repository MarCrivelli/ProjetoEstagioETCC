const express = require("express");
const routes = express.Router();
const multer = require("multer");
const path = require("path");
const animalController = require('../controllers/animalController');
const doadorController = require('../controllers/doadorController');
const carrosseldeAnimaisController = require('../controllers/carrosseldeAnimaisController'); // Novo controller

// Configuração do multer
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

// Rotas de doadores
routes.get('/doadores', doadorController.listarDoadores);
routes.post('/doadores', upload.single('imagem'), doadorController.cadastrarDoador);
routes.get('/doadores/:id', doadorController.buscarDoadorPorId);
routes.put('/doadores/:id', upload.single('imagem'), doadorController.atualizarDoador);
routes.delete('/doadores/:id', doadorController.deletarDoador);

// Rotas de animais
routes.get('/animais', animalController.procurarAnimais);
routes.get('/listar/animais', animalController.procurarAnimais);
routes.post("/animais", upload.single("imagem"), animalController.cadastrarAnimal);
routes.get("/animais/:id", animalController.buscarAnimalPorId);
routes.put("/animais/:id", animalController.atualizarAnimal);
routes.put("/animais/:id/imagem", upload.single("imagem"), animalController.atualizarImagemEntrada);
routes.put("/animais/:id/imagem-saida", upload.single("imagemSaida"), animalController.atualizarImagemSaida);

// Rotas do carrossel
routes.post('/carrossel', carrosseldeAnimaisController.adicionarAoCarrossel);
routes.get('/carrossel', carrosseldeAnimaisController.listarCarrossel);
routes.put('/carrossel/:animalId', carrosseldeAnimaisController.atualizarDescricaoSaida);
routes.delete('/carrossel/:animalId', carrosseldeAnimaisController.removerDoCarrossel);

module.exports = routes;