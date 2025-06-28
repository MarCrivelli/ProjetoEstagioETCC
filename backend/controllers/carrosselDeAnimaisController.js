const CarrosselDeAnimais = require("../models/CarrosselDeAnimais");
const Animais = require("../models/Animais");

const adicionarAoCarrossel = async (req, res) => {
  try {
    const { animalId, descricaoSaida } = req.body;

    // Verifica se o animal existe
    const animal = await Animais.findByPk(animalId);
    if (!animal) {
      return res.status(404).json({ error: 'Animal não encontrado' });
    }

    // Verifica se já está no carrossel
    const existeNoCarrossel = await CarrosselDeAnimais.findOne({ where: { id: animalId } });
    if (existeNoCarrossel) {
      return res.status(400).json({ error: 'Animal já está no carrossel' });
    }

    // Adiciona ao carrossel
    const itemCarrossel = await CarrosselDeAnimais.create({
      id: animalId,
      descricaoSaida
    });

    res.status(201).json(itemCarrossel);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao adicionar ao carrossel' });
  }
};

const listarCarrossel = async (req, res) => {
  try {
    const carrossel = await CarrosselDeAnimais.findAll({
      include: [{
        model: Animais,
        as: 'animal',
        required: true
      }]
    });
    res.json(carrossel);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao listar carrossel' });
  }
};

const atualizarDescricaoSaida = async (req, res) => {
  try {
    const { animalId } = req.params;
    const { descricaoSaida } = req.body;

    const itemCarrossel = await CarrosselDeAnimais.findByPk(animalId);
    if (!itemCarrossel) {
      return res.status(404).json({ error: 'Animal não encontrado no carrossel' });
    }

    itemCarrossel.descricaoSaida = descricaoSaida;
    await itemCarrossel.save();

    res.json(itemCarrossel);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao atualizar descrição' });
  }
};

const removerDoCarrossel = async (req, res) => {
  try {
    const { animalId } = req.params;

    const itemCarrossel = await CarrosselDeAnimais.findByPk(animalId);
    if (!itemCarrossel) {
      return res.status(404).json({ error: 'Animal não encontrado no carrossel' });
    }

    await itemCarrossel.destroy();
    res.status(204).end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao remover do carrossel' });
  }
};

module.exports = {
  adicionarAoCarrossel,
  listarCarrossel,
  atualizarDescricaoSaida,
  removerDoCarrossel
};