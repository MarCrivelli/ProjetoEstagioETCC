const connection = require("../config/connection");

const CarrosselDeAnimais = connection.sequelize.define("doadores", {
  id: {
    type: connection.Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  descricaoSaida: {
    type: connection.Sequelize.TEXT,
    allowNull: false,
  },
  createdAt: {
    type: connection.Sequelize.DATE,
    allowNull: false,
    defaultValue: connection.Sequelize.NOW,
  },
  updatedAt: {
    type: connection.Sequelize.DATE,
    allowNull: false,
    defaultValue: connection.Sequelize.NOW,
  },
});

module.exports = CarrosselDeAnimais;