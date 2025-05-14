import Select from "react-select";
import styles from "./funcoesAdm.module.css";

export default function FuncoesDeAdministrador() {
  const usuarios = [
    { value: "usuario1", label: "Kauã" },
    { value: "usuario2", label: "Guilherme" },
    { value: "usuario3", label: "Renan" },
  ];

  const nivelDeAcesso = [
    { value: "administrador", label: "Administrador" },
    { value: "subAdministrador", label: "Sub-administrador" },
    { value: "contribuinte", label: "Contribuínte" },
  ];

  return (
    <div className={styles.conteudoFuncoesAdm}>
      <div className={styles.botoesBlocosFuncao}>
        <div className={styles.botaoRedirecional}>1</div>
        <div className={styles.botaoRedirecional}>2</div>
        <div className={styles.botaoRedirecional}>3</div>
        <div className={styles.botaoRedirecional}>4</div>
        <div className={styles.botaoRedirecional}>5</div>
      </div>

      <div className={styles.blocoFuncao}>
        <div className={styles.funcao}>
          <h1 className={styles.tituloConfig}>Excluir usuário:</h1>
          <Select
            options={usuarios}
            placeholder="Digite ou selecione"
            className={styles.selectConfig}
          />
          <div className={styles.divBotaoFuncao}>
            <button
              className={`${styles.botaoPadraoConfig} ${styles.botaoExcluirUsuario}`}
            >
              Excluir
            </button>
          </div>
        </div>
      </div>

      <div className={styles.blocoFuncao}>
        <div className={styles.funcao}>
          <h1 className={styles.tituloConfig}>
            Alterar nível de acesso de um usuário:
          </h1>
          <Select
            options={usuarios}
            placeholder="Digite ou selecione"
            className={styles.selectConfig}
          />
        </div>
        <div className={styles.funcao}>
          <h1 className={styles.tituloConfig}>
            Escolha o novo nível de acesso:
          </h1>
          <Select
            options={nivelDeAcesso}
            placeholder="Selecione"
            className={styles.selectConfig}
          />
        </div>
        <div className={styles.divBotaoFuncao}>
          <button
            className={`${styles.botaoPadraoConfig} ${styles.botaoAlterarNvlAcesso}`}
          >
            Alterar
          </button>
        </div>
      </div>

      <div className={styles.blocoFuncao}>
        <div className={styles.funcao}>
          <h1 className={styles.tituloConfig}>Convidar novo membro:</h1>
          <input
            className={styles.inputEmail}
            type="email"
            placeholder="Insira um e-mail"
          ></input>
        </div>
        <div className={styles.funcao}>
          <h1 className={styles.tituloConfig}>Escolha o nível de acesso:</h1>
          <Select
            options={nivelDeAcesso}
            placeholder="Selecione"
            className={styles.selectConfig}
          />
        </div>
        <div className={styles.divBotaoFuncao}>
          <button
            className={`${styles.botaoPadraoConfig} ${styles.botaoConvidar}`}
          >
            Convidar
          </button>
        </div>
      </div>
      
    </div>
  );
}
