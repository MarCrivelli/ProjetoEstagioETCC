const Usuario = require('../models/Usuarios'); 
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();

const cadastrarUsuario = async (req, res) => {
    const { nome, senha, email } = req.body;
    
    // Validação básica
    if (!nome || !senha || !email) {
        return res.status(400).json({
            erro: true,
            mensagem: 'Nome, email e senha são obrigatórios'
        });
    }

    // Validação de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({
            erro: true,
            mensagem: 'Por favor, insira um email válido'
        });
    }

    // Validação de senha
    if (senha.length < 6) {
        return res.status(400).json({
            erro: true,
            mensagem: 'A senha deve ter pelo menos 6 caracteres'
        });
    }

    try {
        // Verificar se o usuário já existe
        const usuarioExistente = await Usuario.findOne({ where: { email } });
        if (usuarioExistente) {
            return res.status(400).json({
                erro: true,
                mensagem: 'Este email já está cadastrado'
            });
        }

        // Criptografar a senha
        const senhaCriptografada = await bcrypt.hash(senha, 10);

        const novoUsuario = await Usuario.create({
            nome: nome.trim(),
            senha: senhaCriptografada,
            email: email.toLowerCase().trim(),
            nivelDeAcesso: 'usuario'
        });

        // Gerar token JWT para login automático
        const token = jwt.sign(
            { 
                id: novoUsuario.id, 
                email: novoUsuario.email,
                nivelDeAcesso: novoUsuario.nivelDeAcesso 
            }, 
            process.env.SEGREDO || 'chave_secreta_desenvolvimento',
            { expiresIn: '24h' }
        );

        res.status(201).json({
            erro: false,
            mensagem: 'Cadastro realizado com sucesso! Você foi logado automaticamente.',
            usuario: {
                id: novoUsuario.id,
                nome: novoUsuario.nome,
                email: novoUsuario.email,
                nivelDeAcesso: novoUsuario.nivelDeAcesso
            },
            token: token, // Token para login automático
            loginAutomatico: true // Flag para o frontend identificar
        });
        console.log(`✅ Usuário cadastrado e logado automaticamente: ${email}`);
    } catch (erro) {
        console.error('❌ Erro no cadastro:', erro);
        
        // Tratamento específico para erros do Sequelize
        if (erro.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({
                erro: true,
                mensagem: 'Este email já está cadastrado'
            });
        }
        
        res.status(500).json({
            erro: true,
            mensagem: 'Erro interno do servidor'
        });
    }
};

const autenticarUsuario = async (req, res) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(400).json({
            erro: true,
            mensagem: 'Email e senha são obrigatórios'
        });
    }

    try {
        const usuario = await Usuario.findOne({
            where: { email: email.toLowerCase().trim() }
        });

        if (!usuario) {
            return res.status(401).json({
                erro: true,
                mensagem: 'Email ou senha incorretos'
            });
        }

        // Verificar senha
        const senhaValida = await bcrypt.compare(senha, usuario.senha);
        
        if (!senhaValida) {
            return res.status(401).json({
                erro: true,
                mensagem: 'Email ou senha incorretos'
            });
        }

        const token = jwt.sign(
            { 
                id: usuario.id, 
                email: usuario.email,
                nivelDeAcesso: usuario.nivelDeAcesso 
            }, 
            process.env.SEGREDO || 'chave_secreta_desenvolvimento',
            { expiresIn: '24h' }
        );

        return res.json({
            erro: false,
            mensagem: 'Login realizado com sucesso!',
            usuario: {
                id: usuario.id,
                nome: usuario.nome,
                email: usuario.email,
                nivelDeAcesso: usuario.nivelDeAcesso
            },
            token: token
        });
    } catch (erro) {
        console.error('❌ Erro no login:', erro);
        res.status(500).json({
            erro: true,
            mensagem: "Erro interno do servidor"
        });
    }
};

// NOVA FUNÇÃO PARA LOGIN COM GOOGLE
const loginComGoogle = async (req, res) => {
  try {
    const { nome, email, googleId, foto, googleToken } = req.body;
    
    console.log('📧 Login Google recebido:', { nome, email, googleId, foto });

    if (!nome || !email) {
        return res.status(400).json({
            erro: true,
            mensagem: 'Nome e email são obrigatórios'
        });
    }

    // Verificar se o usuário já existe no banco
    let usuario = await Usuario.findOne({ 
      where: { email: email.toLowerCase().trim() } 
    });

    if (!usuario) {
      // Se não existir, criar novo usuário
      const senhaPadrao = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      const senhaCriptografada = await bcrypt.hash(senhaPadrao, 10);

      usuario = await Usuario.create({
        nome: nome.trim(),
        email: email.toLowerCase().trim(),
        senha: senhaCriptografada, // Senha aleatória criptografada
        nivelDeAcesso: 'usuario'
      });
      
      console.log('✅ Novo usuário criado via Google:', usuario.email);
    } else {
      console.log('✅ Usuário existente logado via Google:', usuario.email);
    }

    // Gerar token JWT para sua aplicação
    const token = jwt.sign(
      { 
        id: usuario.id, 
        email: usuario.email,
        nivelDeAcesso: usuario.nivelDeAcesso 
      }, 
      process.env.SEGREDO || 'chave_secreta_desenvolvimento',
      { expiresIn: '24h' }
    );

    res.json({
      erro: false,
      mensagem: 'Login com Google realizado com sucesso!',
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        nivelDeAcesso: usuario.nivelDeAcesso
      },
      token: token
    });

  } catch (error) {
    console.error('❌ Erro no login Google:', error);
    res.status(500).json({
      erro: true,
      mensagem: 'Erro interno do servidor: ' + error.message
    });
  }
};

const encontrarUsuario = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        
        if (isNaN(id)) {
            return res.status(400).json({
                erro: true,
                mensagem: 'ID inválido'
            });
        }

        const usuario = await Usuario.findOne({
            where: { id },
            attributes: ['id', 'nome', 'email', 'nivelDeAcesso', 'createdAt', 'updatedAt']
        });
        
        if (!usuario) {
            return res.status(404).json({ 
                erro: true, 
                mensagem: 'Usuário não encontrado' 
            });
        }
        
        return res.json({
            erro: false,
            usuario: usuario
        });
    } catch (erro) {
        console.error('❌ Erro ao buscar usuário:', erro);
        res.status(500).json({ 
            erro: true,
            mensagem: 'Ocorreu um erro ao buscar o usuário.' 
        });
    }
};

const procurarUsuarios = async (req, res) => {
    try {
        const usuarios = await Usuario.findAll({
            attributes: ['id', 'nome', 'email', 'nivelDeAcesso', 'createdAt', 'updatedAt'],
            order: [['createdAt', 'DESC']]
        });
        
        console.log(`📋 Listando ${usuarios.length} usuários`);
        
        return res.json({
            erro: false,
            usuarios: usuarios,
            total: usuarios.length
        });
    } catch (erro) {
        console.error('❌ Erro ao listar usuários:', erro);
        res.status(500).json({ 
            erro: true,
            mensagem: 'Ocorreu um erro ao listar os usuários.' 
        });
    }
};

const deletarUsuario = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        
        if (isNaN(id)) {
            return res.status(400).json({
                erro: true,
                mensagem: 'ID inválido'
            });
        }

        const resultado = await Usuario.destroy({ where: { id } });
        
        if (resultado === 0) {
            return res.status(404).json({
                erro: true,
                mensagem: 'Usuário não encontrado'
            });
        }
        
        res.json({
            erro: false,
            mensagem: 'Usuário deletado com sucesso!'
        });
        console.log(`🗑️ Usuário ID ${id} deletado`);
    } catch (erro) {
        console.error('❌ Erro ao deletar usuário:', erro);
        res.status(500).json({ 
            erro: true,
            mensagem: 'Ocorreu um erro ao deletar o usuário.' 
        });
    }
};

const modificarDadosUsuario = async (req, res) => {
    const { nome, senha, email } = req.body;
    
    try {
        const id = parseInt(req.params.id);
        
        if (isNaN(id)) {
            return res.status(400).json({
                erro: true,
                mensagem: 'ID inválido'
            });
        }

        const dadosParaAtualizar = {};
        
        if (nome) dadosParaAtualizar.nome = nome.trim();
        if (email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return res.status(400).json({
                    erro: true,
                    mensagem: 'Por favor, insira um email válido'
                });
            }
            dadosParaAtualizar.email = email.toLowerCase().trim();
        }
        
        // Se uma nova senha foi fornecida, criptografá-la
        if (senha) {
            if (senha.length < 6) {
                return res.status(400).json({
                    erro: true,
                    mensagem: 'A senha deve ter pelo menos 6 caracteres'
                });
            }
            dadosParaAtualizar.senha = await bcrypt.hash(senha, 10);
        }
        
        if (Object.keys(dadosParaAtualizar).length === 0) {
            return res.status(400).json({
                erro: true,
                mensagem: 'Nenhum dado para atualizar'
            });
        }
        
        const [numeroDeRegistrosAtualizados] = await Usuario.update(dadosParaAtualizar, {
            where: { id }
        });
        
        if (numeroDeRegistrosAtualizados === 0) {
            return res.status(404).json({
                erro: true,
                mensagem: 'Usuário não encontrado'
            });
        }
        
        res.json({
            erro: false,
            mensagem: 'Usuário alterado com sucesso!'
        });
        console.log(`✏️ Usuário ID ${id} atualizado`);
    } catch (erro) {
        console.error('❌ Erro ao alterar usuário:', erro);
        
        if (erro.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({
                erro: true,
                mensagem: 'Este email já está sendo usado por outro usuário'
            });
        }
        
        res.status(500).json({ 
            erro: true,
            mensagem: 'Ocorreu um erro ao alterar o usuário.' 
        });
    }
};

// IMPORTANTE: Adicionar loginComGoogle na exportação
module.exports = { 
    cadastrarUsuario, 
    encontrarUsuario, 
    procurarUsuarios, 
    deletarUsuario, 
    modificarDadosUsuario, 
    autenticarUsuario,
    loginComGoogle // ESTA LINHA É CRUCIAL
};