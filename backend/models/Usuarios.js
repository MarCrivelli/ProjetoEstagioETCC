const connection = require("../config/connection");

const Usuario = connection.sequelize.define("db_usuario", {
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
  senha: { 
    type: connection.Sequelize.STRING,
    allowNull: false,
  },
  email: {
    type: connection.Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
  nivelDeAcesso: {
    type: connection.Sequelize.STRING,
    allowNull: false,
    defaultValue: 'usuario',
  },
});

Usuario.sync();
module.exports = Usuario;