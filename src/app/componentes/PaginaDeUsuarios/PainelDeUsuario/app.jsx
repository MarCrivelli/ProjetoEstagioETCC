"use client";

//================ Importações externas ================//
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Select from "react-select";

//================ Minhas importações ================//
import styles from "./painelUsuario.module.css";
import HeaderVisitantes from "../../Visitantes/HeaderVisitantes/app";
import Footer from "../../Visitantes/Footer/app";
import opcoes from "/src/app/componentes/Administradores/OpcoesDeSelecao/opcoes";

// Função para gerenciar tema (exportada para uso em outros componentes)
export const gerenciadorTema = {
  aplicarTema: (temaEscuro) => {
    if (temaEscuro) {
      document.body.classList.add("tema-escuro");
    } else {
      document.body.classList.remove("tema-escuro");
    }
  },

  salvarTema: (temaEscuro) => {
    localStorage.setItem("tema-escuro", temaEscuro.toString());
  },

  carregarTema: () => {
    return localStorage.getItem("tema-escuro") === "true";
  },

  obterClasseTema: (temaEscuro) => {
    return temaEscuro ? "tema-escuro" : "tema-claro";
  },
};

export default function PainelUsuario({
  usuarioLogado,
  funcaoDeslogarRequerida,
  onUsuarioAtualizado,
}) {
  //================ Estados do botões com switch ================//
  const [emailAtivado, setEmailAtivado] = useState(
    usuarioLogado?.receberEmails || false
  );
  const [whatsappAtivado, setWhatsappAtivado] = useState(
    usuarioLogado?.receberWhatsapp || false
  );
  const [temaEscuro, setTemaEscuro] = useState(
    usuarioLogado?.temaEscuro || false
  );

  //================ Estados para exclusão de conta ================//
  const [overlayExclusaoAtivo, setOverlayExclusaoAtivo] = useState(false);
  const [dadosExclusao, setDadosExclusao] = useState({
    nome: "",
    email: "",
  });
  const [carregandoExclusao, setCarregandoExclusao] = useState(false);

  //================ Estados para Google Login ================//
  const googleButtonRef = useRef(null);
  const [carregandoGoogle, setCarregandoGoogle] = useState(false);

  // Debug: verificar se usuário tem Google ID
  useEffect(() => {
    console.log("Status da conta Google:", {
      googleId: usuarioLogado?.googleId,
      temGoogleId: !!usuarioLogado?.googleId,
      usuario: usuarioLogado,
    });
  }, [usuarioLogado]);

  //================ useEffect para carregar tema salvo ================//
  useEffect(() => {
    const temaSalvo = gerenciadorTema.carregarTema();
    setTemaEscuro(temaSalvo);
    gerenciadorTema.aplicarTema(temaSalvo);
  }, []);

  //================ useEffect para Google Login ================//
  useEffect(() => {
    // Verificar se o token ainda é válido antes de tentar fazer requisições
    const verificarToken = async () => {
      const token = localStorage.getItem("token");
      if (!token) return false;

      try {
        const response = await fetch("http://localhost:3003/verificar-token", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        return response.ok;
      } catch (error) {
        console.error("Erro ao verificar token:", error);
        return false;
      }
    };

    const inicializarGoogle = async () => {
      const tokenValido = await verificarToken();
      if (!tokenValido) {
        console.warn("Token expirado ou inválido");
        // Opcional: redirecionar para login ou renovar token
        return;
      }

      if (
        !window.google &&
        !document.querySelector('script[src*="accounts.google.com"]')
      ) {
        const script = document.createElement("script");
        script.src = "https://accounts.google.com/gsi/client";
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);

        script.onload = () => {
          initializeGoogleButton();
        };
      } else if (window.google) {
        initializeGoogleButton();
      }
    };

    inicializarGoogle();
  }, [usuarioLogado?.googleId]);

  //================ Função para inicializar botão do Google ================//
  const initializeGoogleButton = () => {
    // Renderizar botão do Google apenas se não estiver conectado e o Google estiver disponível
    if (!usuarioLogado?.googleId && googleButtonRef.current && window.google) {
      googleButtonRef.current.innerHTML = "";

      try {
        window.google.accounts.id.initialize({
          client_id:
            "173898638940-la9trlrtts8ngmsj8t2mv455og5s8g86.apps.googleusercontent.com",
          callback: handleGoogleResponse,
          auto_select: false,
          cancel_on_tap_outside: true,
        });

        window.google.accounts.id.renderButton(googleButtonRef.current, {
          theme: "outline",
          size: "medium",
          text: "signin_with",
          shape: "rectangular",
          width: 200,
        });
      } catch (error) {
        console.error("Erro ao inicializar botão do Google:", error);
      }
    }
  };

  //================ Função para lidar com resposta do Google ================//
  const handleGoogleResponse = async (response) => {
    try {
      const decoded = parseJwt(response.credential);
      const dadosGoogle = {
        nome: decoded.name,
        email: decoded.email,
        foto: decoded.picture,
        googleId: decoded.sub,
      };

      await processarLoginGoogle(dadosGoogle, response.credential);
    } catch (error) {
      console.error("Erro ao processar login do Google:", error);
      alert("Erro ao conectar com Google");
    }
  };

  //================ Função para processar login do Google ================//
  const processarLoginGoogle = async (dadosGoogle, token) => {
    setCarregandoGoogle(true);

    try {
      const urlApi = "http://localhost:3003";
      const tokenAuth = localStorage.getItem(token);

      // Verificar se o token ainda é válido
      if (!tokenAuth) {
        alert("Sessão expirada. Por favor, faça login novamente.");
        // Opcional: redirecionar para página de login
        setCarregandoGoogle(false);
        return;
      }

      const resposta = await fetch(`${urlApi}/usuarios/${usuarioLogado.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenAuth}`,
        },
        body: JSON.stringify({
          googleId: dadosGoogle.googleId,
          foto: dadosGoogle.foto,
        }),
      });

      const dados = await resposta.json();

      if (resposta.status === 401) {
        alert("Sua sessão expirou. Por favor, faça login novamente.");
        localStorage.removeItem("token");
        localStorage.removeItem("usuario");
        // Opcional: redirecionar para página de login
        setCarregandoGoogle(false);
        return;
      }

      if (resposta.ok && !dados.erro) {
        alert("Conta conectada com Google com sucesso!");

        if (onUsuarioAtualizado && dados.usuario) {
          onUsuarioAtualizado(dados.usuario);
        }
      } else {
        alert(`Erro: ${dados.mensagem || "Erro ao conectar com Google"}`);
      }
    } catch (erro) {
      console.error("Erro ao conectar com Google:", erro);
      alert("Erro de conexão. Tente novamente.");
    } finally {
      setCarregandoGoogle(false);
    }
  };

  //================ Função para decodificar JWT do Google ================//
  const parseJwt = (token) => {
    try {
      return JSON.parse(atob(token.split(".")[1]));
    } catch (e) {
      return null;
    }
  };

  //================ Função para ativar ou desativar e-mail ================//
  const ativarEmail = async () => {
    const novoEstado = !emailAtivado;
    setEmailAtivado(novoEstado);

    try {
      const urlApi = "http://localhost:3003";
      const token = localStorage.getItem("token");

      const resposta = await fetch(`${urlApi}/usuarios/${usuarioLogado.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          receberEmails: novoEstado,
        }),
      });

      const dados = await resposta.json();

      if (resposta.ok && !dados.erro) {
        if (onUsuarioAtualizado && dados.usuario) {
          onUsuarioAtualizado(dados.usuario);
        }
      } else {
        // Reverter estado se houver erro
        setEmailAtivado(!novoEstado);
        alert(`Erro: ${dados.mensagem || "Erro ao atualizar configuração"}`);
      }
    } catch (erro) {
      // Reverter estado se houver erro
      setEmailAtivado(!novoEstado);
      console.error("Erro ao atualizar configuração de e-mail:", erro);
      alert("Erro de conexão. Tente novamente.");
    }
  };

  //================ Função para ativar ou desativar mensagens ================//
  const ativarMensagensWhatsapp = async () => {
    const novoEstado = !whatsappAtivado;
    setWhatsappAtivado(novoEstado);

    try {
      const urlApi = "http://localhost:3003";
      const token = localStorage.getItem("token");

      const resposta = await fetch(`${urlApi}/usuarios/${usuarioLogado.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          receberWhatsapp: novoEstado,
        }),
      });

      const dados = await resposta.json();

      if (resposta.ok && !dados.erro) {
        if (onUsuarioAtualizado && dados.usuario) {
          onUsuarioAtualizado(dados.usuario);
        }
      } else {
        // Reverter estado se houver erro
        setWhatsappAtivado(!novoEstado);
        alert(`Erro: ${dados.mensagem || "Erro ao atualizar configuração"}`);
      }
    } catch (erro) {
      // Reverter estado se houver erro
      setWhatsappAtivado(!novoEstado);
      console.error("Erro ao atualizar configuração de WhatsApp:", erro);
      alert("Erro de conexão. Tente novamente.");
    }
  };

  //================ Função para alternar tema ================//
  const alternarTema = async (novoTema) => {
    setTemaEscuro(novoTema);
    gerenciadorTema.aplicarTema(novoTema);
    gerenciadorTema.salvarTema(novoTema);

    // Opcional: salvar no backend também
    try {
      const urlApi = "http://localhost:3003";
      const token = localStorage.getItem("token");

      await fetch(`${urlApi}/usuarios/${usuarioLogado.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          temaEscuro: novoTema,
        }),
      });
    } catch (erro) {
      console.error("Erro ao salvar tema no servidor:", erro);
    }
  };

  //================ Funções para exclusão de conta ================//
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
    if (
      dadosExclusao.nome.trim() !== usuarioLogado.nome.trim() ||
      dadosExclusao.email.trim().toLowerCase() !==
        usuarioLogado.email.trim().toLowerCase()
    ) {
      alert("Os dados digitados não correspondem ao usuário logado!");
      return;
    }

    if (
      !window.confirm(
        "Esta ação é irreversível! Tem certeza que deseja excluir sua conta permanentemente?"
      )
    ) {
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
          Authorization: `Bearer ${token}`,
        },
      });

      const dados = await resposta.json();

      if (resposta.ok && !dados.erro) {
        alert("Conta excluída com sucesso!");
        localStorage.removeItem("usuario");
        localStorage.removeItem("token");
        localStorage.removeItem("tema-escuro");
        onUsuarioAtualizado(null);
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

  //================ Renderizar botão do Google ================//
  const renderizarBotaoGoogle = () => {
    if (usuarioLogado?.googleId) {
      // Usuário já está conectado - mostrar botão com classe especial
      return (
        <button className={`${styles.botaoDadoGoogle} contaConectada`} disabled>
          <div className={styles.alinharIconeLog}>
            <img
              className={styles.iconeLog}
              src="/pagAutenticacao/Google.png"
              alt="Google"
            />
          </div>
          <label className={styles.textoBotaoLog}>Google ✓</label>
        </button>
      );
    }

    if (carregandoGoogle) {
      // Estado de carregamento
      return (
        <button className={styles.botaoDadoGoogle} disabled>
            <img
              className={styles.iconeLog}
              src="/pagAutenticacao/Google.png"
              alt="Google"
            />
          <label className={styles.textoBotaoLog}>Conectando...</label>
        </button>
      );
    }

    // Usuário não conectado - mostrar botão padrão do Google ou fallback
    return (
      <div className={styles.containerBotaoGoogle}>
        <div ref={googleButtonRef}></div>
        {/* Fallback caso o botão do Google não carregue */}
        {!window.google && (
          <button className={styles.botaoDadoGoogle} disabled>
            <img
              className={styles.iconeLog}
              src="/pagAutenticacao/Google.png"
              alt="Google"
            />

            <label className={styles.textoBotaoLog}>Carregando Google...</label>
          </button>
        )}
      </div>
    );
  };

  //================ Conteúdo do bloco DADOS DE USUÁRIO ================//
  const ConteudoDadosUsuario = (
    <>
      <div
        className={`${styles.alinharDadoEDescricaoDado} ${styles.excessaoIconeUsuario}`}
      >
        <p className={styles.descricaoDado}>Ícone de usuário</p>
        <div className={styles.espacamentoDado}>
          <img
            className={styles.iconeUsuario}
            src={usuarioLogado.foto || "/user.png"}
            alt="Avatar do usuário"
          />
        </div>
      </div>
      <div className={styles.alinharDadoEDescricaoDado}>
        <p className={styles.descricaoDado}>Nome</p>
        <div className={styles.espacamentoDado}>
          <input
            className={styles.inputDado}
            placeholder={usuarioLogado.nome}
          />
        </div>
      </div>
      <div className={styles.alinharDadoEDescricaoDado}>
        <p className={styles.descricaoDado}>E-mail</p>
        <div className={styles.espacamentoDado}>
          <input
            className={styles.inputDado}
            placeholder={usuarioLogado.email}
            disabled
          />
        </div>
      </div>
      <div className={styles.alinharDadoEDescricaoDado}>
        <p className={styles.descricaoDado}>Senha</p>
        <div className={styles.espacamentoDado}>
          <input
            className={styles.inputDado}
            type="password"
            placeholder="Digite nova senha"
          />
        </div>
      </div>
      <div className={styles.alinharDadoEDescricaoDado}>
        <p className={styles.descricaoDado}>Telefone</p>
        <div className={styles.espacamentoDado}>
          <input
            className={styles.inputDado}
            placeholder={usuarioLogado.telefone || "Inserir número de telefone"}
          />
        </div>
      </div>
    </>
  );

  //================ Conteúdo do bloco CONFIGURAÇÕES ================//
  const ConteudoConfiguracoes = (
    <>
      <div className={styles.alinharDadoEDescricaoDado}>
        <p className={styles.descricaoDado}>Receber e-mails</p>
        <div className={styles.espacamentoDado}>
          <button
            className={`${styles.botaoComSwitch} ${
              emailAtivado ? styles.botaoAtivado : ""
            }`}
            onClick={ativarEmail}
          >
            <div className={styles.switch}></div>
          </button>
        </div>
      </div>
      <div className={styles.alinharDadoEDescricaoDado}>
        <p className={styles.descricaoDado}>Receber mensagens via Whatsapp</p>
        <div className={styles.espacamentoDado}>
          <button
            className={`${styles.botaoComSwitch} ${
              whatsappAtivado ? styles.botaoAtivado : ""
            }`}
            onClick={ativarMensagensWhatsapp}
          >
            <div className={styles.switch}></div>
          </button>
        </div>
      </div>
      <div className={styles.alinharDadoEDescricaoDado}>
        <p className={styles.descricaoDado}>Tema do site</p>
        <div className={styles.espacamentoDado}>
          <Select
            className={styles.selectDado}
            options={opcoes.temasDoSite}
            onChange={(opcaoSelecionada) =>
              alternarTema(opcaoSelecionada.value)
            }
            placeholder="Selecione"
            isSearchable={false}
          />
        </div>
      </div>
      <div className={styles.alinharDadoEDescricaoDado}>
        <p className={styles.descricaoDado}>Contas conectadas</p>
        <div className={`${styles.espacamentoDado} ${styles.seccaoContas}`}>
          {renderizarBotaoGoogle()}
        </div>
      </div>
      <div className={styles.alinharDadoEDescricaoDado}>
        <p className={styles.descricaoDado}>Sair da conta</p>
        <div className={styles.espacamentoDado}>
          <button
            className={`${styles.botaoDado} ${styles.botaoDeslogar}`}
            onClick={funcaoDeslogarRequerida}
          >
            Deslogar
          </button>
        </div>
      </div>
      <div className={styles.alinharDadoEDescricaoDado}>
        <p className={styles.descricaoDado}>Excluir conta</p>
        <div className={styles.espacamentoDado}>
          <button
            className={`${styles.botaoDado} ${styles.botaoExcluir}`}
            onClick={abrirOverlayExclusao}
          >
            Excluir
          </button>
        </div>
      </div>
    </>
  );

  return (
    <div className={styles.fundoDaPagina}>
      <HeaderVisitantes />

      <div className={styles.ajustePainelUsuario}>
        <div className={styles.painelUsuario}>
          <h1 className={styles.tituloPainel}>Painel de Usuários</h1>

          <div className={styles.containerBlocos}>
            <div className={styles.bloco}>
              <h1 className={styles.tituloBloco}>Dados de usuário</h1>
              {ConteudoDadosUsuario}
            </div>

            <div className={styles.bloco}>
              <h1 className={styles.tituloBloco}>Configurações</h1>
              {ConteudoConfiguracoes}
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
              Para confirmar a exclusão da sua conta, digite seu nome e e-mail
              exatamente como aparecem no seu perfil:
            </p>

            <form
              onSubmit={handleExcluirConta}
              className={styles.formularioExclusao}
            >
              <input
                type="text"
                placeholder="Digite seu nome completo"
                value={dadosExclusao.nome}
                onChange={(e) =>
                  setDadosExclusao({ ...dadosExclusao, nome: e.target.value })
                }
                className={styles.campoExclusao}
                required
                disabled={carregandoExclusao}
              />

              <input
                type="email"
                placeholder="Digite seu e-mail"
                value={dadosExclusao.email}
                onChange={(e) =>
                  setDadosExclusao({ ...dadosExclusao, email: e.target.value })
                }
                className={styles.campoExclusao}
                required
                disabled={carregandoExclusao}
              />

              <div className={styles.botoesExclusao}>
                <button
                  type="button"
                  onClick={fecharOverlayExclusao}
                  className={styles.botaoExclusaoSecundario}
                  disabled={carregandoExclusao}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className={styles.botaoExclusaoPrincipal}
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
  );
}
