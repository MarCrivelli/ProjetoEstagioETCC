const Animais = require('../models/Animais');
const CarrosselAnimais = require('../models/CarrosselDeAnimais');

// ============================================================================
// FUNÇÃO AUXILIAR PARA VERIFICAR SE AS ASSOCIAÇÕES ESTÃO FUNCIONANDO
// ============================================================================
const verificarAssociacoes = async () => {
  try {
    // Testa se consegue fazer uma query básica
    const count = await CarrosselAnimais.count();
    console.log(`🔍 [VERIFY] Total de registros em CarrosselAnimais: ${count}`);
    
    // Testa se as associações estão funcionando
    const testeAssociacao = await CarrosselAnimais.findOne({
      include: [{
        model: Animais,
        as: 'animal',
        required: false // LEFT JOIN em vez de INNER JOIN
      }]
    });
    
    console.log(`✅ [VERIFY] Associações funcionando: ${!!testeAssociacao}`);
    return true;
  } catch (error) {
    console.error(`❌ [VERIFY] Erro nas associações:`, error.message);
    return false;
  }
};

const listarAnimaisParaSelecao = async (req, res) => {
  try {
    console.log('🔍 [SELECAO] Buscando animais para seleção...');
    
    // Busca todos os animais com os campos necessários
    const todosAnimais = await Animais.findAll({
      attributes: ['id', 'nome', 'descricao', 'descricaoSaida', 'imagem', 'imagemSaida'],
      order: [['nome', 'ASC']]
    });
    
    console.log(`📦 [SELECAO] Total de animais encontrados: ${todosAnimais.length}`);
    
    // Busca IDs dos animais já no carrossel
    const animaisNoCarrossel = await CarrosselAnimais.findAll({
      attributes: ['animalId']
    });
    
    const idsNoCarrossel = animaisNoCarrossel.map(item => item.animalId);
    console.log('🎠 [SELECAO] IDs já no carrossel:', idsNoCarrossel);
    
    // Filtra animais disponíveis
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
        console.log(`⚠️ [SELECAO] Animal ${animal.nome} (ID: ${animal.id}) não disponível:`);
        console.log(`   - Não está no carrossel: ${naoEstaNoCarrossel}`);
        console.log(`   - Tem dados completos: ${temDadosCompletos}`);
      }
      
      return disponivel;
    });
    
    console.log(`✅ [SELECAO] Animais disponíveis: ${animaisDisponiveis.length}`);
    
    res.status(200).json(animaisDisponiveis);
  } catch (error) {
    console.error('❌ [SELECAO] Erro:', error);
    res.status(500).json({ 
      success: false,
      message: 'Erro ao buscar animais para seleção',
      error: error.message 
    });
  }
};

const buscarAnimalPorId = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('🔍 [BY_ID] Buscando animal por ID:', id);
    
    const animal = await Animais.findByPk(id, {
      attributes: ['id', 'nome', 'imagem', 'imagemSaida', 'descricao', 'descricaoSaida']
    });
    
    if (!animal) {
      console.log('❌ [BY_ID] Animal não encontrado:', id);
      return res.status(404).json({ 
        success: false,
        message: 'Animal não encontrado' 
      });
    }
    
    console.log('✅ [BY_ID] Animal encontrado:', animal.nome);
    res.status(200).json(animal);
  } catch (error) {
    console.error('❌ [BY_ID] Erro:', error);
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
    
    console.log('🎠 [ADD] Adicionando animal ao carrossel:', { animalId, descricaoSaida });
    
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
      descricaoSaida: descricaoSaida || animal.descricaoSaida,
      ordem: novaOrdem
    });
    
    console.log('✅ [ADD] Animal adicionado com sucesso ao carrossel');
    
    res.status(201).json({
      success: true,
      message: 'Animal adicionado ao carrossel com sucesso',
      data: novoItem
    });
  } catch (error) {
    console.error('❌ [ADD] Erro:', error);
    res.status(500).json({ 
      success: false,
      message: 'Erro ao adicionar animal ao carrossel',
      error: error.message 
    });
  }
};

const listarAnimaisDoCarrossel = async (req, res) => {
  try {
    console.log('🎠 [LIST] Iniciando listagem de animais do carrossel...');
    
    // Primeira verificação: verificar se as associações estão funcionando
    const associacoesOk = await verificarAssociacoes();
    
    if (!associacoesOk) {
      console.log('⚠️ [LIST] Associações com problema, tentando abordagem alternativa...');
      
      // Busca dados separadamente
      const carrosselItems = await CarrosselAnimais.findAll({
        order: [['ordem', 'ASC']]
      });
      
      const dadosProcessados = [];
      
      for (const item of carrosselItems) {
        const animal = await Animais.findByPk(item.animalId, {
          attributes: ['id', 'nome', 'imagem', 'imagemSaida', 'descricao']
        });
        
        if (animal) {
          dadosProcessados.push({
            id: item.id,
            animalId: item.animalId,
            descricaoSaida: item.descricaoSaida,
            ordem: item.ordem,
            animal: {
              id: animal.id,
              nome: animal.nome || "Animal sem nome",
              imagem: animal.imagem || null,
              imagemSaida: animal.imagemSaida || null,
              descricao: animal.descricao || "Sem descrição"
            }
          });
        }
      }
      
      console.log(`✅ [LIST] Dados processados manualmente: ${dadosProcessados.length} itens`);
      
      return res.status(200).json({
        success: true,
        data: dadosProcessados,
        note: 'Dados obtidos com método alternativo'
      });
    }
    
    // Se as associações estão OK, usa o método padrão
    console.log('✅ [LIST] Associações OK, usando método padrão...');
    
    const animaisCarrossel = await CarrosselAnimais.findAll({
      include: [{
        model: Animais,
        as: 'animal',
        attributes: ['id', 'nome', 'imagem', 'imagemSaida', 'descricao'],
        required: false // LEFT JOIN para não falhar se não encontrar o animal
      }],
      order: [['ordem', 'ASC']]
    });
    
    console.log(`📦 [LIST] Encontrados ${animaisCarrossel.length} animais no carrossel`);
    
    // Processa os dados garantindo que todos os campos estejam presentes
    const dadosProcessados = animaisCarrossel
      .filter((item) => item?.animal) // Remove itens sem animal
      .map((item) => ({
        id: item.id,
        animalId: item.animalId,
        descricaoSaida: item.descricaoSaida, // ⭐ CAMPO IMPORTANTE! Vem da tabela CarrosselAnimais
        ordem: item.ordem,
        animal: {
          ...item.animal.toJSON(),
          imagem: item.animal.imagem || null,
          imagemSaida: item.animal.imagemSaida || null,
          nome: item.animal.nome || "Animal sem nome",
          descricao: item.animal.descricao || "Sem descrição",
        },
      }));
    
    console.log(`✅ [LIST] Dados processados: ${dadosProcessados.length} itens`);
    
    res.status(200).json({
      success: true,
      data: dadosProcessados
    });
    
  } catch (error) {
    console.error('❌ [LIST] Erro detalhado:', {
      message: error.message,
      stack: error.stack,
      name: error.name,
      sql: error.sql || 'N/A'
    });
    
    // Tentativa final: retornar array vazio em caso de erro crítico
    console.log('🔄 [LIST] Tentativa final: retornando array vazio...');
    
    res.status(500).json({ 
      success: false,
      message: 'Erro ao listar animais do carrossel',
      error: error.message,
      data: [], // Array vazio para não quebrar o frontend
      debug: process.env.NODE_ENV === 'development' ? {
        stack: error.stack,
        sql: error.sql
      } : undefined
    });
  }
};

const removerAnimalDoCarrossel = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('🗑️ [REMOVE] Removendo animal do carrossel, ID:', id);
    
    const result = await CarrosselAnimais.destroy({ 
      where: { id: id } 
    });
    
    if (result === 0) {
      console.log('❌ [REMOVE] Item do carrossel não encontrado:', id);
      return res.status(404).json({ 
        success: false,
        message: 'Item do carrossel não encontrado' 
      });
    }
    
    console.log('✅ [REMOVE] Animal removido do carrossel com sucesso');
    
    res.status(200).json({
      success: true,
      message: 'Animal removido do carrossel com sucesso'
    });
  } catch (error) {
    console.error('❌ [REMOVE] Erro:', error);
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
    
    console.log('📝 [UPDATE] Atualizando descrição de saída:', { id, descricaoSaida });
    
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
    
    console.log('✅ [UPDATE] Descrição de saída atualizada com sucesso');
    
    res.status(200).json({ 
      success: true,
      message: 'Descrição de saída atualizada com sucesso',
      data: {
        id: id,
        descricaoSaida: descricaoSaida.trim()
      }
    });
    
  } catch (error) {
    console.error('❌ [UPDATE] Erro:', error);
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