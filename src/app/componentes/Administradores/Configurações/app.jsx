import styles from "./configuracoes.module.css";
import HeaderAdms from "../HeaderAdms/app";
import BotaoPagInicial from "../BotaoPagInicial/app";
import FuncoesDeAdministrador from "./FuncoesAdm/app";
import Accordion from "react-bootstrap/Accordion";

export default function Configuracoes() {
  return (
    <div>
      <HeaderAdms />
      <BotaoPagInicial />
      <div className={styles.fundoConfig}>
        <div className={styles.fundoPainel}>
          <div className={styles.painel}>
            <div className={styles.inicioPainel}>
              <div className={styles.topoInicioPainel}>
                <h1 style={{ fontSize: "1.6rem" }}>Conta atual:</h1>
                <div className={styles.alinharDeslogue}>
                  <h1 className={styles.textoDeslogue}>Deslogar</h1>
                  <img
                    className={styles.iconeSair}
                    src="/pagConfiguracoes/iconeSair.png"
                  ></img>
                </div>
              </div>
              <div className={styles.alinharInfoUsuario}>
                <img className={styles.iconeUsuario} src="/usuario.png"></img>
                <h1 className={styles.nomeUsuario}>
                  João da Silva Ferreira dos Santos de Paula Crivelli
                </h1>
                <p className={styles.funcaoUsuario}>Administrador(a)</p>
              </div>
            </div>
            <Accordion
              className={styles.acordeaoPrincipal}
              defaultActiveKey="0"
            >
              {/* Item das funções de administrador */}
              <Accordion.Item eventKey="0">
                <Accordion.Header>
                  <p className={styles.tituloAcordeao}>
                    Configurações de administrador
                  </p>
                </Accordion.Header>
                <Accordion.Body className={styles.corpoAcordeao}>
                  <FuncoesDeAdministrador />
                </Accordion.Body>
              </Accordion.Item>
              {/* Item das funções de usuário */}
              <Accordion.Item eventKey="1">
                <Accordion.Header>
                  <h1 className={styles.tituloAcordeao}>
                    Configurações de usuário
                  </h1>
                </Accordion.Header>
                <Accordion.Body>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip ex ea commodo consequat. Duis aute
                  irure dolor in reprehenderit in voluptate velit esse cillum
                  dolore eu fugiat nulla pariatur. Excepteur sint occaecat
                  cupidatat non proident, sunt in culpa qui officia deserunt
                  mollit anim id est laborum.
                </Accordion.Body>
              </Accordion.Item>

            </Accordion>
          </div>
        </div>
      </div>
    </div>
  );
}
