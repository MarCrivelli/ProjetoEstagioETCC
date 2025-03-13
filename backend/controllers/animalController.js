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

    console.log("Nome da imagem:", imagem); // Log do nome da imagem

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

module.exports = {
  procurarAnimais,
  cadastrarAnimal,
  buscarAnimalPorId,
};