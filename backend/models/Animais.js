// models/Animais.js
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
    type: connection.Sequelize.INTEGER,
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
  statusVermifugacao: {
    type: connection.Sequelize.STRING,
    allowNull: false,
  },
  imagem: {
    type: connection.Sequelize.STRING,
    allowNull: false,
  },
  imagemSaida: {
    type: connection.Sequelize.STRING,
    allowNull: true,
  },
  dataVacinacao: {
    type: connection.Sequelize.DATE,
    allowNull: true
  },
  descricao: {
    type: connection.Sequelize.TEXT,
    allowNull: true
  },
});

module.exports = Animais;