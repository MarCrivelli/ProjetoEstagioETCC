"use client";
import React, { useState } from "react";
import styles from "../Autenticacao/autenticacao.module.css";
import Header from "../Visitantes/HeaderVisitantes/app";

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

  // Função para lidar com o cadastro
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
      console.log(data);

      if (!data.erro) {
        alert("Usuário cadastrado com sucesso!");
        setIsRightPanelActive(false); // Redireciona para a tela de login
      } else {
        alert(`Erro: ${data.mensagem}`);
      }
    } catch (error) {
      console.error("Erro ao cadastrar o usuário:", error);
      alert("Erro ao cadastrar. Tente novamente.");
    }
  };

  // Função para lidar com o login
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
      console.log(data);
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
    <div>
      <Header />
      <div className={styles.alinharFormulario}>
        <div
          className={`${styles.container} ${
            styles.isRightPanelActive ? styles.rightPanelActive : ""
          }`}
        >
          <div className={`${styles.formContainer} ${styles.signUpContainer}`}>
            <form className={styles.form} onSubmit={handleCadastro}>
              <h1 className={styles.tituloAutenticacao}>Crie sua Conta</h1>
              <input
                className={styles.input}
                type="text"
                placeholder="digite seu nome"
                value={usuario.nome}
                onChange={(e) => alterarNome(e.target.value)}
              />
              <input
                className={styles.input}
                type="email"
                placeholder="digite seu e-mail"
                value={usuario.email}
                onChange={(e) => alterarEmail(e.target.value)}
              />
              <input
                className={styles.input}
                type="password"
                placeholder="digite sua senha"
                value={usuario.password}
                onChange={(e) => alterarSenha(e.target.value)}
              />
              <button className={styles.button} type="submit">
                Cadastrar
              </button>
            </form>
          </div>

          <div className={`${styles.formContainer} ${styles.signInContainer}`}>
            <form className={styles.form} onSubmit={handleLogin}>
              <h1 className={styles.tituloAutenticacao}>Fazer Login</h1>
              <input
                className={styles.input}
                type="email"
                placeholder="digite seu e-mail"
                value={usuario.email}
                onChange={(e) => alterarEmail(e.target.value)}
              />
              <input
                className={styles.input}
                type="password"
                placeholder="digite sua senha"
                value={usuario.password}
                onChange={(e) => alterarSenha(e.target.value)}
              />
              <button className={styles.button} type="submit">
                Logar
              </button>
            </form>
          </div>

          <div className={styles.overlayContainer}>
            <div className={styles.overlay}>
              <div className={`${styles.overlayPanel} ${styles.overlayLeft}`}>
                <h1 className={styles.tituloAutenticacao}>
                  Bem Vindo De Volta!
                </h1>
                <p className={styles.textoAutenticar}>
                  Para se manter conectado conosco, por favor logue com a sua
                  conta
                </p>
                <button
                  className={`${styles.button} ${styles.fantasma}`}
                  onClick={() => setIsRightPanelActive(false)}
                >
                  Logar
                </button>
              </div>
              <div className={`${styles.overlayPanel} ${styles.overlayRight}`}>
                <h1 className={styles.tituloAutenticacao}>
                  Olá, caro usuário!
                </h1>
                <p className={styles.textoAutenticar}>
                  Crie sua conta e entre nessa jornada conosco.
                </p>
                <button
                  className={`${styles.button} ${styles.fantasma}`}
                  onClick={() => setIsRightPanelActive(true)}
                >
                  Cadastrar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
