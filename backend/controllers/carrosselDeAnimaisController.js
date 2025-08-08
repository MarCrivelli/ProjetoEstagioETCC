const Animais = require('../models/Animais');
const CarrosselAnimais = require('../models/CarrosselDeAnimais');

const listarAnimaisParaSelecao = async (req, res) => {
  try {
    console.log('🔍 Buscando animais para seleção...');
    
    // Busca todos os animais com os campos necessários
    const todosAnimais = await Animais.findAll({
      attributes: ['id', 'nome', 'descricao', 'descricaoSaida', 'imagem', 'imagemSaida'],
      order: [['nome', 'ASC']]
    });
    
    console.log(`📦 Total de animais encontrados: ${todosAnimais.length}`);
    
    // Busca IDs dos animais já no carrossel
    const animaisNoCarrossel = await CarrosselAnimais.findAll({
      attributes: ['animalId']
    });
    
    const idsNoCarrossel = animaisNoCarrossel.map(item => item.animalId);
    console.log('🎠 IDs já no carrossel:', idsNoCarrossel);
    
    // Filtra animais que:
    // 1. Não estão no carrossel
    // 2. Têm todos os dados necessários (nome, descrições, imagens)
    const animaisDisponiveis = todosAnimais.filter(animal => {
      const naoEstaNoCarrossel = !idsNoCarrossel.includes(animal.id);
      const temDadosCompletos = 
        animal.nome && 
        animal.descricao && 
        animal.descricaoSaida && 
        animal.imagem && 
        animal.imagemSaida;
      
      const disponivel = naoEstaNoCarrossel && temDadosCompletos;
      
      if (!disponivel) {
        console.log(`⚠️ Animal ${animal.nome} (ID: ${animal.id}) não disponível:`);
        console.log(`   - Não está no carrossel: ${naoEstaNoCarrossel}`);
        console.log(`   - Tem dados completos: ${temDadosCompletos}`);
        console.log(`   - Nome: ${!!animal.nome}`);
        console.log(`   - Descrição: ${!!animal.descricao}`);
        console.log(`   - Descrição Saída: ${!!animal.descricaoSaida}`);
        console.log(`   - Imagem: ${!!animal.imagem}`);
        console.log(`   - Imagem Saída: ${!!animal.imagemSaida}`);
      }
      
      return disponivel;
    });
    
    console.log(`✅ Animais disponíveis para seleção: ${animaisDisponiveis.length}`);
    
    res.status(200).json(animaisDisponiveis);
  } catch (error) {
    console.error('❌ Erro em listarAnimaisParaSelecao:', error);
    res.status(500).json({ 
      success: false,
      message: 'Erro ao buscar animais',
      error: error.message 
    });
  }
};

const buscarAnimalPorId = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('🔍 Buscando animal por ID:', id);
    
    const animal = await Animais.findByPk(id, {
      attributes: ['id', 'nome', 'imagem', 'imagemSaida', 'descricao', 'descricaoSaida']
    });
    
    if (!animal) {
      console.log('❌ Animal não encontrado:', id);
      return res.status(404).json({ 
        success: false,
        message: 'Animal não encontrado' 
      });
    }
    
    console.log('✅ Animal encontrado:', animal.nome);
    
    // Retorna o animal diretamente (não encapsulado em 'data')
    res.status(200).json(animal);
  } catch (error) {
    console.error('❌ Erro ao buscar animal:', error);
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
    
    console.log('🎠 Adicionando animal ao carrossel:', { animalId, descricaoSaida });
    
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
      descricaoSaida: descricaoSaida || animal.descricaoSaida, // Usa a descrição do animal se não fornecida
      ordem: novaOrdem
    });
    
    console.log('✅ Animal adicionado com sucesso ao carrossel');
    
    res.status(201).json({
      success: true,
      message: 'Animal adicionado ao carrossel com sucesso',
      data: novoItem
    });
  } catch (error) {
    console.error('❌ Erro ao adicionar animal ao carrossel:', error);
    res.status(500).json({ 
      success: false,
      message: 'Erro ao adicionar animal ao carrossel',
      error: error.message 
    });
  }
};

const listarAnimaisDoCarrossel = async (req, res) => {
  try {
    console.log('🎠 Listando animais do carrossel...');
    
    const animaisCarrossel = await CarrosselAnimais.findAll({
      include: [{
        model: Animais,
        as: 'animal',
        attributes: ['id', 'nome', 'imagem', 'imagemSaida', 'descricao']
      }],
      order: [['ordem', 'ASC']]
    });
    
    console.log(`✅ Encontrados ${animaisCarrossel.length} animais no carrossel`);
    
    // Processa os dados para garantir que todos os campos estejam presentes
    const dadosProcessados = animaisCarrossel
      .filter((item) => item?.animal) // Remove itens sem animal
      .map((item) => ({
        ...item.toJSON(), // Converte para objeto simples
        animal: {
          ...item.animal.toJSON(),
          imagem: item.animal.imagem || null,
          imagemSaida: item.animal.imagemSaida || null,
          nome: item.animal.nome || "Animal sem nome",
          descricao: item.animal.descricao || "Sem descrição",
        },
      }));
    
    res.status(200).json({
      success: true,
      data: dadosProcessados
    });
  } catch (error) {
    console.error('❌ Erro ao listar animais do carrossel:', error);
    res.status(500).json({ 
      success: false,
      message: 'Erro ao listar animais do carrossel',
      error: error.message 
    });
  }
};

const removerAnimalDoCarrossel = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('🗑️ Removendo animal do carrossel, ID:', id);
    
    const result = await CarrosselAnimais.destroy({ 
      where: { id: id } 
    });
    
    if (result === 0) {
      console.log('❌ Item do carrossel não encontrado:', id);
      return res.status(404).json({ 
        success: false,
        message: 'Item do carrossel não encontrado' 
      });
    }
    
    console.log('✅ Animal removido do carrossel com sucesso');
    
    res.status(200).json({
      success: true,
      message: 'Animal removido do carrossel com sucesso'
    });
  } catch (error) {
    console.error('❌ Erro ao remover animal do carrossel:', error);
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
    
    console.log('📝 Atualizando descrição de saída:', { id, descricaoSaida });
    
    // Validação básica
    if (!descricaoSaida || descricaoSaida.trim() === '') {
      return res.status(400).json({ 
        success: false,
        message: 'Descrição de saída é obrigatória' 
      });
    }
    
    // Verifica se o registro existe
    const carrosselAnimal = await CarrosselAnimais.findByPk(id);
    if (!carrosselAnimal) {
      return res.status(404).json({ 
        success: false,
        message: 'Animal não encontrado no carrossel' 
      });
    }
    
    // Atualiza a descrição de saída
    const [numRowsUpdated] = await CarrosselAnimais.update(
      { descricaoSaida: descricaoSaida.trim() },
      { where: { id: id } }
    );
    
    if (numRowsUpdated === 0) {
      return res.status(400).json({ 
        success: false,
        message: 'Nenhum registro foi atualizado' 
      });
    }
    
    console.log('✅ Descrição de saída atualizada com sucesso');
    
    res.status(200).json({ 
      success: true,
      message: 'Descrição de saída atualizada com sucesso',
      data: {
        id: id,
        descricaoSaida: descricaoSaida.trim()
      }
    });
    
  } catch (error) {
    console.error('❌ Erro ao atualizar descrição de saída:', error);
    res.status(500).json({ 
      success: false,
      message: 'Erro interno do servidor ao atualizar descrição',
      error: error.message
    });
  }
};

// Exportações
module.exports = {
  listarAnimaisParaSelecao,
  buscarAnimalPorId,
  adicionarAnimalAoCarrossel,
  listarAnimaisDoCarrossel,
  removerAnimalDoCarrossel,
  atualizarDescricaoSaida
};