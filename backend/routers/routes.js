const express = require("express");
const routes = express.Router();
const multer = require("multer");
const path = require("path");
const animalController = require('../controllers/animalController');
const doadorController = require('../controllers/doadorController');
const carrosseldeAnimaisController = require('../controllers/carrosselDeAnimaisController');

// Configuração única do multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

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
routes.get('/carrossel/animais/selecao', carrosseldeAnimaisController.listarAnimaisParaSelecao);
routes.get('/carrossel/animais', carrosseldeAnimaisController.listarAnimaisDoCarrossel);
routes.post('/carrossel/animais', carrosseldeAnimaisController.adicionarAnimalAoCarrossel);
routes.delete('/carrossel/animais/:id', carrosseldeAnimaisController.removerAnimalDoCarrossel);

module.exports = routes;