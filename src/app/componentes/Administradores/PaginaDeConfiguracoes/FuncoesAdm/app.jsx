import { useState } from "react";
import Select from "react-select";
import styles from "./funcoesAdm.module.css";

export default function FuncoesDeAdministrador() {
  const [image, setImage] = useState(null);
  const [valor, setValor] = useState("");
  const [descricao, setDescricao] = useState("");
  const [caracteresRestantes, setCaracteresRestantes] = useState(250);

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

  const onImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setImage(event.target.files[0]);
    }
  };

  const handleValorChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    value = (Number(value) / 100).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
    setValor(value);
  };

  const handleDescricaoChange = (e) => {
    const texto = e.target.value;
    if (texto.length <= 250) {
      setDescricao(texto);
      setCaracteresRestantes(250 - texto.length);
    }
  };

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

      <div className={styles.blocoFuncao}>
        <div className={styles.conteudoPrincipal}>
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
                <div>{image ? image.name : "Nenhum arquivo selecionado"}</div>
              </div>

              <div className={styles.personalizacaoCarrossel}>
                <div>
                  <label>Configurações do carrossel</label>
                </div>
              </div>
            </div>

            <div className={styles.informacoesDoDoador}>
              <div className={styles.dadoDoador}>
                <div className={styles.alinharLabelComObs}>
                  <label className={styles.labelDadoDoador}>Nome doador</label>
                  <label className={styles.textoObservacao}>*Obrigatório</label>
                </div>
                <input className={styles.receptorDeDados} type="text" />
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
                  value={descricao}
                  onChange={handleDescricaoChange}
                  maxLength={250}
                />
                <div
                  className={styles.contadorCaracteres}
                  style={{
                    color:
                      caracteresRestantes <= 50
                        ? "red"
                        : caracteresRestantes <= 100
                        ? "orange"
                        : "inherit",
                  }}
                >
                  {caracteresRestantes} caracteres restantes
                </div>
              </div>

              <div className={styles.dadoDoador}>
                <div className={styles.alinharLabelComObs}>
                  <label className={styles.labelDadoDoador}>Valor</label>
                </div>
                <input
                  className={styles.receptorDeDados}
                  type="text"
                  value={valor}
                  onChange={handleValorChange}
                  placeholder="R$ 0,00"
                />
              </div>
            </div>
          </div>
        </div>

        <div className={styles.containerBotoes}>
          <button
            className={`${styles.botaoPadraoConfig} ${styles.botaoInserirDoador}`}
          >
            Inserir doador
          </button>
        </div>
      </div>
    </div>
  );
}
