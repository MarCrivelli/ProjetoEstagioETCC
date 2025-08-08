const express = require("express");
const routes = express.Router();
const multer = require("multer");
const path = require("path");

// Importar controllers
const animalController = require('../controllers/animalController');
const carrosselAnimaisController = require('../controllers/carrosselDeAnimaisController');
const doadorController = require('../controllers/doadorController')
const avisoController = require('../controllers/avisoController'); 
const usuarioController = require('../controllers/usuarioController');

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

// ============================================================================
// ROTAS DE AUTENTICAÇÃO (SEM PREFIXO /api)
// ============================================================================
routes.post('/cadastro', usuarioController.cadastrarUsuario);
routes.post('/login', usuarioController.autenticarUsuario);
routes.post('/login-google', usuarioController.loginComGoogle); // ROTA GOOGLE ADICIONADA

// ============================================================================
// ROTAS DE USUÁRIOS
// ============================================================================
routes.get('/usuarios', usuarioController.procurarUsuarios);
routes.get('/usuarios/:id', usuarioController.encontrarUsuario);
routes.put('/usuarios/:id', usuarioController.modificarDadosUsuario);
routes.delete('/usuarios/:id', usuarioController.deletarUsuario);

// ============================================================================
// ROTAS DE ANIMAIS
// ============================================================================
routes.get('/animais', animalController.procurarAnimais);
routes.post("/animais", upload.single("imagem"), animalController.cadastrarAnimal);
routes.get("/animais/:id", animalController.buscarAnimalPorId);
routes.put("/animais/:id", animalController.atualizarAnimal);
routes.put("/animais/:id/imagem", upload.single("imagem"), animalController.atualizarImagemEntrada);
routes.put("/animais/:id/imagem-saida", upload.single("imagemSaida"), animalController.atualizarImagemSaida);
routes.put('/animais/:id/descricao-saida', animalController.atualizarDescricaoSaida);

// ============================================================================
// ROTAS DO CARROSSEL
// ============================================================================
routes.get('/carrossel/animais/selecao', carrosselAnimaisController.listarAnimaisParaSelecao);
routes.get('/carrossel/animais/:id', carrosselAnimaisController.buscarAnimalPorId);
routes.get('/carrossel/animais', carrosselAnimaisController.listarAnimaisDoCarrossel);
routes.post('/carrossel/animais', carrosselAnimaisController.adicionarAnimalAoCarrossel);
routes.delete('/carrossel/animais/:id', carrosselAnimaisController.removerAnimalDoCarrossel);
routes.put('/carrossel/animais/:id', carrosselAnimaisController.atualizarDescricaoSaida);

// ============================================================================
// ROTAS DE DOADORES
// ============================================================================
routes.get('/doadores', doadorController.listarDoadores);
routes.post('/doadores', upload.single('imagem'), doadorController.cadastrarDoador);
routes.get('/doadores/:id', doadorController.buscarDoadorPorId);
routes.put('/doadores/:id', upload.single('imagem'), doadorController.atualizarDoador);
routes.delete('/doadores/:id', doadorController.deletarDoador);

// ============================================================================
// ROTAS DE AVISOS
// ============================================================================
routes.get('/avisos', avisoController.listarAvisos);
routes.post('/avisos', avisoController.criarAviso);
routes.get('/avisos/:id', avisoController.buscarAvisoPorId);
routes.put('/avisos/:id', avisoController.atualizarAviso);
routes.delete('/avisos/:id', avisoController.deletarAviso);

// ============================================================================
// MIDDLEWARE DE DEBUG PARA AJUDAR A IDENTIFICAR PROBLEMAS
// ============================================================================
routes.use((req, res, next) => {
  console.log(`🔍 Requisição recebida: ${req.method} ${req.path}`);
  console.log(`📦 Body:`, req.body);
  console.log(`📋 Headers:`, req.headers);
  next();
});

// ============================================================================
// ROTA DE TESTE PARA VERIFICAR SE O SERVIDOR ESTÁ FUNCIONANDO
// ============================================================================
routes.get('/teste', (req, res) => {
  res.json({
    erro: false,
    mensagem: 'Servidor funcionando corretamente!',
    timestamp: new Date().toISOString(),
    endpoints: {
      autenticacao: [
        'POST /cadastro',
        'POST /login',
        'POST /login-google' // ADICIONADO AQUI TAMBÉM
      ],
      usuarios: [
        'GET /usuarios',
        'GET /usuarios/:id',
        'PUT /usuarios/:id',
        'DELETE /usuarios/:id'
      ],
      animais: [
        'GET /animais',
        'POST /animais',
        'GET /animais/:id',
        'PUT /animais/:id'
      ]
    }
  });
});

module.exports = routes;