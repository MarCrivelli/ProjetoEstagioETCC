const connection = require("../config/connection");

const Animais = connection.sequelize.define("animais", {
  id: {
    type: connection.Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  nome: {
    type: connection.Sequelize.STRING,
    allowNull: false,
  },
  idade: {
    type: connection.Sequelize.INTEGER, // Corrigido para INTEGER
    allowNull: false,
  },
  sexo: {
    type: connection.Sequelize.STRING,
    allowNull: false,
  },
  tipo: {
    type: connection.Sequelize.STRING,
    allowNull: false,
  },
  statusMicrochipagem: {
    type: connection.Sequelize.STRING,
    allowNull: false,
  },
  statusVacinacao: {
    type: connection.Sequelize.STRING,
    allowNull: false,
  },
  statusCastracao: {
    type: connection.Sequelize.STRING,
    allowNull: false,
  },
  statusAdocao: {
    type: connection.Sequelize.STRING,
    allowNull: false,
  },
  statusVemifugacao: {
    type: connection.Sequelize.STRING,
    allowNull: true,
  },
  imagem: {
    type: connection.Sequelize.STRING,
    allowNull: true,
  },
});

// Sincroniza o modelo com o banco de dados (opcional)
// Animais.sync({ force: true }); // Use { force: true } apenas em desenvolvimento para recriar a tabela

module.exports = Animais;
