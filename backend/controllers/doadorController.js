const Doadores = require("../models/Doadores");
const multer = require("multer");
const path = require("path");

// Reutiliza a mesma configuração do multer que você já tem
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

// Listar todos os doadores
const listarDoadores = async (req, res) => {
  try {
    const doadores = await Doadores.findAll({
      order: [['createdAt', 'DESC']] // Ordena do mais recente para o mais antigo
    });
    res.json(doadores);
  } catch (error) {
    console.error("Erro ao listar doadores:", error);
    res.status(500).json({ message: "Erro ao listar os doadores." });
  }
};

// Cadastrar doador
const cadastrarDoador = async (req, res) => {
  try {
    const { nome, descricao } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Imagem é obrigatória." });
    }

    const novoDoador = await Doadores.create({
      nome,
      descricao,
      imagem: req.file.filename 
    });

    // Adicione o log aqui:
    console.log('Doador criado:', {
      id: novoDoador.id,
      nome: novoDoador.nome,
      imagem: novoDoador.imagem,
      caminhoCompleto: `/uploads/${novoDoador.imagem}`
    });

    res.status(201).json(novoDoador); 
  } catch (error) {
    console.error("Erro ao cadastrar doador:", error);
    res.status(500).json({ message: "Erro ao cadastrar o doador." });
  }
};

// Buscar doador por ID
const buscarDoadorPorId = async (req, res) => {
  try {
    const doador = await Doadores.findByPk(req.params.id);
    if (!doador) {
      return res.status(404).json({ message: "Doador não encontrado." });
    }
    res.json(doador);
  } catch (error) {
    console.error("Erro ao buscar doador:", error);
    res.status(500).json({ message: "Erro ao buscar doador." });
  }
};

// Atualizar doador
const atualizarDoador = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, descricao } = req.body;

    const doador = await Doadores.findByPk(id);
    if (!doador) {
      return res.status(404).json({ message: "Doador não encontrado." });
    }

    // Atualiza os campos
    doador.nome = nome || doador.nome;
    doador.descricao = descricao || doador.descricao;

    // Se uma nova imagem foi enviada
    if (req.file) {
      // Aqui você pode adicionar lógica para deletar a imagem antiga se quiser
      doador.imagem = req.file.filename;
    }

    await doador.save();

    res.json({ 
      message: "Doador atualizado com sucesso!", 
      doador 
    });
  } catch (error) {
    console.error("Erro ao atualizar doador:", error);
    res.status(500).json({ message: "Erro ao atualizar doador." });
  }
};

// Deletar doador
const deletarDoador = async (req, res) => {
  try {
    const doador = await Doadores.findByPk(req.params.id);
    if (!doador) {
      return res.status(404).json({ message: "Doador não encontrado." });
    }

    // Aqui você pode adicionar lógica para deletar a imagem associada se quiser
    await doador.destroy();

    res.json({ message: "Doador deletado com sucesso!" });
  } catch (error) {
    console.error("Erro ao deletar doador:", error);
    res.status(500).json({ message: "Erro ao deletar doador." });
  }
};


module.exports = {
  listarDoadores,
  cadastrarDoador,
  buscarDoadorPorId,
  atualizarDoador,
  deletarDoador,
  upload 
};