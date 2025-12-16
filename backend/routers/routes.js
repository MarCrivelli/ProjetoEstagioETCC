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

// Importar middlewares de autenticação
const {
    verificarToken,
    apenasAdministrador,
    administradorOuSub,
    contribuinteOuSuperior,
    verificarProprioUsuarioOuAdmin
} = require('../middlewares/auth');

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
    permissoes: {
      administrador: {
        descricao: "Acesso total a todas as funcionalidades",
        pode: [
          "Gerenciar usuários (criar, editar, deletar)",
          "Gerenciar animais (criar, editar, visualizar)",
          "Gerenciar carrossel (criar, editar, deletar)",
          "Gerenciar doadores (criar, editar, deletar)", 
          "Gerenciar avisos (criar, editar, deletar)",
          "Visualizar todas as informações"
        ]
      },
      subAdministrador: {
        descricao: "Acesso administrativo exceto avisos e funções exclusivas de admin",
        pode: [
          "Gerenciar animais (criar, editar, visualizar)",
          "Gerenciar carrossel (criar, editar, deletar)",
          "Gerenciar doadores (criar, editar, deletar)",
          "Editar usuários de nível inferior",
          "Visualizar todas as informações"
        ],
        nao_pode: [
          "Gerenciar avisos",
          "Deletar usuários",
          "Editar administradores"
        ]
      },
      contribuinte: {
        descricao: "Apenas visualização de conteúdos",
        pode: [
          "Visualizar animais",
          "Visualizar carrossel", 
          "Visualizar doadores",
          "Visualizar avisos",
          "Editar próprio perfil"
        ],
        nao_pode: [
          "Criar/editar/deletar qualquer conteúdo",
          "Gerenciar outros usuários"
        ]
      },
      usuario: {
        descricao: "Usuário básico sem acesso a funcionalidades administrativas",
        pode: [
          "Visualizar conteúdo público",
          "Editar próprio perfil"
        ]
      }
    }
  });
});

// ============================================================================
// ROTAS PÚBLICAS DE AUTENTICAÇÃO (SEM AUTENTICAÇÃO)
// ============================================================================
routes.post('/cadastro', usuarioController.cadastrarUsuario);
routes.post('/login', usuarioController.autenticarUsuario);
routes.post('/login-google', usuarioController.loginComGoogle);


routes.get('/verificar-token', verificarToken, (req, res) => {
  res.json({ 
    erro: false, 
    valido: true, 
    usuario: {
      id: req.user.id,
      email: req.user.email,
      nivelDeAcesso: req.user.nivelDeAcesso
    }
  });
});

// ============================================================================
// ROTAS DE USUÁRIOS (COM AUTENTICAÇÃO)
// ============================================================================

// ADMINISTRADOR: Listar todos os usuários
routes.get('/usuarios', verificarToken, apenasAdministrador, usuarioController.procurarUsuarios);

// CONTRIBUINTE+: Buscar usuário específico (próprio ou superior pode ver outros)
routes.get('/usuarios/:id', verificarToken, verificarProprioUsuarioOuAdmin, usuarioController.encontrarUsuario);

// CONTRIBUINTE+: Atualizar usuário (próprio ou superior pode editar outros)
routes.put('/usuarios/:id', verificarToken, verificarProprioUsuarioOuAdmin, usuarioController.modificarDadosUsuario);

// ADMINISTRADOR: Deletar usuário
routes.delete('/usuarios/:id', verificarToken, apenasAdministrador, usuarioController.deletarUsuario);

// ============================================================================
// ROTAS DO CARROSSEL
// ============================================================================

// PÚBLICO: Visualização do carrossel
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

// ADMIN + SUB-ADMIN: Gerenciar carrossel
routes.post('/carrossel/animais', verificarToken, administradorOuSub, (req, res, next) => {
  console.log('🎠 Rota POST /carrossel/animais chamada');
  carrosselAnimaisController.adicionarAnimalAoCarrossel(req, res, next);
});

routes.delete('/carrossel/animais/:id', verificarToken, administradorOuSub, (req, res, next) => {
  console.log(`🎠 Rota DELETE /carrossel/animais/${req.params.id} chamada`);
  carrosselAnimaisController.removerAnimalDoCarrossel(req, res, next);
});

routes.put('/carrossel/animais/:id', verificarToken, administradorOuSub, (req, res, next) => {
  console.log(`🎠 Rota PUT /carrossel/animais/${req.params.id} chamada`);
  carrosselAnimaisController.atualizarDescricaoSaida(req, res, next);
});

// ============================================================================
// ROTAS DE ANIMAIS
// ============================================================================

// PÚBLICO: Visualização de animais
routes.get('/animais', animalController.procurarAnimais);
routes.get("/animais/:id", animalController.buscarAnimalPorId);

// ADMIN + SUB-ADMIN: Gerenciar animais
routes.post("/animais", verificarToken, administradorOuSub, upload.single("imagem"), animalController.cadastrarAnimal);
routes.put("/animais/:id", verificarToken, administradorOuSub, animalController.atualizarAnimal);
routes.put("/animais/:id/imagem", verificarToken, administradorOuSub, upload.single("imagem"), animalController.atualizarImagemEntrada);
routes.put("/animais/:id/imagem-saida", verificarToken, administradorOuSub, upload.single("imagemSaida"), animalController.atualizarImagemSaida);
routes.put('/animais/:id/descricao-saida', verificarToken, administradorOuSub, animalController.atualizarDescricaoSaida);

// ============================================================================
// ROTAS DE DOADORES
// ============================================================================

// PÚBLICO: Visualização de doadores
routes.get('/doadores', doadorController.listarDoadores);
routes.get('/doadores/:id', doadorController.buscarDoadorPorId);

// ADMIN + SUB-ADMIN: Gerenciar doadores
routes.post('/doadores', verificarToken, administradorOuSub, upload.single('imagem'), doadorController.cadastrarDoador);
routes.put('/doadores/:id', verificarToken, administradorOuSub, upload.single('imagem'), doadorController.atualizarDoador);

// ADMINISTRADOR: Deletar doadores
routes.delete('/doadores/:id', verificarToken, apenasAdministrador, doadorController.deletarDoador);

// ============================================================================
// ROTAS DE AVISOS - EXCLUSIVO PARA ADMINISTRADORES
// ============================================================================

// PÚBLICO: Visualização de avisos
routes.get('/avisos', avisoController.listarAvisos);
routes.get('/avisos/:id', avisoController.buscarAvisoPorId);

// ADMINISTRADOR: Gerenciar avisos (Sub-admin NÃO tem acesso)
routes.post('/avisos', verificarToken, apenasAdministrador, avisoController.criarAviso);
routes.put('/avisos/:id', verificarToken, apenasAdministrador, avisoController.atualizarAviso);
routes.delete('/avisos/:id', verificarToken, apenasAdministrador, avisoController.deletarAviso);

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