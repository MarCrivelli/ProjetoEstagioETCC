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

// ============================================================================
// MIDDLEWARE DE DEBUG - DEVE ESTAR NO INÍCIO!
// ============================================================================
routes.use((req, res, next) => {
  console.log(`🔍 [${new Date().toISOString()}] Requisição: ${req.method} ${req.path}`);
  if (Object.keys(req.body).length > 0) {
    console.log(`📦 Body:`, req.body);
  }
  next();
});

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
        'POST /login-google'
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
      ],
      carrossel: [
        'GET /carrossel/animais/selecao',
        'GET /carrossel/animais',
        'POST /carrossel/animais',
        'DELETE /carrossel/animais/:id'
      ]
    }
  });
});

// ============================================================================
// ROTAS DE AUTENTICAÇÃO (SEM PREFIXO /api)
// ============================================================================
routes.post('/cadastro', usuarioController.cadastrarUsuario);
routes.post('/login', usuarioController.autenticarUsuario);
routes.post('/login-google', usuarioController.loginComGoogle);

// ============================================================================
// ROTAS DE USUÁRIOS
// ============================================================================
routes.get('/usuarios', usuarioController.procurarUsuarios);
routes.get('/usuarios/:id', usuarioController.encontrarUsuario);
routes.put('/usuarios/:id', usuarioController.modificarDadosUsuario);
routes.delete('/usuarios/:id', usuarioController.deletarUsuario);

// ============================================================================
// ROTAS DO CARROSSEL - ORDEM ESPECÍFICA IMPORTA!
// ============================================================================
// IMPORTANTE: Rotas mais específicas ANTES das mais genéricas
routes.get('/carrossel/animais/selecao', (req, res, next) => {
  console.log('🎠 Rota /carrossel/animais/selecao chamada');
  carrosselAnimaisController.listarAnimaisParaSelecao(req, res, next);
});

routes.get('/carrossel/animais/:id', (req, res, next) => {
  console.log(`🎠 Rota /carrossel/animais/${req.params.id} chamada`);
  carrosselAnimaisController.buscarAnimalPorId(req, res, next);
});

routes.get('/carrossel/animais', (req, res, next) => {
  console.log('🎠 Rota /carrossel/animais (lista) chamada');
  carrosselAnimaisController.listarAnimaisDoCarrossel(req, res, next);
});

routes.post('/carrossel/animais', (req, res, next) => {
  console.log('🎠 Rota POST /carrossel/animais chamada');
  carrosselAnimaisController.adicionarAnimalAoCarrossel(req, res, next);
});

routes.delete('/carrossel/animais/:id', (req, res, next) => {
  console.log(`🎠 Rota DELETE /carrossel/animais/${req.params.id} chamada`);
  carrosselAnimaisController.removerAnimalDoCarrossel(req, res, next);
});

routes.put('/carrossel/animais/:id', (req, res, next) => {
  console.log(`🎠 Rota PUT /carrossel/animais/${req.params.id} chamada`);
  carrosselAnimaisController.atualizarDescricaoSaida(req, res, next);
});

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
// MIDDLEWARE DE TRATAMENTO DE ROTAS NÃO ENCONTRADAS
// ============================================================================
routes.use('*', (req, res) => {
  console.log(`❌ Rota não encontrada: ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    erro: true,
    mensagem: `Rota ${req.method} ${req.originalUrl} não encontrada`,
    timestamp: new Date().toISOString()
  });
});

module.exports = routes;