const Animais = require("../models/Animais");
const jwt = require("jsonwebtoken");

require("dotenv").config();

const cadastrarAnimal = async (req, res) => {
  const {
    nome,
    idade,
    sexo,
    tipo,
    statusMicrochipagem,
    statusVacinacao,
    statusCastracao,
    statusAdocao,
    statusVemifugacao,
  } = req.body;
  await Animais.create({
    nome: nome,
    idade: idade,
    sexo: sexo,
    tipo: tipo,
    statusMicrochipagem: statusMicrochipagem,
    statusVacinacao: statusVacinacao,
    statusCastracao: statusCastracao,
    statusAdocao: statusAdocao,
    statusVemifugacao: statusVemifugacao,
  })
    .then(() => {
      res.json("Cadastro de usuário realizado com sucesso!");
      console.log("Cadastro de usuário realizado com sucesso!");
    })
    .catch((erro) => {
      console.log(`Ops, deu erro: ${erro}`);
    });
};

const procurarAnimais = async (req, res) => {
  try {
    const animais = await Animais.findAll();
    console.log("Mostrando as informações dos usuários");
    return res.json(animais);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Ocorreu um erro ao listar os usuários." });
  }
};

const modificarDadosAnimais = async (req, res) => {
  const {
    nome,
    idade,
    sexo,
    tipo,
    statusMicrochipagem,
    statusVacinacao,
    statusCastracao,
    statusAdocao,
    statusVemifugacao,
  } = req.body;
  try {
    await Animais.update(
      {
        nome: nome,
        idade: idade,
        sexo: sexo,
        tipo: tipo,
        statusMicrochipagem: statusMicrochipagem,
        statusVacinacao: statusVacinacao,
        statusCastracao: statusCastracao,
        statusAdocao: statusAdocao,
        statusVemifugacao: statusVemifugacao,
      },
      {
        where: { id: parseInt(req.params.id) },
      }
    );
    res.json("Dado(s) alterado(s) com sucesso!");
    console.log("Dado(s) alterado(s) com sucesso!");
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Ocorreu um erro ao alterar os dados." });
  }
};

module.exports = {
  cadastrarAnimal,
  procurarAnimais,
  modificarDadosAnimais
};
