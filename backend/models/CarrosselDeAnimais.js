const connection = require("../config/connection");

const CarrosselDeAnimais = connection.sequelize.define("carrossel_animais", {
  id: {
    type: connection.Sequelize.INTEGER,
    primaryKey: true,
    references: {
      model: 'animais', // Referência à tabela de animais
      key: 'id'
    }
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
}, {
  tableName: 'carrossel_animais' // Nome explícito da tabela
});

// Definindo a associação com o modelo Animais
CarrosselDeAnimais.associate = (models) => {
  CarrosselDeAnimais.belongsTo(models.Animais, {
    foreignKey: 'id',
    as: 'animal'
  });
};

module.exports = CarrosselDeAnimais;