const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuarios');
require('dotenv').config();

// ═══════════════════════════════════════════════════════════════
// 🔐 MIDDLEWARE DE AUTENTICAÇÃO
// ═══════════════════════════════════════════════════════════════

const verificarToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader) {
            return res.status(401).json({
                erro: true,
                mensagem: 'Token de acesso requerido'
            });
        }
        
        const token = authHeader.split(' ')[1]; // Remove "Bearer "
        
        if (!token) {
            return res.status(401).json({
                erro: true,
                mensagem: 'Token de acesso requerido'
            });
        }
        
        const decoded = jwt.verify(token, process.env.SEGREDO || 'chave_secreta_desenvolvimento');
        
        // Verificar se o usuário ainda existe e está ativo
        const usuario = await Usuario.findOne({
            where: { 
                id: decoded.id, 
                ativo: true 
            }
        });
        
        if (!usuario) {
            return res.status(401).json({
                erro: true,
                mensagem: 'Usuário não encontrado ou inativo'
            });
        }
        
        // Adicionar dados do usuário à requisição
        req.usuario = {
            id: usuario.id,
            email: usuario.email,
            nivelDeAcesso: usuario.nivelDeAcesso,
            nome: usuario.nome
        };
        
        next();
    } catch (erro) {
        console.error('❌ Erro na verificação do token:', erro);
        
        if (erro.name === 'TokenExpiredError') {
            return res.status(401).json({
                erro: true,
                mensagem: 'Token expirado'
            });
        }
        
        if (erro.name === 'JsonWebTokenError') {
            return res.status(401).json({
                erro: true,
                mensagem: 'Token inválido'
            });
        }
        
        return res.status(500).json({
            erro: true,
            mensagem: 'Erro interno do servidor'
        });
    }
};

// ═══════════════════════════════════════════════════════════════
// 🔑 MIDDLEWARE DE AUTORIZAÇÃO POR NÍVEL
// ═══════════════════════════════════════════════════════════════

const verificarNivelAcesso = (niveisPermitidos) => {
    return (req, res, next) => {
        try {
            const nivelUsuario = req.usuario.nivelDeAcesso;
            
            if (!niveisPermitidos.includes(nivelUsuario)) {
                return res.status(403).json({
                    erro: true,
                    mensagem: 'Acesso negado. Nível de permissão insuficiente.',
                    nivelRequerido: niveisPermitidos,
                    nivelAtual: nivelUsuario
                });
            }
            
            next();
        } catch (erro) {
            console.error('❌ Erro na verificação de nível de acesso:', erro);
            return res.status(500).json({
                erro: true,
                mensagem: 'Erro interno do servidor'
            });
        }
    };
};

// ═══════════════════════════════════════════════════════════════
// 🛡️ MIDDLEWARES ESPECÍFICOS PARA CADA NÍVEL
// ═══════════════════════════════════════════════════════════════

// ADMINISTRADOR: Acesso total a todas as funcionalidades
const apenasAdministrador = verificarNivelAcesso(['administrador']);

// SUB-ADMINISTRADOR: Tudo exceto avisos e funções exclusivas de admin
const administradorOuSub = verificarNivelAcesso(['administrador', 'subAdministrador']);

// CONTRIBUINTE: Apenas visualização (rotas públicas + algumas autenticadas)
const contribuinteOuSuperior = verificarNivelAcesso(['administrador', 'subAdministrador', 'contribuinte']);

// ═══════════════════════════════════════════════════════════════
// 🔒 MIDDLEWARE PARA PROTEÇÃO DE ALTERAÇÃO DE DADOS PRÓPRIOS
// ═══════════════════════════════════════════════════════════════

const verificarProprioUsuarioOuAdmin = (req, res, next) => {
    try {
        const idParaAlterar = parseInt(req.params.id);
        const usuarioLogado = req.usuario;
        
        // Admin pode alterar qualquer usuário
        if (usuarioLogado.nivelDeAcesso === 'administrador') {
            return next();
        }
        
        // Usuário só pode alterar próprios dados
        if (usuarioLogado.id === idParaAlterar) {
            // Verificar se está tentando alterar nível de acesso
            if (req.body.nivelDeAcesso) {
                return res.status(403).json({
                    erro: true,
                    mensagem: 'Você não pode alterar seu próprio nível de acesso'
                });
            }
            return next();
        }
        
        // Sub-admin pode alterar usuários de nível inferior
        if (usuarioLogado.nivelDeAcesso === 'subAdministrador') {
            // Buscar o usuário que será alterado
            Usuario.findOne({ where: { id: idParaAlterar } })
                .then(usuarioParaAlterar => {
                    if (!usuarioParaAlterar) {
                        return res.status(404).json({
                            erro: true,
                            mensagem: 'Usuário não encontrado'
                        });
                    }
                    
                    const niveisInferiores = ['contribuinte', 'usuario'];
                    if (niveisInferiores.includes(usuarioParaAlterar.nivelDeAcesso)) {
                        // Verificar se não está tentando promover para admin
                        if (req.body.nivelDeAcesso === 'administrador') {
                            return res.status(403).json({
                                erro: true,
                                mensagem: 'Sub-administradores não podem promover usuários para administrador'
                            });
                        }
                        return next();
                    } else {
                        return res.status(403).json({
                            erro: true,
                            mensagem: 'Você só pode alterar usuários de nível inferior'
                        });
                    }
                })
                .catch(erro => {
                    console.error('❌ Erro ao verificar usuário:', erro);
                    return res.status(500).json({
                        erro: true,
                        mensagem: 'Erro interno do servidor'
                    });
                });
        } else {
            return res.status(403).json({
                erro: true,
                mensagem: 'Acesso negado'
            });
        }
    } catch (erro) {
        console.error('❌ Erro na verificação de permissão:', erro);
        return res.status(500).json({
            erro: true,
            mensagem: 'Erro interno do servidor'
        });
    }
};

module.exports = {
    verificarToken,
    verificarNivelAcesso,
    apenasAdministrador,
    administradorOuSub,
    contribuinteOuSuperior,
    verificarProprioUsuarioOuAdmin
};