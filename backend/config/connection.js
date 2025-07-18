const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PWD,
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'postgres',
    port: process.env.DB_PORT || 5432,
    logging: false,
    retry: {
      max: 5,
      timeout: 5000
    },
    define: {
      underscored: false,
      freezeTableName: true,
      timestamps: true
    }
  }
);

sequelize.authenticate()
  .then(() => {
    console.log('Conexão com o banco estabelecida.');
    // return sequelize.sync({ force: true }); 
  })
  .then(() => {
    console.log('Modelos sincronizados e tabelas recriadas.');
  })
  .catch(err => {
    console.error('Falha na conexão:', err);
    process.exit(1);
  });

module.exports = { Sequelize, sequelize };