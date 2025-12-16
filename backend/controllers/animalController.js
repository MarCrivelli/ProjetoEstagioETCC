const Animais = require("../models/Animais");

const atualizarStatusVacinacao = (animal) => {
  if (animal.dataVacinacao) {
    const umAnoAtras = new Date();
    umAnoAtras.setFullYear(umAnoAtras.getFullYear() - 1);
    
    if (new Date(animal.dataVacinacao) < umAnoAtras) {
      animal.statusVacinacao = 'naoVacinado';
    } else {
      animal.statusVacinacao = 'vacinado';
    }
  }
  return animal;
};

// Buscar todos os animais
const procurarAnimais = async (req, res) => {
  try {
    const animais = await Animais.findAll({
      attributes: [
        'id', 'nome', 'idade', 'sexo', 'tipo', 
        'statusMicrochipagem', 'statusVacinacao',
        'statusCastracao', 'statusAdocao', 
        'statusVermifugacao', 'imagem', 'imagemSaida',
        'dataVacinacao', 'descricao', 'descricaoSaida'
      ],
      order: [['id', 'ASC']]
    });
    
    res.status(200).json(animais);
  } catch (error) {
    console.error('Erro ao buscar animais:', error);
    res.status(500).json({ 
      success: false,
      message: 'Erro ao buscar animais',
      error: error.message
    });
  }
};

// Cadastrar animal
const cadastrarAnimal = async (req, res) => {
  try {
    const {
      nome,
      idade,
      sexo,
      tipo,
      statusMicrochipagem,
      statusVacinacao,
      dataVacinacao,
      statusCastracao,
      statusAdocao,
      statusVermifugacao,
      descricao,
    } = req.body;

    const imagem = req.file ? req.file.filename : null;

    const novoAnimal = await Animais.create({
      nome,
      idade,
      sexo,
      tipo,
      statusMicrochipagem,
      statusVacinacao,
      dataVacinacao: dataVacinacao || null,
      statusCastracao,
      statusAdocao,
      statusVermifugacao,
      descricao,
      imagem,
    });

    res.status(201).json({ message: "Animal cadastrado com sucesso!", animal: novoAnimal });
  } catch (error) {
    console.error("Erro ao cadastrar animal:", error);
    res.status(500).json({ message: "Erro ao cadastrar o animal." });
  }
};

const atualizarAnimal = async (req, res) => {
  try {
    const { id } = req.params;
    const dadosRecebidos = req.body;
    
    console.log('🔄 Atualizando animal ID:', id);
    console.log('📋 Dados recebidos:', dadosRecebidos);
    
    // Validação básica do ID
    if (!id || isNaN(id)) {
      return res.status(400).json({ 
        success: false,
        message: 'ID do animal inválido' 
      });
    }
    
    // Verifica se o animal existe
    const animal = await Animais.findByPk(id);
    if (!animal) {
      console.log('❌ Animal não encontrado:', id);
      return res.status(404).json({ 
        success: false,
        message: "Animal não encontrado." 
      });
    }
    
    console.log('🐾 Animal encontrado:', animal.nome);
    
    // Preparar dados para atualização - FLEXÍVEL para aceitar qualquer campo
    const camposPermitidos = [
      'nome', 'idade', 'sexo', 'tipo', 'statusMicrochipagem', 
      'statusVacinacao', 'dataVacinacao', 'statusCastracao', 
      'statusAdocao', 'statusVermifugacao', 'descricao', 'descricaoSaida'
    ];
    
    const dadosParaAtualizar = {};
    let houveAlteracao = false;
    
    // Processa cada campo permitido
    camposPermitidos.forEach(campo => {
      if (dadosRecebidos.hasOwnProperty(campo)) {
        let valor = dadosRecebidos[campo];
        
        // Tratamento especial para strings - remove espaços desnecessários
        if (typeof valor === 'string') {
          valor = valor.trim();
        }
        
        // Tratamento especial para dataVacinacao
        if (campo === 'dataVacinacao' && !valor) {
          valor = null;
        }
        
        // Só atualiza se o valor for diferente do atual
        if (animal[campo] !== valor) {
          dadosParaAtualizar[campo] = valor;
          houveAlteracao = true;
          console.log(`📝 Campo alterado - ${campo}: "${animal[campo]}" → "${valor}"`);
        }
      }
    });
    
    // Verifica se há algo para atualizar
    if (!houveAlteracao) {
      console.log('ℹ️ Nenhuma alteração detectada');
      return res.status(200).json({ 
        success: true,
        message: 'Nenhuma alteração necessária',
        animal: animal
      });
    }
    
    console.log('📤 Dados que serão atualizados:', dadosParaAtualizar);
    
    // Aplica as alterações no objeto animal
    Object.keys(dadosParaAtualizar).forEach(campo => {
      animal[campo] = dadosParaAtualizar[campo];
    });
    
    // Atualiza o status de vacinação se necessário
    if (dadosParaAtualizar.hasOwnProperty('dataVacinacao') || dadosParaAtualizar.hasOwnProperty('statusVacinacao')) {
      console.log('💉 Atualizando status de vacinação...');
      atualizarStatusVacinacao(animal);
    }
    
    // Salva as alterações
    await animal.save();
    
    console.log('✅ Animal atualizado com sucesso');
    console.log('📋 Dados finais do animal:', {
      id: animal.id,
      nome: animal.nome,
      descricao: animal.descricao,
      descricaoSaida: animal.descricaoSaida
    });
    
    res.status(200).json({ 
      success: true,
      message: "Animal atualizado com sucesso!", 
      animal: animal
    });
    
  } catch (error) {
    console.error("❌ Erro ao atualizar animal:", error);
    console.error("❌ Stack trace:", error.stack);
    
    res.status(500).json({ 
      success: false,
      message: "Erro ao atualizar animal.",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Buscar animal por ID
const buscarAnimalPorId = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('🔍 Buscando animal por ID:', id);
    
    const animal = await Animais.findByPk(id);
    if (!animal) {
      console.log('❌ Animal não encontrado:', id);
      return res.status(404).json({ 
        success: false,
        message: "Animal não encontrado." 
      });
    }
    
    console.log('✅ Animal encontrado:', animal.nome);
    
    // Garantir que descricaoSaida existe no objeto retornado
    const animalData = animal.toJSON();
    if (!animalData.hasOwnProperty('descricaoSaida')) {
      animalData.descricaoSaida = null;
    }
    
    res.status(200).json(animalData);
  } catch (error) {
    console.error("❌ Erro ao buscar animal:", error);
    res.status(500).json({ 
      success: false,
      message: "Erro ao buscar animal.",
      error: error.message
    });
  }
};

// Atualizar imagem de saída
const atualizarImagemSaida = async (req, res) => {
  try {
    const { id } = req.params;
    
    console.log('🖼️ Atualizando imagem de saída do animal:', id);
    
    if (!req.file) {
      return res.status(400).json({ 
        success: false,
        message: "Nenhuma imagem foi enviada" 
      });
    }

    const animal = await Animais.findByPk(id);
    if (!animal) {
      return res.status(404).json({ 
        success: false,
        message: "Animal não encontrado" 
      });
    }

    const imagemAnterior = animal.imagemSaida;
    animal.imagemSaida = req.file.filename;
    await animal.save();
    
    console.log(`✅ Imagem de saída atualizada: "${imagemAnterior}" → "${req.file.filename}"`);

    res.status(200).json({
      success: true,
      message: "Imagem de saída atualizada com sucesso",
      animal: animal
    });

  } catch (error) {
    console.error("❌ Erro ao atualizar imagem de saída:", error);
    res.status(500).json({
      success: false,
      message: "Erro interno ao atualizar imagem",
      error: error.message
    });
  }
};

// Atualizar imagem de entrada
const atualizarImagemEntrada = async (req, res) => {
  try {
    const { id } = req.params;
    
    console.log('🖼️ Atualizando imagem de entrada do animal:', id);
    
    if (!req.file) {
      return res.status(400).json({ 
        success: false,
        message: "Nenhuma imagem foi enviada" 
      });
    }

    const animal = await Animais.findByPk(id);
    if (!animal) {
      return res.status(404).json({ 
        success: false,
        message: "Animal não encontrado." 
      });
    }

    const imagemAnterior = animal.imagem;
    animal.imagem = req.file.filename;
    await animal.save();
    
    console.log(`✅ Imagem de entrada atualizada: "${imagemAnterior}" → "${req.file.filename}"`);

    res.status(200).json({ 
      success: true,
      message: "Imagem atualizada com sucesso!", 
      animal: animal 
    });
  } catch (error) {
    console.error("❌ Erro ao atualizar imagem:", error);
    res.status(500).json({ 
      success: false,
      message: "Erro ao atualizar imagem.",
      error: error.message
    });
  }
};

// Atualizar apenas descrição de saída
const atualizarDescricaoSaida = async (req, res) => {
  try {
    const { id } = req.params;
    const { descricaoSaida } = req.body;
    
    console.log('📝 Atualizando descrição de saída do animal:', id);
    console.log('📋 Nova descrição:', descricaoSaida);
    
    if (!descricaoSaida || descricaoSaida.trim() === '') {
      return res.status(400).json({ 
        success: false,
        message: 'Descrição de saída é obrigatória' 
      });
    }
    
    const animal = await Animais.findByPk(id);
    if (!animal) {
      return res.status(404).json({ 
        success: false,
        message: 'Animal não encontrado' 
      });
    }
    
    const descricaoAnterior = animal.descricaoSaida;
    animal.descricaoSaida = descricaoSaida.trim();
    await animal.save();
    
    console.log(`✅ Descrição de saída atualizada: "${descricaoAnterior}" → "${animal.descricaoSaida}"`);
    
    return res.status(200).json({
      success: true,
      message: "Descrição de saída atualizada com sucesso",
      animal: animal
    });
  } catch (error) {
    console.error("❌ Erro ao atualizar descrição de saída:", error);
    return res.status(500).json({ 
      success: false,
      message: 'Erro ao atualizar descrição de saída',
      error: error.message
    });
  }
};

module.exports = {
  procurarAnimais,
  cadastrarAnimal,
  buscarAnimalPorId,
  atualizarImagemEntrada,
  atualizarImagemSaida,
  atualizarDescricaoSaida,
  atualizarAnimal,
};