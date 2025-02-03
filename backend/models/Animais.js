const connection = require("../config/connection");

const Animais = connection.sequelize.define("db_user", {
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
    type: connection.Sequelize.NUMBER,
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
    allowNull: false,
  },
});
Animais.sync();
module.exports = Animais;
