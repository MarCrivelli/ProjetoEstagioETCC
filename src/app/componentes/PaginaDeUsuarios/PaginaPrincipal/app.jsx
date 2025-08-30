"use client";
import styles from "./paginaPrincipal.module.css";
import { useState, useEffect } from "react";
import BotaoParaPaginaDeAdms from "../../Visitantes/BotaoParaPaginaDeAdms/app";
import CadastroELogin from "../CadastroELogin/app";
import PainelUsuario from "../PainelDeUsuario/app";


export default function GerenciarUsuario() {
  const [usuarioLogado, setUsuarioLogado] = useState(null);

  // Verificar se usuário está logado
  useEffect(() => {
    const verificarUsuarioLogado = () => {
      try {
        const dadosUsuario = localStorage.getItem("usuario");
        const token = localStorage.getItem("token");

        if (dadosUsuario && token) {
          const usuarioData = JSON.parse(dadosUsuario);
          setUsuarioLogado(usuarioData);
          console.log("👤 Usuário já está logado:", usuarioData);
        }
      } catch (error) {
        console.error("Erro ao verificar usuário logado:", error);
      }
    };

    verificarUsuarioLogado();
  }, []);

  // Função para salvar dados do usuário logado
  const salvarDadosUsuario = (dadosUsuario, token) => {
    localStorage.setItem("token", token);
    localStorage.setItem("usuario", JSON.stringify(dadosUsuario));
    console.log("👤 Usuário logado:", dadosUsuario);
    console.log("🔑 Token salvo");
    setUsuarioLogado(dadosUsuario);
  };

  // Função para fazer logout
  const handleLogout = () => {
    if (window.confirm("Tem certeza que deseja sair da sua conta?")) {
      localStorage.removeItem("usuario");
      localStorage.removeItem("token");
      setUsuarioLogado(null);
      console.log("🚪 Usuário deslogado");
      alert("Logout realizado com sucesso!");
    }
  };

  return (
    <div className={styles.appContainer}>
      <BotaoParaPaginaDeAdms />
      
      {usuarioLogado ? (
        <PainelUsuario 
          usuarioLogado={usuarioLogado}
          funcaoDeslogarRequerida={handleLogout}
          onUsuarioAtualizado={setUsuarioLogado}
        />
      ) : (
        <CadastroELogin 
          onLoginSucesso={salvarDadosUsuario}
        />
      )}
    </div>
  );
}