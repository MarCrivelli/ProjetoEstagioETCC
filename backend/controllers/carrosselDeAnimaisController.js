const Animais = require('../models/Animais');
const CarrosselAnimais = require('../models/CarrosselDeAnimais');

exports.listarAnimaisParaSelecao = async (req, res) => {
  try {
    const animais = await Animais.findAll({
      attributes: ['id', 'nome'],
      order: [['nome', 'ASC']]
    });
    
    res.status(200).json(animais);
  } catch (error) {
    console.error('Erro em listarAnimaisParaSelecao:', error);
    res.status(500).json({ 
      success: false,
      message: 'Erro ao buscar animais',
      error: error.message 
    });
  }
};

exports.buscarAnimalPorId = async (req, res) => {
  try {
    const animal = await Animais.findByPk(req.params.id, {
      attributes: ['id', 'nome', 'imagem', 'imagemSaida', 'descricao']
    });
    
    if (!animal) {
      return res.status(404).json({ 
        success: false,
        message: 'Animal não encontrado' 
      });
    }
    
    res.status(200).json({
      success: true,
      data: animal
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Erro ao buscar animal',
      error: error.message 
    });
  }
};

exports.adicionarAnimalAoCarrossel = async (req, res) => {
  try {
    const { animalId, descricaoSaida } = req.body;
    
    // Verifica se o animal existe
    const animal = await Animais.findByPk(animalId);
    if (!animal) {
      return res.status(404).json({ 
        success: false,
        message: 'Animal não encontrado' 
      });
    }
    
    // Verifica se o animal já está no carrossel
    const existe = await CarrosselAnimais.findOne({ where: { animalId } });
    if (existe) {
      return res.status(400).json({ 
        success: false,
        message: 'Animal já está no carrossel' 
      });
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
    
    res.status(201).json({
      success: true,
      message: 'Animal adicionado ao carrossel com sucesso',
      data: novoItem
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Erro ao adicionar animal ao carrossel',
      error: error.message 
    });
  }
};

exports.listarAnimaisDoCarrossel = async (req, res) => {
  try {
    const animaisCarrossel = await CarrosselAnimais.findAll({
      include: [{
        model: Animais,
        as: 'animal',
        attributes: ['id', 'nome', 'imagem', 'imagemSaida', 'descricao']
      }],
      order: [['ordem', 'ASC']]
    });
    
    res.status(200).json({
      success: true,
      data: animaisCarrossel
    });
  } catch (error) {
    console.error('Erro ao listar animais do carrossel:', error);
    res.status(500).json({ 
      success: false,
      message: 'Erro ao listar animais do carrossel',
      error: error.message 
    });
  }
};

exports.removerAnimalDoCarrossel = async (req, res) => {
  try {
    const result = await CarrosselAnimais.destroy({ 
      where: { id: req.params.id } 
    });
    
    if (result === 0) {
      return res.status(404).json({ 
        success: false,
        message: 'Item do carrossel não encontrado' 
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Animal removido do carrossel com sucesso'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Erro ao remover animal do carrossel',
      error: error.message 
    });
  }
};