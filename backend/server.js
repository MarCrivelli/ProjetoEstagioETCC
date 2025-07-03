require('dotenv').config();
const express = require('express');
const cors = require('cors');
const routes = require('./routers/routes');
const setupAssociations = require('./models/Associacoes.js'); 

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

// Iniciar servidor
const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});