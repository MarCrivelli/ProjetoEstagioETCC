const connection = require("../config/connection");

const User = connection.sequelize.define("db_user", {
  id: {
    type: connection.Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
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
});
User.sync();
module.exports = User;