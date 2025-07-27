const express = require("express");
const routes = express.Router();
const multer = require("multer");
const path = require("path");
const animalController = require('../controllers/animalController');
const carrosselAnimaisController = require('../controllers/carrosselDeAnimaisController');
const doadorController = require('../controllers/doadorController')

// Configuração do multer
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

// Rotas de animais
routes.get('/animais', animalController.procurarAnimais);
routes.post("/animais", upload.single("imagem"), animalController.cadastrarAnimal);
routes.get("/animais/:id", animalController.buscarAnimalPorId);
routes.put("/animais/:id", animalController.atualizarAnimal);
routes.put("/animais/:id/imagem", upload.single("imagem"), animalController.atualizarImagemEntrada);
routes.put("/animais/:id/imagem-saida", upload.single("imagemSaida"), animalController.atualizarImagemSaida);
routes.put('/animais/:id/descricao-saida', animalController.atualizarDescricaoSaida);

// Rotas do carrossel
routes.get('/carrossel/animais/selecao', carrosselAnimaisController.listarAnimaisParaSelecao);
routes.get('/carrossel/animais/:id', carrosselAnimaisController.buscarAnimalPorId);
routes.get('/carrossel/animais', carrosselAnimaisController.listarAnimaisDoCarrossel);
routes.post('/carrossel/animais', carrosselAnimaisController.adicionarAnimalAoCarrossel);
routes.delete('/carrossel/animais/:id', carrosselAnimaisController.removerAnimalDoCarrossel);
routes.put('/carrossel/animais/:id', carrosselAnimaisController.atualizarDescricaoSaida);

// Rotas de doadores
routes.get('/doadores', doadorController.listarDoadores);
routes.post('/doadores', upload.single('imagem'), doadorController.cadastrarDoador);
routes.get('/doadores/:id', doadorController.buscarDoadorPorId);
routes.put('/doadores/:id', upload.single('imagem'), doadorController.atualizarDoador);
routes.delete('/doadores/:id', doadorController.deletarDoador);

module.exports = routes;