const Animais = require('../models/Animais');
const CarrosselAnimais = require('../models/CarrosselDeAnimais');

const listarAnimaisParaSelecao = async (req, res) => {
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

const buscarAnimalPorId = async (req, res) => {
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

const adicionarAnimalAoCarrossel = async (req, res) => {
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

const listarAnimaisDoCarrossel = async (req, res) => {
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

const removerAnimalDoCarrossel = async (req, res) => {
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

const atualizarDescricaoSaida = async (req, res) => {
  try {
    const { id } = req.params;
    const { descricaoSaida } = req.body;
    
    // Validação básica
    if (!descricaoSaida || descricaoSaida.trim() === '') {
      return res.status(400).json({ 
        error: 'Descrição de saída é obrigatória' 
      });
    }
    
    // Verifica se o registro existe
    const carrosselAnimal = await CarrosselAnimais.findByPk(id);
    if (!carrosselAnimal) {
      return res.status(404).json({ 
        error: 'Animal não encontrado no carrossel' 
      });
    }
    
    // Atualiza a descrição de saída
    const [numRowsUpdated] = await CarrosselAnimais.update(
      { descricaoSaida: descricaoSaida.trim() },
      { where: { id: id } }
    );
    
    if (numRowsUpdated === 0) {
      return res.status(400).json({ 
        error: 'Nenhum registro foi atualizado' 
      });
    }
    
    res.json({ 
      message: 'Descrição de saída atualizada com sucesso',
      id: id,
      descricaoSaida: descricaoSaida.trim()
    });
    
  } catch (error) {
    console.error('Erro ao atualizar descrição de saída:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor ao atualizar descrição' 
    });
  }
};

// Exportações no final
module.exports = {
  listarAnimaisParaSelecao,
  buscarAnimalPorId,
  adicionarAnimalAoCarrossel,
  listarAnimaisDoCarrossel,
  removerAnimalDoCarrossel,
  atualizarDescricaoSaida
};