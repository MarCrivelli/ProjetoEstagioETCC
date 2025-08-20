import { useState, useEffect } from "react";
import Select from "react-select";
import styles from "./funcoesAdm.module.css";

export default function FuncoesDeAdministrador() {
  // Estados para gerenciar dados e carregamento
  const [usuarios, setUsuarios] = useState([]);
  const [carregando, setCarregando] = useState(false);

  // Estados para os formulários
  const [usuarioSelecionadoExcluir, setUsuarioSelecionadoExcluir] = useState(null);
  const [usuarioSelecionadoAlterar, setUsuarioSelecionadoAlterar] = useState(null);
  const [novoNivelAcesso, setNovoNivelAcesso] = useState(null);
  const [emailConvite, setEmailConvite] = useState("");
  const [nivelAcessoConvite, setNivelAcessoConvite] = useState(null);

  // Estados para redes sociais (se necessário no futuro)
  const [credenciaisInstagram, setCredenciaisInstagram] = useState({
    usuario: "",
    senha: ""
  });
  const [credenciaisFacebook, setCredenciaisFacebook] = useState({
    email: "",
    senha: ""
  });

  const nivelDeAcesso = [
    { value: "administrador", label: "Administrador" },
    { value: "subAdministrador", label: "Sub-administrador" },
    { value: "contribuinte", label: "Contribuinte" },
    { value: "usuario", label: "Usuário" }
  ];

  // Carregar lista de usuários quando o componente é montado
  useEffect(() => {
    carregarUsuarios();
  }, []);

  const carregarUsuarios = async () => {
    try {
      setCarregando(true);
      const token = localStorage.getItem("token");
      
      const resposta = await fetch("http://localhost:3003/usuarios", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      const dados = await resposta.json();

      if (resposta.ok && !dados.erro) {
        // Converter para formato do Select e filtrar admin fixo
        const usuariosFormatados = dados.usuarios
          .filter(usuario => usuario.email !== 'admin@instituto.com') // Filtrar admin fixo
          .map(usuario => ({
            value: usuario.id,
            label: `${usuario.nome} (${usuario.email})`,
            nivelDeAcesso: usuario.nivelDeAcesso,
            ativo: usuario.ativo
          }));

        setUsuarios(usuariosFormatados);
      } else {
        alert(`Erro ao carregar usuários: ${dados.mensagem}`);
      }
    } catch (error) {
      console.error("Erro ao carregar usuários:", error);
      alert("Erro de conexão ao carregar usuários.");
    } finally {
      setCarregando(false);
    }
  };

  // Função para excluir usuário
  const handleExcluirUsuario = async () => {
    if (!usuarioSelecionadoExcluir) {
      alert("Por favor, selecione um usuário para excluir.");
      return;
    }

    const usuarioParaExcluir = usuarios.find(u => u.value === usuarioSelecionadoExcluir.value);
    
    if (!window.confirm(`Tem certeza que deseja excluir o usuário "${usuarioParaExcluir.label}"? Esta ação é irreversível!`)) {
      return;
    }

    try {
      setCarregando(true);
      const token = localStorage.getItem("token");

      const resposta = await fetch(`http://localhost:3003/usuarios/${usuarioSelecionadoExcluir.value}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      const dados = await resposta.json();

      if (resposta.ok && !dados.erro) {
        alert("Usuário excluído com sucesso!");
        setUsuarioSelecionadoExcluir(null);
        await carregarUsuarios(); // Recarregar lista
      } else {
        alert(`Erro ao excluir usuário: ${dados.mensagem}`);
      }
    } catch (error) {
      console.error("Erro ao excluir usuário:", error);
      alert("Erro de conexão ao excluir usuário.");
    } finally {
      setCarregando(false);
    }
  };

  // Função para alterar nível de acesso
  const handleAlterarNivelAcesso = async () => {
    if (!usuarioSelecionadoAlterar || !novoNivelAcesso) {
      alert("Por favor, selecione um usuário e o novo nível de acesso.");
      return;
    }

    const usuarioParaAlterar = usuarios.find(u => u.value === usuarioSelecionadoAlterar.value);

    if (usuarioParaAlterar.nivelDeAcesso === novoNivelAcesso.value) {
      alert("O usuário já possui este nível de acesso.");
      return;
    }

    if (!window.confirm(`Alterar nível de acesso de "${usuarioParaAlterar.label}" para "${novoNivelAcesso.label}"?`)) {
      return;
    }

    try {
      setCarregando(true);
      const token = localStorage.getItem("token");

      console.log("🔄 Alterando nível de acesso:", {
        usuarioId: usuarioSelecionadoAlterar.value,
        novoNivel: novoNivelAcesso.value
      });

      const resposta = await fetch(`http://localhost:3003/usuarios/${usuarioSelecionadoAlterar.value}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          nivelDeAcesso: novoNivelAcesso.value
        })
      });

      const dados = await resposta.json();
      console.log("📥 Resposta do servidor:", dados);

      if (resposta.ok && !dados.erro) {
        alert("Nível de acesso alterado com sucesso!");
        setUsuarioSelecionadoAlterar(null);
        setNovoNivelAcesso(null);
        await carregarUsuarios(); // Recarregar lista
      } else {
        console.error("❌ Erro na resposta:", dados);
        alert(`Erro ao alterar nível de acesso: ${dados.mensagem || 'Erro desconhecido'}`);
      }
    } catch (error) {
      console.error("❌ Erro ao alterar nível de acesso:", error);
      alert("Erro de conexão ao alterar nível de acesso.");
    } finally {
      setCarregando(false);
    }
  };

  // Função para convidar novo membro (criar usuário)
  const handleConvidarMembro = async () => {
    if (!emailConvite || !nivelAcessoConvite) {
      alert("Por favor, preencha o e-mail e selecione o nível de acesso.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailConvite)) {
      alert("Por favor, insira um e-mail válido.");
      return;
    }

    // Gerar senha temporária
    const senhaTemporaria = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

    if (!window.confirm(`Criar usuário para "${emailConvite}" como "${nivelAcessoConvite.label}"?\nSenha temporária: ${senhaTemporaria}\n\nO usuário deverá alterar a senha no primeiro login.`)) {
      return;
    }

    try {
      setCarregando(true);

      const resposta = await fetch("http://localhost:3003/cadastro", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          nome: emailConvite.split('@')[0], // Usar parte antes do @ como nome temporário
          email: emailConvite,
          senha: senhaTemporaria,
          nivelDeAcesso: nivelAcessoConvite.value
        })
      });

      const dados = await resposta.json();

      if (resposta.ok && !dados.erro) {
        alert(`Usuário criado com sucesso!\nE-mail: ${emailConvite}\nSenha temporária: ${senhaTemporaria}\n\nEnvie estas credenciais ao novo usuário.`);
        setEmailConvite("");
        setNivelAcessoConvite(null);
        await carregarUsuarios(); // Recarregar lista
      } else {
        alert(`Erro ao criar usuário: ${dados.mensagem}`);
      }
    } catch (error) {
      console.error("Erro ao criar usuário:", error);
      alert("Erro de conexão ao criar usuário.");
    } finally {
      setCarregando(false);
    }
  };

  // Funções placeholder para redes sociais (implementar conforme necessário)
  const handleInserirInstagram = () => {
    alert("Funcionalidade de integração com Instagram ainda não implementada.");
  };

  const handleInserirFacebook = () => {
    alert("Funcionalidade de integração com Facebook ainda não implementada.");
  };

  return (
    <div className={styles.conteudoFuncoesAdm}>
      {/* Excluir usuário */}
      <div className={styles.blocoFuncao}>
        <div className={styles.funcao}>
          <h1 className={styles.tituloConfig}>Excluir usuário:</h1>
          <Select
            options={usuarios}
            value={usuarioSelecionadoExcluir}
            onChange={setUsuarioSelecionadoExcluir}
            placeholder={carregando ? "Carregando usuários..." : "Digite ou selecione"}
            className={styles.selectConfig}
            isDisabled={carregando}
            isClearable
          />
        </div>
        <div className={styles.divBotaoFuncao}>
          <button
            className={`${styles.botaoPadraoConfig} ${styles.botaoExcluirUsuario}`}
            onClick={handleExcluirUsuario}
            disabled={carregando || !usuarioSelecionadoExcluir}
          >
            {carregando ? "Excluindo..." : "Excluir"}
          </button>
        </div>
      </div>

      {/* Alterar nível de acesso */}
      <div className={styles.blocoFuncao}>
        <div className={styles.funcao}>
          <h1 className={styles.tituloConfig}>
            Alterar nível de acesso de um usuário:
          </h1>
          <Select
            options={usuarios}
            value={usuarioSelecionadoAlterar}
            onChange={setUsuarioSelecionadoAlterar}
            placeholder={carregando ? "Carregando usuários..." : "Digite ou selecione"}
            className={styles.selectConfig}
            isDisabled={carregando}
            isClearable
          />
        </div>
        <div className={styles.funcao}>
          <h1 className={styles.tituloConfig}>
            Escolha o novo nível de acesso:
          </h1>
          <Select
            options={nivelDeAcesso}
            value={novoNivelAcesso}
            onChange={setNovoNivelAcesso}
            placeholder="Selecione"
            className={styles.selectConfig}
            isDisabled={carregando}
            isClearable
          />
        </div>
        <div className={styles.divBotaoFuncao}>
          <button
            className={`${styles.botaoPadraoConfig} ${styles.botaoAlterarNvlAcesso}`}
            onClick={handleAlterarNivelAcesso}
            disabled={carregando || !usuarioSelecionadoAlterar || !novoNivelAcesso}
          >
            {carregando ? "Alterando..." : "Alterar"}
          </button>
        </div>
      </div>

      {/* Convidar novo membro */}
      <div className={styles.blocoFuncao}>
        <div className={styles.funcao}>
          <h1 className={styles.tituloConfig}>Convidar novo membro:</h1>
          <input
            className={styles.input}
            type="email"
            placeholder="Insira um e-mail"
            value={emailConvite}
            onChange={(e) => setEmailConvite(e.target.value)}
            disabled={carregando}
          />
        </div>
        <div className={styles.funcao}>
          <h1 className={styles.tituloConfig}>Escolha o nível de acesso:</h1>
          <Select
            options={nivelDeAcesso}
            value={nivelAcessoConvite}
            onChange={setNivelAcessoConvite}
            placeholder="Selecione"
            className={styles.selectConfig}
            isDisabled={carregando}
            isClearable
          />
        </div>
        <div className={styles.divBotaoFuncao}>
          <button
            className={`${styles.botaoPadraoConfig} ${styles.botaoConvidar}`}
            onClick={handleConvidarMembro}
            disabled={carregando || !emailConvite || !nivelAcessoConvite}
          >
            {carregando ? "Convidando..." : "Convidar"}
          </button>
        </div>
      </div>

      {/* Instagram do Instituto */}
      <div className={`${styles.blocoFuncao} ${styles.blocoRedesSociais}`}>
        <div className={styles.funcao}>
          <h1 className={styles.tituloConfig}>Instagram do Instituto:</h1>
          <input
            className={styles.input}
            type="text"
            placeholder="Telefone, nome de usuário ou e-mail"
            value={credenciaisInstagram.usuario}
            onChange={(e) => setCredenciaisInstagram({
              ...credenciaisInstagram,
              usuario: e.target.value
            })}
            disabled={carregando}
          />
          <input
            className={styles.input}
            type="password"
            placeholder="Senha"
            value={credenciaisInstagram.senha}
            onChange={(e) => setCredenciaisInstagram({
              ...credenciaisInstagram,
              senha: e.target.value
            })}
            disabled={carregando}
          />
          <div className={styles.divBotaoFuncao}>
            <button
              className={`${styles.botaoPadraoConfig} ${styles.botaoInserirInstagram}`}
              onClick={handleInserirInstagram}
              disabled={carregando}
            >
              Inserir
            </button>
          </div>
        </div>
      </div>

      {/* Facebook do Instituto */}
      <div className={`${styles.blocoFuncao} ${styles.blocoRedesSociais}`}>
        <div className={styles.funcao}>
          <h1 className={styles.tituloConfig}>Facebook do Instituto:</h1>
          <input
            className={styles.input}
            type="text"
            placeholder="E-mail ou telefone"
            value={credenciaisFacebook.email}
            onChange={(e) => setCredenciaisFacebook({
              ...credenciaisFacebook,
              email: e.target.value
            })}
            disabled={carregando}
          />
          <input
            className={styles.input}
            type="password"
            placeholder="Senha"
            value={credenciaisFacebook.senha}
            onChange={(e) => setCredenciaisFacebook({
              ...credenciaisFacebook,
              senha: e.target.value
            })}
            disabled={carregando}
          />
          <div className={styles.divBotaoFuncao}>
            <button
              className={`${styles.botaoPadraoConfig} ${styles.botaoInserirFacebook}`}
              onClick={handleInserirFacebook}
              disabled={carregando}
            >
              Inserir
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}