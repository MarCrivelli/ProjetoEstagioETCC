const User = require('../models/User');
const jwt = require('jsonwebtoken');

require('dotenv').config();

//Na parte de cadastro do usuário, pensei em utilizar o nome que está registrado no e-mail que o usuário definiu, para polpar tempo
const cadastrarUsuario = async (req, res) => {
    const { name, password, email } = req.body;
    await User.create({
        name: name,
        password: password,
        email: email
    }).then(() => {
        res.json('Cadastro de usuário realizado com sucesso!');
        console.log('Cadastro de usuário realizado com sucesso!');
    }).catch((erro) => {
        console.log(`Ops, deu erro: ${erro}`);
    })
}

//Acho que não será preciso uma função para achar um único usuário, pois no front-end irá ter o select para buscar os todos os usuários cadastrados e ele permite pesquisar um único usuário por padrão
const findUser = async (req, res) => {
    try {
        const user = await User.findOne({
            where: { id: parseInt(req.params.id) },
        });
        return res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Ocorreu um erro ao lista os usuário.' });
    }
}

const procurarUsuarios = async (req, res) => {
    try {
        const users = await User.findAll();
        console.log("Mostrando as informações dos usuários");
        return res.json(users);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Ocorreu um erro ao listar os usuários.' });
    }
}

const deletarUsuario = async (req, res) => {
    try {
        await User.destroy({ where: { id: parseInt(req.params.id) } });
        res.json('Usuário deletado com sucesso!');
        console.log('Usuário deletado com sucesso!');
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Ocorreu um erro ao deletar o usuário.' });
    }
}

const modificarDadosUsuario = async (req, res) => {
    const { name, password, email } = req.body;
    try {
        await User.update({
            name: name,
            password: password,
            email: email
        }, {
            where: { id: parseInt(req.params.id) }
        })
        res.json('Usuário alterado com sucesso!');
        console.log('Usuário alterado com sucesso!');
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Ocorreu um erro ao deletar o usuário.' });
    }
}

const autenticarUsuario = async (req, res) => {
    const { email, password } = req.body;

    try {
        const isUserAuthenticated = await User.findOne({
            where: {
                email: email,
                password: password
            }
        });
        const token = jwt.sign({ id: email }, process.env.secret, {
            expiresIn: 86400,
        });
        return res.json({
            name: isUserAuthenticated.name,
            email: isUserAuthenticated.email,
            token: token
        });
    } catch (err) {
        res.json("Usuário não encontrado!");
    }
}

module.exports = { cadastrarUsuario, findUser, procurarUsuarios, deletarUsuario, modificarDadosUsuario, autenticarUsuario };