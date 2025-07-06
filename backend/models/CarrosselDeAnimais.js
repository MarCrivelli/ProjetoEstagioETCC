const connection = require("../config/connection");

const CarrosselDeAnimais = connection.sequelize.define("carrossel_animais", {
  id: {
    type: connection.Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  animalId: {
    type: connection.Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'animais',
      key: 'id'
    }
  },
  descricao_saida: {
    type: connection.Sequelize.TEXT,
    allowNull: true
  },
  ordem: {
    type: connection.Sequelize.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'carrossel_animais',
  underscored: true,
  timestamps: true // Adicione para consistência
});


module.exports = CarrosselDeAnimais;