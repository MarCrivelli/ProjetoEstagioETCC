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
    field: 'status_microchipagem' // Define o nome da coluna no banco
  },
  statusVacinacao: {
    type: connection.Sequelize.STRING,
    allowNull: false,
    field: 'status_vacinacao'
  },
  statusCastracao: {
    type: connection.Sequelize.STRING,
    allowNull: false,
    field: 'status_castracao'
  },
  statusAdocao: {
    type: connection.Sequelize.STRING,
    allowNull: false,
    field: 'status_adocao'
  },
  statusVermifugacao: {
    type: connection.Sequelize.STRING,
    allowNull: false,
    field: 'status_vermifugacao'
  },
  imagem: {
    type: connection.Sequelize.STRING,
    allowNull: false,
  },
  imagemSaida: {
    type: connection.Sequelize.STRING,
    allowNull: true,
    field: 'imagem_saida'
  },
  dataVacinacao: {
    type: connection.Sequelize.DATE,
    allowNull: true,
    field: 'data_vacinacao'
  },
  descricao: {
    type: connection.Sequelize.TEXT,
    allowNull: true
  },
}, {
  tableName: 'animais', // Garante que o nome da tabela será 'animais'
  underscored: true, // Converte automaticamente camelCase para snake_case
  timestamps: true // Adiciona createdAt e updatedAt automaticamente
});

module.exports = Animais;