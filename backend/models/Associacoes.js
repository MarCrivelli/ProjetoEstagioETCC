// models/Associacoes.js
const Animais = require("./Animais");
const CarrosselAnimais = require("./CarrosselDeAnimais");

function setupAssociations() {
  // 1. Associação Animais -> CarrosselAnimais
  Animais.hasMany(CarrosselAnimais, {
    foreignKey: 'animal_id',
    as: 'itensCarrossel'
  });

  // 2. Associação CarrosselAnimais -> Animais
  CarrosselAnimais.belongsTo(Animais, {
    foreignKey: 'animal_id',
    as: 'animal'
  });

  console.log("Associações configuradas com sucesso");
}

module.exports = setupAssociations;