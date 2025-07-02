const Animais = require('../models/Animais');
const CarrosselAnimais = require('../models/CarrosselDeAnimais');

exports.listarAnimaisParaSelecao = async (req, res) => {
  try {
    const animais = await Animais.findAll({
      attributes: ['id', 'nome'],
      order: [['nome', 'ASC']]
    });
    
    if (!animais || animais.length === 0) {
      return res.status(404).json({ mensagem: 'Nenhum animal encontrado' });
    }
    
    res.json(animais);
  } catch (error) {
    console.error('Erro em listarAnimaisParaSelecao:', error);
    res.status(500).json({ 
      erro: 'Erro ao buscar animais',
      detalhes: error.message 
    });
  }
};

exports.buscarAnimalPorId = async (req, res) => {
  try {
    const animal = await Animais.findByPk(req.params.id, {
      attributes: ['id', 'nome', 'imagem', 'imagemSaida', 'descricao']
    });
    if (!animal) {
      return res.status(404).json({ erro: 'Animal não encontrado' });
    }
    res.json(animal);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao buscar animal' });
  }
};

exports.adicionarAnimalAoCarrossel = async (req, res) => {
  try {
    const { animalId, descricaoSaida } = req.body;
    
    // Verifica se o animal já está no carrossel
    const existe = await CarrosselAnimais.findOne({ where: { animalId } });
    if (existe) {
      return res.status(400).json({ erro: 'Animal já está no carrossel' });
    }
    
    // Pega a última ordem para definir a nova
    const ultimo = await CarrosselAnimais.findOne({
      order: [['ordem', 'DESC']]
    });
    const novaOrdem = ultimo ? ultimo.ordem + 1 : 1;
    
    const novoItem = await CarrosselAnimais.create({
      animalId,
      descricaoSaida,
      ordem: novaOrdem
    });
    
    res.status(201).json(novoItem);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao adicionar animal ao carrossel' });
  }
};

exports.listarAnimaisDoCarrossel = async (req, res) => {
  try {
    const animaisCarrossel = await CarrosselAnimais.findAll({
      include: [{
        model: Animais,
        as: 'animal', // Deve corresponder ao alias definido na associação
        attributes: ['id', 'nome', 'imagem', 'imagem_saida', 'descricao']
      }],
      order: [['ordem', 'ASC']]
    });
    
    res.json(animaisCarrossel);
  } catch (error) {
    console.error('Erro ao listar animais do carrossel:', error);
    res.status(500).json({ 
      erro: 'Erro ao listar animais do carrossel',
      detalhes: error.message 
    });
  }
};

exports.removerAnimalDoCarrossel = async (req, res) => {
  try {
    await CarrosselAnimais.destroy({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao remover animal do carrossel' });
  }
};