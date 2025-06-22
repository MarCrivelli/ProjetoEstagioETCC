import styles from "./configuracoes.module.css";
import HeaderAdms from "../../HeaderAdms/app";
import BotaoPagInicial from "../../BotaoPagInicialAdms/app";
import FuncoesDeAdministrador from "../FuncoesAdm/app";
import CarrosselDeDoadores from "../CarrosselDeDoadores/app";
import CarrosselDeAnimais from "../CarrosselDeAnimais/app";
import RolarPCima from "../../../BotaoScroll/app";

export default function Configuracoes() {
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
              <div className={styles.alinharDeslogue}>
                <h1 className={styles.textoDeslogue}>Deslogar</h1>
                <img
                  className={styles.iconeSair}
                  src="/pagConfiguracoes/iconeSair.png"
                ></img>
              </div>
            </div>
            <div className={styles.alinharInfoUsuario}>
              <img
                className={styles.iconeUsuario}
                src="/usuarioTeste.jpeg"
              ></img>
              <h1 className={styles.nomeUsuario}>
                João da Silva Ferreira dos Santos de Paula Crivelli
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
              <CarrosselDeAnimais />
            </div>
          </div>

          
        </div>
      </div>
    </div>
  );
}
