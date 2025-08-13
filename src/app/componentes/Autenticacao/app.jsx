"use client";
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import styles from "../Autenticacao/autenticacao.module.css";
import Header from "../Visitantes/HeaderVisitantes/app";
import BotaoParaPaginaDeAdms from "../Visitantes/BotaoPagInicialVisitantes/app";
import Footer from "../Visitantes/Footer/app";

export default function Autenticacao() {
  const googleButtonCadastroRef = useRef(null);
  const googleButtonLoginRef = useRef(null);

  const [painelDireitoAtivo, setPainelDireitoAtivo] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [usuarioLogado, setUsuarioLogado] = useState(null);
  
  // Estado para os formulários de login/cadastro
  const [usuario, setUsuario] = useState({
    nome: "",
    email: "",
    senha: ""
  });
  
  // Estados para o overlay de exclusão
  const [overlayExclusaoAtivo, setOverlayExclusaoAtivo] = useState(false);
  const [dadosExclusao, setDadosExclusao] = useState({
    nome: "",
    email: ""
  });
  const [carregandoExclusao, setCarregandoExclusao] = useState(false);

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

  // Inicializar Google Login apenas se usuário não estiver logado
  useEffect(() => {
    if (usuarioLogado) return; // Não inicializar se já estiver logado

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    console.log("🌐 URL atual:", window.location.origin);
    console.log(
      "🔑 Client ID:",
      "173898638940-la9trlrtts8ngmsj8t2mv455og5s8g86.apps.googleusercontent.com"
    );

    script.onload = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id:
            "173898638940-la9trlrtts8ngmsj8t2mv455og5s8g86.apps.googleusercontent.com",
          callback: handleGoogleResponse,
        });

        if (googleButtonCadastroRef.current) {
          window.google.accounts.id.renderButton(
            googleButtonCadastroRef.current,
            {
              theme: "outline",
              size: "large",
              text: "signup_with",
              shape: "rectangular",
              width: 280,
            }
          );
        }

        if (googleButtonLoginRef.current) {
          window.google.accounts.id.renderButton(googleButtonLoginRef.current, {
            theme: "outline",
            size: "large",
            text: "signin_with",
            shape: "rectangular",
            width: 280,
          });
        }
      }
    };

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [painelDireitoAtivo, usuarioLogado]);

  // Função para lidar com a resposta do Google
  const handleGoogleResponse = async (response) => {
    try {
      const decoded = parseJwt(response.credential);
      console.log("Dados do Google:", decoded);

      const dadosGoogle = {
        nome: decoded.name,
        email: decoded.email,
        foto: decoded.picture,
        googleId: decoded.sub,
      };

      await processarLoginGoogle(dadosGoogle, response.credential);
    } catch (error) {
      console.error("Erro ao processar login do Google:", error);
      alert("Erro ao fazer login com Google");
    }
  };

  const processarLoginGoogle = async (dadosGoogle, token) => {
    setCarregando(true);

    try {
      const urlApi = "http://localhost:3003";

      const resposta = await fetch(`${urlApi}/login-google`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nome: dadosGoogle.nome,
          email: dadosGoogle.email,
          googleId: dadosGoogle.googleId,
          foto: dadosGoogle.foto,
          googleToken: token,
        }),
      });

      const dados = await resposta.json();

      if (resposta.ok && !dados.erro) {
        alert("Login com Google realizado com sucesso!");

        const dadosParaSalvar = {
          ...dados.usuario,
          foto: dadosGoogle.foto,
        };

        salvarDadosUsuario(dadosParaSalvar, dados.token);
        setUsuarioLogado(dadosParaSalvar); // Atualizar estado local
      } else {
        alert(`Erro: ${dados.mensagem || "Erro ao fazer login com Google"}`);
      }
    } catch (erro) {
      console.error("Erro ao processar login do Google:", erro);
      alert("Erro de conexão. Tente novamente.");
    } finally {
      setCarregando(false);
    }
  };

  // Decodificar JWT do Google
  const parseJwt = (token) => {
    try {
      return JSON.parse(atob(token.split(".")[1]));
    } catch (e) {
      return null;
    }
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
      senha: novaSenha,
    }));
  };

  // Função para salvar dados do usuário logado
  const salvarDadosUsuario = (dadosUsuario, token) => {
    localStorage.setItem("token", token);
    localStorage.setItem("usuario", JSON.stringify(dadosUsuario));
    console.log("👤 Usuário logado:", dadosUsuario);
    console.log("🔑 Token salvo");
  };

  // Função para fazer logout
  const handleLogout = () => {
    if (window.confirm("Tem certeza que deseja sair da sua conta?")) {
      localStorage.removeItem("usuario");
      localStorage.removeItem("token");
      setUsuarioLogado(null);
      // Limpar também o formulário
      setUsuario({ nome: "", email: "", senha: "" });
      console.log("🚪 Usuário deslogado");
      alert("Logout realizado com sucesso!");
    }
  };

  // Funções para exclusão de conta
  const abrirOverlayExclusao = () => {
    setOverlayExclusaoAtivo(true);
    setDadosExclusao({ nome: "", email: "" });
  };

  const fecharOverlayExclusao = () => {
    setOverlayExclusaoAtivo(false);
    setDadosExclusao({ nome: "", email: "" });
  };

  const handleExcluirConta = async (evento) => {
    evento.preventDefault();

    // Validar se os dados digitados correspondem ao usuário logado
    if (dadosExclusao.nome.trim() !== usuarioLogado.nome.trim() || 
        dadosExclusao.email.trim().toLowerCase() !== usuarioLogado.email.trim().toLowerCase()) {
      alert("Os dados digitados não correspondem ao usuário logado!");
      return;
    }

    if (!window.confirm("Esta ação é irreversível! Tem certeza que deseja excluir sua conta permanentemente?")) {
      return;
    }

    setCarregandoExclusao(true);

    try {
      const urlApi = "http://localhost:3003";
      const token = localStorage.getItem("token");

      const resposta = await fetch(`${urlApi}/usuarios/${usuarioLogado.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });

      const dados = await resposta.json();

      if (resposta.ok && !dados.erro) {
        alert("Conta excluída com sucesso!");
        localStorage.removeItem("usuario");
        localStorage.removeItem("token");
        setUsuarioLogado(null);
        setUsuario({ nome: "", email: "", senha: "" }); // Limpar formulário
        setOverlayExclusaoAtivo(false);
      } else {
        alert(`Erro: ${dados.mensagem || "Erro ao excluir conta"}`);
      }
    } catch (erro) {
      console.error("Erro ao excluir conta:", erro);
      alert("Erro de conexão. Tente novamente.");
    } finally {
      setCarregandoExclusao(false);
    }
  };

  const manipularCadastro = async (evento) => {
    evento.preventDefault();

    if (!usuario.nome || !usuario.email || !usuario.senha) {
      alert("Por favor, preencha todos os campos");
      return;
    }

    if (usuario.senha.length < 6) {
      alert("A senha deve ter pelo menos 6 caracteres");
      return;
    }

    setCarregando(true);

    try {
      const urlApi = "http://localhost:3003";

      const resposta = await fetch(`${urlApi}/cadastro`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nome: usuario.nome,
          email: usuario.email,
          senha: usuario.senha,
        }),
      });

      const dados = await resposta.json();

      if (resposta.ok && !dados.erro) {
        if (dados.loginAutomatico && dados.token) {
          alert(`${dados.mensagem}`);
          salvarDadosUsuario(dados.usuario, dados.token);
          setUsuarioLogado(dados.usuario);
          setUsuario({ nome: "", email: "", senha: "" });
          setPainelDireitoAtivo(false);
        } else {
          alert("Usuário cadastrado com sucesso!");
          setPainelDireitoAtivo(false);
          setUsuario({ nome: "", email: "", senha: "" });
        }
      } else {
        alert(`Erro: ${dados.mensagem || "Erro desconhecido"}`);
      }
    } catch (erro) {
      console.error("Erro ao cadastrar o usuário:", erro);
      alert("Erro de conexão. Verifique se o servidor está rodando.");
    } finally {
      setCarregando(false);
    }
  };

  const manipularLogin = async (evento) => {
    evento.preventDefault();

    if (!usuario.email || !usuario.senha) {
      alert("Por favor, preencha email e senha");
      return;
    }

    setCarregando(true);

    try {
      const urlApi = "http://localhost:3003";

      const resposta = await fetch(`${urlApi}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: usuario.email,
          senha: usuario.senha,
        }),
      });

      const dados = await resposta.json();

      if (resposta.ok && !dados.erro) {
        alert("Login realizado com sucesso!");
        salvarDadosUsuario(dados.usuario, dados.token);
        setUsuarioLogado(dados.usuario); // Atualizar estado local
        setUsuario({ nome: "", email: "", senha: "" }); // Limpar formulário após login
      } else {
        alert(`Erro: ${dados.mensagem || "Email ou senha incorretos"}`);
      }
    } catch (erro) {
      console.error("Erro ao fazer login:", erro);
      alert("Erro de conexão. Verifique se o servidor está rodando.");
    } finally {
      setCarregando(false);
    }
  };

  return (
    <>
      <BotaoParaPaginaDeAdms />

      {usuarioLogado ? (
        <div className={styles.conteudoPosLogin}>
          <Header />
          <div className={styles.alinharPainel}>
            <div className={styles.painel}>
              <h1 className={styles.tituloPosLogin}>Painel do usuário</h1>
              <div className={styles.alinharBlocos}>
                <div className={`${styles.bloco} ${styles.utilitarios}`}>
                  <h1>Dados de usuário</h1>
                  <div className={styles.agruparDadosUsuario}>
                    <div className={styles.dadoUsuario}>
                      <p>Ícone de usuário</p>
                      <div className={styles.containerImagem}>
                        <img
                          className={styles.iconeUsuario}
                          src={usuarioLogado.foto || "/usuarioTeste.jpeg"}
                          alt="Avatar do usuário"
                        />
                      </div>
                    </div>
                    <div className={styles.dadoUsuario}>
                      <p>Nome</p>
                      <h6>{usuarioLogado.nome}</h6>
                    </div>
                    <div className={styles.dadoUsuario}>
                      <p>E-mail</p>
                      <h6>{usuarioLogado.email}</h6>
                    </div>
                    <div className={styles.dadoUsuario}>
                      <p>Senha</p>
                      <h6>••••••••</h6>
                    </div>
                    <div className={styles.dadoUsuario}>
                      <p>Telefone</p>
                      <h6>+55 67 012345678</h6>
                    </div>
                    <div className={styles.dadoUsuario}>
                      <p>Sair da conta</p>
                      <div className={styles.alinharBotao}>
                        <button
                          onClick={handleLogout}
                          className={`${styles.botaoBloco} ${styles.botaoDeslogar}`}
                        >
                          Deslogar
                        </button>
                      </div>
                    </div>
                  </div>
                  
                </div>

                <div className={`${styles.bloco} ${styles.utilitarios}`}>
                  <h1>Configurações</h1>
                  <div className={styles.agruparDadosUsuario}>
                    <div className={styles.dadoUsuario}>
                      <p>Receber e-mail de eventos</p>
                      <h6>Habilitado</h6>
                    </div>
                    <div className={styles.dadoUsuario}>
                      <p>Receber mensagens de eventos</p>
                      <h6>Habilitado</h6>
                    </div>
                    <div className={styles.dadoUsuario}>
                      <p>Tema do site</p>
                      <h6>Claro</h6>
                    </div>
                    <div className={styles.dadoUsuario}>
                      <p>Excluir conta</p>
                      <div className={styles.alinharBotao}>
                        <button
                          onClick={abrirOverlayExclusao}
                          className={`${styles.botaoBloco} ${styles.botaoExcluir}`}
                        >
                          Excluir
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className={styles.bloco}>
                  <h1>Quero me tornar parceiro!</h1>
                  <p className={styles.subtitulo}>
                    O processo de tratamento dos nossos animais exige a atenção
                    de cada um de nossos membros, pois como nós, eles precisam
                    de afeto, alimentação adequada e um ambiente limpo e seguro.
                    Ao tornar-se parceiro você pode participar da nossa escala
                    de cuidado, onde ficará responsável, juntamente com outro
                    parceiro, pela limpeza do local onde os animais residem e
                    pela troca da água e comida. Além de poder ajudar nossos
                    animais, nossos parceiros podem também ganhar um acesso
                    especial em nosso site, além de um destaque como
                    colaborador. Vale ressaltar que não é necessário ser
                    colaborador para contribuir! Você pode também doar qualquer
                    quantia em dinheiro, além de ração &#40;para filhotes ou
                    adultos&#41; e equipamentos &#40;cones, coleiras,
                    comedouros, etc...&#41;. Quer saber mais sobre como doar?{" "}
                    {""}
                    <Link to="/como_doar">Clique aqui</Link>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Overlay de Exclusão de Conta */}
          {overlayExclusaoAtivo && (
            <div className={styles.overlayExclusao}>
              <div className={styles.cardExclusao}>
                <h2 className={styles.tituloExclusao}>Excluir Conta</h2>
                <p className={styles.avisoExclusao}>
                  Para confirmar a exclusão da sua conta, digite seu nome e e-mail exatamente como aparecem no seu perfil:
                </p>
                
                <form onSubmit={handleExcluirConta} className={styles.formularioExclusao}>
                  <input
                    type="text"
                    placeholder="Digite seu nome completo"
                    value={dadosExclusao.nome}
                    onChange={(e) => setDadosExclusao({ ...dadosExclusao, nome: e.target.value })}
                    className={styles.campoExclusao}
                    required
                    disabled={carregandoExclusao}
                  />
                  
                  <input
                    type="email"
                    placeholder="Digite seu e-mail"
                    value={dadosExclusao.email}
                    onChange={(e) => setDadosExclusao({ ...dadosExclusao, email: e.target.value })}
                    className={styles.campoExclusao}
                    required
                    disabled={carregandoExclusao}
                  />
                  
                  <div className={styles.botoesExclusao}>
                    <button
                      type="button"
                      onClick={fecharOverlayExclusao}
                      className={`${styles.botaoExclusaoSecundario}`}
                      disabled={carregandoExclusao}
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className={`${styles.botaoExclusaoPrincipal}`}
                      disabled={carregandoExclusao}
                    >
                      {carregandoExclusao ? "Excluindo..." : "Confirmar Exclusão"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          <Footer />
        </div>
      ) : (
        <>
          <Header tipo="modoDark"/>
          <div className={styles.alinharFormulario}>
            <div
              className={`${styles.containerAutenticacao} ${
                painelDireitoAtivo ? styles.painelAtivo : ""
              }`}
            >
              {/* Formulário de Cadastro */}
              <div
                className={`${styles.painelFormulario} ${styles.painelCadastro}`}
              >
                <form
                  className={styles.formulario}
                  onSubmit={manipularCadastro}
                >
                  <h1 className={styles.tituloFormulario}>Crie sua Conta</h1>

                  <div
                    style={{
                      margin: "20px 0",
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <div ref={googleButtonCadastroRef}></div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      margin: "20px 0",
                      color: "#666",
                    }}
                  >
                    <hr
                      style={{
                        flex: 1,
                        border: "none",
                        borderTop: "1px solid #ccc",
                      }}
                    />
                    <span style={{ padding: "0 15px", fontSize: "14px" }}>
                      ou
                    </span>
                    <hr
                      style={{
                        flex: 1,
                        border: "none",
                        borderTop: "1px solid #ccc",
                      }}
                    />
                  </div>

                  <input
                    className={styles.campoInput}
                    type="text"
                    placeholder="Digite seu nome completo"
                    value={usuario.nome}
                    onChange={(e) =>
                      setUsuario({ ...usuario, nome: e.target.value })
                    }
                    disabled={carregando}
                    required
                  />

                  <input
                    className={styles.campoInput}
                    type="email"
                    placeholder="Digite seu e-mail"
                    value={usuario.email}
                    onChange={(e) => alterarEmail(e.target.value)}
                    disabled={carregando}
                    required
                  />

                  <input
                    className={styles.campoInput}
                    type="password"
                    placeholder="Digite sua senha (min. 6 caracteres)"
                    value={usuario.senha}
                    onChange={(e) => alterarSenha(e.target.value)}
                    disabled={carregando}
                    required
                    minLength="6"
                  />

                  <button
                    className={styles.botaoPrincipal}
                    type="submit"
                    disabled={carregando}
                  >
                    {carregando ? "Cadastrando..." : "Cadastrar e Entrar"}
                  </button>
                </form>
              </div>

              {/* Formulário de login */}
              <div
                className={`${styles.painelFormulario} ${styles.painelLogin}`}
              >
                <form className={styles.formulario} onSubmit={manipularLogin}>
                  <h1 className={styles.tituloFormulario}>Fazer Login</h1>

                  <div
                    style={{
                      margin: "20px 0",
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <div ref={googleButtonLoginRef}></div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      margin: "20px 0",
                      color: "#666",
                    }}
                  >
                    <hr
                      style={{
                        flex: 1,
                        border: "none",
                        borderTop: "1px solid #ccc",
                      }}
                    />
                    <span style={{ padding: "0 15px", fontSize: "14px" }}>
                      ou
                    </span>
                    <hr
                      style={{
                        flex: 1,
                        border: "none",
                        borderTop: "1px solid #ccc",
                      }}
                    />
                  </div>

                  <input
                    className={styles.campoInput}
                    type="email"
                    placeholder="Digite seu e-mail"
                    value={usuario.email}
                    onChange={(e) => alterarEmail(e.target.value)}
                    disabled={carregando}
                    required
                  />

                  <input
                    className={styles.campoInput}
                    type="password"
                    placeholder="Digite sua senha"
                    value={usuario.senha}
                    onChange={(e) => alterarSenha(e.target.value)}
                    disabled={carregando}
                    required
                  />

                  <button
                    className={styles.botaoPrincipal}
                    type="submit"
                    disabled={carregando}
                  >
                    {carregando ? "Entrando..." : "Entrar"}
                  </button>
                </form>
              </div>

              <div className={styles.containerOverlay}>
                <div className={styles.overlay}>
                  <div
                    className={`${styles.painelOverlay} ${styles.painelOverlayEsquerdo}`}
                  >
                    <h1 className={styles.tituloFormulario}>
                      Bem Vindo De Volta!
                    </h1>
                    <p className={styles.textoFormulario}>
                      Para se manter conectado conosco, faça login com sua
                      conta.
                    </p>
                    <button
                      className={`${styles.botaoPrincipal} ${styles.botaoSecundario}`}
                      onClick={() => setPainelDireitoAtivo(false)}
                      type="button"
                      disabled={carregando}
                    >
                      Logar
                    </button>
                  </div>

                  <div
                    className={`${styles.painelOverlay} ${styles.painelOverlayDireito}`}
                  >
                    <h1 className={styles.tituloFormulario}>
                      Ainda não tem conta?
                    </h1>
                    <p className={styles.textoFormulario}>
                      Cadastre-se e seja automaticamente logado! Fique por
                      dentro de todas as dicas e informações que o Instituto tem
                      a oferecer!
                    </p>
                    <button
                      className={`${styles.botaoPrincipal} ${styles.botaoSecundario}`}
                      onClick={() => setPainelDireitoAtivo(true)}
                      type="button"
                      disabled={carregando}
                    >
                      Cadastrar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}