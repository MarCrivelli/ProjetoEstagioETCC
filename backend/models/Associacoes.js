const Animais = require("./Animais");
const CarrosselAnimais = require("./CarrosselDeAnimais");

function setupAssociations() {
  // 1. Associação Animais -> CarrosselAnimais
  Animais.hasMany(CarrosselAnimais, {
    foreignKey: 'animal_id',
    as: 'itensCarrossel' // Alias único alterado de 'carrossel' para 'itensCarrossel'
  });

  // 2. Associação CarrosselAnimais -> Animais
  CarrosselAnimais.belongsTo(Animais, {
    foreignKey: 'animal_id',
    as: 'animal' // Mantido como 'animal' pois é único
  });

  console.log("Associações configuradas com sucesso");
}

module.exports = setupAssociations;