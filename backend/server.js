require('dotenv').config();
const express = require('express');
const cors = require('cors');
const routes = require('./routers/routes');
const setupAssociations = require('./models/Associacoes.js'); 
const { sequelize } = require('./config/connection'); // Ajustado para sua estrutura

const app = express();

// Configurações básicas
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuração para servir arquivos estáticos
app.use('/uploads', express.static('uploads'));

// Configurar associações dos modelos
setupAssociations();

// Rotas
app.use('/', routes);

// Tratamento de erros
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Erro interno do servidor' });
});

// Sincronizar banco de dados e iniciar servidor
const PORT = process.env.PORT || 3003;

sequelize.sync({ force: true }) // ATENÇÃO: Isso vai DELETAR todas as tabelas e dados!
  .then(() => {
    console.log('Banco de dados sincronizado com force: true');
    console.log('⚠️  ATENÇÃO: Todos os dados foram perdidos!');
    
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Erro ao sincronizar banco de dados:', error);
  });