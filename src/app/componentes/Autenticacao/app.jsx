'use client'
import React, { useState } from "react";
import "./autenticacao.css"; // Arquivo de estilo padrão
import { useRouter } from 'next/navigation';

export default function Autenticacao() {
  const router = useRouter();

  const [usuario, setUsuario] = useState({
    nome: '',
    email: '',
    password: ''
  });

  const [isRightPanelActive, setIsRightPanelActive] = useState(false);

  const alterarNome = (novoNome) => {
    setUsuario((valoresAnteriores) => ({
      ...valoresAnteriores,
      nome: novoNome
    }));
  };

  const alterarEmail = (novoEmail) => {
    setUsuario((valoresAnteriores) => ({
      ...valoresAnteriores,
      email: novoEmail
    }));
  };

  const alterarSenha = (novaSenha) => {
    setUsuario((valoresAnteriores) => ({
      ...valoresAnteriores,
      password: novaSenha
    }));
  };

  // Função para lidar com o cadastro
  const handleCadastro = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/cadastro`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(usuario),
      });

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
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: usuario.email,
          password: usuario.password,
        }),
      });

      const data = await response.json();
      console.log(data);
      if (response.ok) {
        alert("Login realizado com sucesso!");
        router.push('/dashboard'); // Redireciona para o dashboard ou página principal
      } else {
        alert(`Erro: ${data.mensagem}`);
      }
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      alert("Erro ao fazer login. Tente novamente.");
    }
  };

  return (
    <div className="conteudo-do-site">
      <div className={`container ${isRightPanelActive ? "right-panel-active" : ""}`}>
        <div className="form-container sign-up-container">
          <form className="form" onSubmit={handleCadastro}>
            <h1 className="h1">Crie sua Conta</h1>
            <input
              className="input"
              type="text"
              placeholder="digite seu nome"
              value={usuario.nome}
              onChange={(e) => alterarNome(e.target.value)}
            />
            <input
              className="input"
              type="email"
              placeholder="digite seu e-mail"
              value={usuario.email}
              onChange={(e) => alterarEmail(e.target.value)}
            />
            <input
              className="input"
              type="password"
              placeholder="digite sua senha"
              value={usuario.password}
              onChange={(e) => alterarSenha(e.target.value)}
            />
            <button className="button" type="submit">Cadastrar</button>
          </form>
        </div>

        <div className="form-container sign-in-container">
          <form className="form" onSubmit={handleLogin}>
            <h1 className="h1">Fazer Login</h1>
            <input
              className="input"
              type="email"
              placeholder="digite seu e-mail"
              value={usuario.email}
              onChange={(e) => alterarEmail(e.target.value)}
            />
            <input
              className="input"
              type="password"
              placeholder="digite sua senha"
              value={usuario.password}
              onChange={(e) => alterarSenha(e.target.value)}
            />
            <button className="button" type="submit">Logar</button>
          </form>
        </div>

        <div className="overlay-container">
          <div className="overlay">
            <div className="overlay-panel overlay-left">
              <h1 className="h1">Bem Vindo De Volta!</h1>
              <p className="p">Para se manter conectado conosco, por favor logue com a sua conta</p>
              <button className="button fantasma" onClick={() => setIsRightPanelActive(false)}>Logar</button>
            </div>
            <div className="overlay-panel overlay-right">
              <h1 className="h1">Olá, caro usuário!</h1>
              <p className="p">Crie sua conta e entre nessa jornada conosco.</p>
              <button className="button fantasma" onClick={() => setIsRightPanelActive(true)}>Cadastrar</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
