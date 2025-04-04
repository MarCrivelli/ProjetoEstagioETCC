import styles from "./funcoesAdm.module.css";
import Select from "react-select";
import { useState } from "react";

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

  const [image, setImage] = useState(null);

  const onImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setImage(event.target.files[0]);
    }
  };

  return (
    <div className={styles.conteudoFuncoesAdm}>
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

      <div className={`${styles.blocoFuncao} ${styles.espacamentoDiv}`}>
        <h1 className={styles.tituloDoador}>Inserir doador</h1>

        <div className={styles.alinharDadosDoador}>

          <div className={styles.divEnfeiteCarrosselDoador}>
            <div className={styles.divImagemDoador}>
              <img
                className={styles.previaImagem}
                src={image ? URL.createObjectURL(image) : ""}
                alt="Prévia da imagem"
              />
              <label
                htmlFor="inputDeImagem"
                className={`${styles.labelDeImagem} ${styles.botaoPadraoConfig}`}
              >
                Selecione uma imagem
              </label>
              <input
                type="file"
                id="inputDeImagem"
                onChange={onImageChange}
                className={styles.inputDeImagem}
              />
              <span className={styles.nomeArquivo}>
                {image ? "Arquivo selecionado" : "Nenhum arquivo selecionado"}
              </span>
            </div>

            <div className={styles.personalizacaoCarrossel}>
              <div>
                <label>aaaaaaa</label>
              </div>
            </div>

          </div>

          <div className={styles.informacoesDoDoador}>
            <div className={styles.dadoDoador}>
              <div className={styles.alinharLabelComObs}>
                <label className={styles.labelDadoDoador}>Nome doador</label>
                <label className={styles.textoObservacao}>*Obrigatório</label>
              </div>
              <input className={styles.receptorDeDados} type="text"></input>
            </div>

            <div className={styles.dadoDoador}>
              <div className={styles.alinharLabelComObs}>
                <label className={styles.labelDadoDoador}>
                  Descrição da doação
                </label>
                <label className={styles.textoObservacao}>*Obrigatório</label>
              </div>
              <textarea
                className={`${styles.receptorDeDados} ${styles.textarea}`}
              ></textarea>
            </div>

            <div className={styles.dadoDoador}>
              <div className={styles.alinharLabelComObs}>
                <label className={styles.labelDadoDoador}>Valor</label>
              </div>
              <input className={styles.receptorDeDados} type="color"></input>
            </div>
          </div>
        </div>

        <button
          className={`${styles.botaoPadraoConfig} ${styles.botaoInserirDoador}`}
        >
          Inserir doador
        </button>
      </div>

      <div className={styles.ultimoBlocoFuncao}></div>
    </div>
  );
}
