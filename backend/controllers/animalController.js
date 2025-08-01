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

// controllers/animalController.js
const procurarAnimais = async (req, res) => {
  try {
    const animais = await Animais.findAll({
      attributes: [
        'id', 'nome', 'idade', 'sexo', 'tipo', 
        'statusMicrochipagem', 'statusVacinacao',
        'statusCastracao', 'statusAdocao', 
        'statusVermifugacao', 'imagem', 'imagemSaida',
        'dataVacinacao', 'descricao', 'descricaoSaida'  // ADICIONADO
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
      descricaoSaida, // Adicionado aqui
    } = req.body;

    console.log("Dados recebidos para atualizar:", req.body); // Debug

    const animal = await Animais.findByPk(id);
    if (!animal) {
      return res.status(404).json({ message: "Animal não encontrado." });
    }

    // Atualiza os campos
    animal.nome = nome;
    animal.idade = idade;
    animal.sexo = sexo;
    animal.tipo = tipo;
    animal.statusMicrochipagem = statusMicrochipagem;
    animal.dataVacinacao = dataVacinacao || null;
    animal.statusCastracao = statusCastracao;
    animal.statusAdocao = statusAdocao;
    animal.statusVermifugacao = statusVermifugacao;
    animal.descricao = descricao;
    
    // Atualizar descricaoSaida se vier no body
    if (descricaoSaida !== undefined) {
      animal.descricaoSaida = descricaoSaida;
      console.log("Atualizando descricaoSaida para:", descricaoSaida); // Debug
    }

    // Atualiza o status de vacinação automaticamente
    atualizarStatusVacinacao(animal);

    await animal.save();

    console.log("Animal salvo com descricaoSaida:", animal.descricaoSaida); // Debug

    res.json({ 
      message: "Animal atualizado com sucesso!", 
      animal 
    });
  } catch (error) {
    console.error("Erro ao atualizar animal:", error);
    res.status(500).json({ message: "Erro ao atualizar animal." });
  }
};

// Buscar animal por ID
const buscarAnimalPorId = async (req, res) => {
  try {
    const animal = await Animais.findByPk(req.params.id);
    if (!animal) {
      return res.status(404).json({ message: "Animal não encontrado." });
    }
    
    // Garantir que descricaoSaida existe no objeto retornado, mesmo que seja null
    const animalData = animal.toJSON();
    if (!animalData.hasOwnProperty('descricaoSaida')) {
      animalData.descricaoSaida = null;
    }
    
    res.json(animalData);
  } catch (error) {
    console.error("Erro ao buscar animal:", error);
    res.status(500).json({ message: "Erro ao buscar animal." });
  }
};

const atualizarImagemSaida = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verifique se o arquivo foi recebido
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

    // Atualiza apenas a imagem de saída
    animal.imagemSaida = req.file.filename;
    await animal.save();

    res.json({
      success: true,
      message: "Imagem de saída atualizada com sucesso",
      animal
    });

  } catch (error) {
    console.error("Erro ao atualizar imagem de saída:", error);
    res.status(500).json({
      success: false,
      message: "Erro interno ao atualizar imagem",
      error: error.message
    });
  }
};

const atualizarImagemEntrada = async (req, res) => {
  try {
    const { id } = req.params;
    const imagem = req.file ? req.file.filename : null;

    const animal = await Animais.findByPk(id);
    if (!animal) {
      return res.status(404).json({ message: "Animal não encontrado." });
    }

    animal.imagem = imagem;
    await animal.save();

    res.json({ message: "Imagem atualizada com sucesso!", animal });
  } catch (error) {
    console.error("Erro ao atualizar imagem:", error);
    res.status(500).json({ message: "Erro ao atualizar imagem." });
  }
};

const atualizarDescricaoSaida = async (req, res) => {
  try {
    const { id } = req.params;
    const { descricaoSaida } = req.body;  // CORRIGIDO: usar descricaoSaida
    
    console.log("ID recebido:", id);
    console.log("descricaoSaida recebida:", descricaoSaida);
    
    const animal = await Animais.findByPk(id);
    if (!animal) {
      return res.status(404).json({ error: 'Animal não encontrado' });
    }
    
    animal.descricaoSaida = descricaoSaida;  // CORRIGIDO: usar descricaoSaida
    await animal.save();
    
    console.log("Animal salvo com descricaoSaida:", animal.descricaoSaida);
    
    return res.json({
      success: true,
      message: "Descrição de saída atualizada com sucesso",
      animal
    });
  } catch (error) {
    console.error("Erro ao atualizar descrição de saída:", error);
    return res.status(500).json({ 
      success: false,
      error: 'Erro ao atualizar descrição de saída',
      details: error.message
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