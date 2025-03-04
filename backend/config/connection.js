const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PWD,
  {
    host: process.env.DB_HOST || 'localhost', // Host do banco
    dialect: 'postgres', // Tipo do banco
    port: process.env.DB_PORT || 5432, // Porta do banco
    logging: false // Desativa logs do Sequelize no console
  }
);

// Função assíncrona para testar a conexão
(async () => {
  try {
    await sequelize.authenticate(); // Aguarda a autenticação
    console.log('Conectado com a base de dados!');
  } catch (error) {
    console.error('Sem comunicação com a base de dados!', error);
  }
})();

module.exports = { Sequelize, sequelize };