const Animais = require("../models/Animais");
const multer = require("multer");
const path = require("path");

// Configuração do multer para upload de imagens
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const nomeUnico = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, nomeUnico + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Listar todos os animais
const procurarAnimais = async (req, res) => {
  try {
    const animais = await Animais.findAll();
    res.json(animais);
  } catch (error) {
    console.error("Erro ao listar animais:", error);
    res.status(500).json({ message: "Erro ao listar os animais." });
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
      statusCastracao,
      statusAdocao,
      statusVermifugacao,
    } = req.body;

    const imagem = req.file ? req.file.filename : null;

    const novoAnimal = await Animais.create({
      nome,
      idade,
      sexo,
      tipo,
      statusMicrochipagem,
      statusVacinacao,
      statusCastracao,
      statusAdocao,
      statusVermifugacao,
      imagem,
    });

    res.status(201).json({ message: "Animal cadastrado com sucesso!", animal: novoAnimal });
  } catch (error) {
    console.error("Erro ao cadastrar animal:", error);
    res.status(500).json({ message: "Erro ao cadastrar o animal." });
  }
};

// Buscar animal por ID
const buscarAnimalPorId = async (req, res) => {
  try {
    const animal = await Animais.findByPk(req.params.id);
    if (!animal) {
      return res.status(404).json({ message: "Animal não encontrado." });
    }
    res.json(animal);
  } catch (error) {
    console.error("Erro ao buscar animal:", error);
    res.status(500).json({ message: "Erro ao buscar animal." });
  }
};

// Atualizar imagem de saída
const atualizarImagemSaida = async (req, res) => {
  try {
    const { id } = req.params;
    const imagemSaida = req.file ? req.file.filename : null;

    const animal = await Animais.findByPk(id);
    if (!animal) {
      return res.status(404).json({ message: "Animal não encontrado." });
    }

    animal.imagemSaida = imagemSaida;
    await animal.save();

    res.json({ message: "Imagem de saída atualizada com sucesso!", animal });
  } catch (error) {
    console.error("Erro ao atualizar imagem de saída:", error);
    res.status(500).json({ message: "Erro ao atualizar imagem de saída." });
  }
};

module.exports = {
  procurarAnimais,
  cadastrarAnimal,
  buscarAnimalPorId,
  atualizarImagemSaida,
};