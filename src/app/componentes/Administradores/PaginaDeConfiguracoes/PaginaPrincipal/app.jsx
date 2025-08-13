import styles from "./configuracoes.module.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

//==========IMPORTAÇÕES DE COMPONENTES==========//
import HeaderAdms from "../../HeaderAdms/app";
import BotaoPagInicial from "../../BotaoPagInicialAdms/app";
import FuncoesDeAdministrador from "../FuncoesAdm/app";
import CarrosselDeDoadores from "../CarrosselDeDoadores/app";
import CarrosselAnimaisAutonomo from "../CarrosselDeAnimais/app";
import RolarPCima from "../../../BotaoScroll/app";

export default function Configuracoes() {
  const [usuarioLogado, setUsuarioLogado] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const carregarUsuario = () => {
      try {
        const dadosUsuario = localStorage.getItem("usuario");
        const token = localStorage.getItem("token");

        if (dadosUsuario && token) {
          const usuario = JSON.parse(dadosUsuario);
          setUsuarioLogado(usuario);
          console.log("👤 Usuário logado carregado:", usuario);
        } else {
          console.log("❌ Nenhum usuário logado encontrado");
          // Opcional: redirecionar para login se não houver usuário logado
          // navigate("/autenticar");
        }
      } catch (error) {
        console.error("Erro ao carregar dados do usuário:", error);
      }
    };

    carregarUsuario();
  }, [navigate]);

  // Função para fazer logout
  const handleLogout = () => {
    if (window.confirm("Tem certeza que deseja sair da sua conta?")) {
      localStorage.removeItem("usuario");
      localStorage.removeItem("token");
      setUsuarioLogado(null);
      console.log("🚪 Usuário deslogado");
      alert("Logout realizado com sucesso!");
      
      // Redirecionar para página de autenticação após logout
      navigate("/autenticar");
    }
  };

  return (
    <div className={styles.fundoPagina}>
      <HeaderAdms />
      <RolarPCima />
      <BotaoPagInicial />
      <div className={styles.fundoPainel}>
        <div className={styles.painel}>
          <div className={styles.inicioPainel}>
            <div className={styles.topoInicioPainel}>
              <h1 className={styles.contaAtual}>Conta atual:</h1>
              <div 
                className={styles.alinharDeslogue}
                onClick={handleLogout}
                style={{ cursor: "pointer" }}
                title="Clique para sair da conta"
              >
                <h1 className={styles.textoDeslogue}>Deslogar</h1>
                <img
                  className={styles.iconeSair}
                  src="/pagConfiguracoes/iconeSair.png"
                  alt="Ícone de logout"
                />
              </div>
            </div>
            <div className={styles.alinharInfoUsuario}>
              <img
                className={styles.iconeUsuario}
                src={usuarioLogado?.foto || "/usuarioTeste.jpeg"}
                alt="Avatar do usuário"
              />
              <h1 className={styles.nomeUsuario}>
                {usuarioLogado ? usuarioLogado.nome : "Carregando..."}
              </h1>
              <p className={styles.funcaoUsuario}>Administrador(a)</p>
            </div>
          </div>

          <div className={styles.alinharSessoes}>
            <div className={styles.sessao}>
              <h1>Funções de administrador</h1>
              <FuncoesDeAdministrador />
            </div>
            <div className={styles.sessao}>
              <h1>Carrossel de doadores</h1>
              <CarrosselDeDoadores />
            </div>
            <div className={styles.sessao}>
              <h1>Carrossel de animais</h1>
              <CarrosselAnimaisAutonomo />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}