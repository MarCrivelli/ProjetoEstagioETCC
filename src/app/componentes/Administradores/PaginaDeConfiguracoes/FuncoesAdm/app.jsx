import styles from "./funcoesAdm.module.css";
import Select from "react-select";
import Accordion from "react-bootstrap/Accordion";
import { useState, useEffect } from "react";

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

      <div className={styles.blocoFuncao}>
        <h1 className={styles.tituloFuncaoCarrossel}>Carrossel de doadores</h1>
        <Accordion className={styles.acordeaoPrincipalCarrossel}>
          <Accordion.Item eventKey="0" className={styles.itemAcordeaoCarrossel}>
            <Accordion.Header>Inserir doador</Accordion.Header>
            <Accordion.Body className={styles.corpoAcordeaoInserirDoador}>

              <div className={styles.fotoDoador}>
                <img
                  className={styles.previaImagem}
                  src={image ? URL.createObjectURL(image) : ""}
                  alt="Prévia da imagem"
                />
                <label htmlFor="inputDeImagem" className={styles.labelDeImagem}>
                  Selecione uma imagem
                </label>
                <input
                  type="file"
                  id="inputDeImagem"
                  className={styles.inputDeImagem}
                />
                <span className={styles.nomeArquivo}>
                  {image ? "Arquivo selecionado" : "Nenhum arquivo selecionado"}
                </span>
              </div>

              <div className={styles.divDadosDoador}>
                <h1 className={styles.tituloDadosDoador}>Dados do doador</h1>
                <div>
                  <label>Nome do doador</label>
                </div>
              </div>
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="1" className={styles.itemAcordeaoCarrossel}>
            <Accordion.Header>Inserir doador</Accordion.Header>
            <Accordion.Body>bbbbbbbbbbbbbbbbbbb</Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </div>

      <div className={styles.ultimoBlocoFuncao}></div>
    </div>
  );
}
