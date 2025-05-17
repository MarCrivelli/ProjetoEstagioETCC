"use client";
import { useState } from "react";
import styles from "../Autenticacao/autenticacao.module.css";
import HeaderVisitantesSubPaginas from "../Visitantes/HeaderVisitantesSubPaginas/app";
import BotaoParaPaginaDeAdms from "../Visitantes/BotaoPagInicialVisitantes/app";

export default function Autenticacao() {
  const [usuario, setUsuario] = useState({
    nome: "",
    email: "",
    password: "",
  });

  const [isRightPanelActive, setIsRightPanelActive] = useState(false);

  const alterarNome = (novoNome) => {
    setUsuario((valoresAnteriores) => ({
      ...valoresAnteriores,
      nome: novoNome,
    }));
  };

  const alterarEmail = (novoEmail) => {
    setUsuario((valoresAnteriores) => ({
      ...valoresAnteriores,
      email: novoEmail,
    }));
  };

  const alterarSenha = (novaSenha) => {
    setUsuario((valoresAnteriores) => ({
      ...valoresAnteriores,
      password: novaSenha,
    }));
  };

  const handleCadastro = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/cadastro`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(usuario),
        }
      );

      const data = await response.json();
      if (!data.erro) {
        alert("Usuário cadastrado com sucesso!");
        setIsRightPanelActive(false);
      } else {
        alert(`Erro: ${data.mensagem}`);
      }
    } catch (error) {
      console.error("Erro ao cadastrar o usuário:", error);
      alert("Erro ao cadastrar. Tente novamente.");
    }
  };

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: usuario.email,
            password: usuario.password,
          }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        alert("Login realizado com sucesso!");
      } else {
        alert(`Erro: ${data.mensagem}`);
      }
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      alert("Erro ao fazer login. Tente novamente.");
    }
  };

  return (
    <>
      <HeaderVisitantesSubPaginas />
      <BotaoParaPaginaDeAdms/>
      <div className={styles.alinharFormulario}>
        <div
          className={`${styles.containerAutenticacao} ${
            isRightPanelActive ? styles.painelAtivo : ""
          }`}
        >
          {/* Formulário de Cadastro */}
          <div className={`${styles.painelFormulario} ${styles.painelCadastro}`}>
            <form className={styles.formulario} onSubmit={handleCadastro}>
              <h1 className={styles.tituloFormulario}>Crie sua Conta</h1>
              <input
                className={styles.campoInput}
                type="email"
                placeholder="Digite seu e-mail"
                value={usuario.email}
                onChange={(e) => alterarEmail(e.target.value)}
              />
              <input
                className={styles.campoInput}
                type="password"
                placeholder="Digite sua senha"
                value={usuario.password}
                onChange={(e) => alterarSenha(e.target.value)}
              />
              <button className={styles.botaoPrincipal} type="submit">
                Cadastrar
              </button>
            </form>
          </div>

          {/* Formulário de login */}
          <div className={`${styles.painelFormulario} ${styles.painelLogin}`}>
            <form className={styles.formulario} onSubmit={handleLogin}>
              <h1 className={styles.tituloFormulario}>Fazer Login</h1>
              <input
                className={styles.campoInput}
                type="email"
                placeholder="Digite seu e-mail"
                value={usuario.email}
                onChange={(e) => alterarEmail(e.target.value)}
              />
              <input
                className={styles.campoInput}
                type="password"
                placeholder="Digite sua senha"
                value={usuario.password}
                onChange={(e) => alterarSenha(e.target.value)}
              />
              <button className={styles.botaoPrincipal} type="submit">
                Logar
              </button>
            </form>
          </div>

          <div className={styles.containerOverlay}>
            <div className={styles.overlay}>

              <div className={`${styles.painelOverlay} ${styles.painelOverlayEsquerdo}`}>
                <h1 className={styles.tituloFormulario}>
                  Bem Vindo De Volta!
                </h1>
                <p className={styles.textoFormulario}>
                  Para se manter conectado conosco, faça login com sua conta.
                </p>
                <button
                  className={`${styles.botaoPrincipal} ${styles.botaoSecundario}`}
                  onClick={() => setIsRightPanelActive(false)}
                >
                  Logar
                </button>
              </div>

              <div className={`${styles.painelOverlay} ${styles.painelOverlayDireito}`}>
                <h1 className={styles.tituloFormulario}>Ainda não tem conta?</h1>
                <p className={styles.textoFormulario}>
                  Cadastre-se e fique por dentro de todas as dicas e informações que o Instituto tem a oferecer!
                </p>
                <button
                  className={`${styles.botaoPrincipal} ${styles.botaoSecundario}`}
                  onClick={() => setIsRightPanelActive(true)}
                >
                  Cadastrar
                </button>
              </div>
              
            </div>
          </div>

        </div>
      </div>
    </>
  );
}