import styles from "./animais.module.css";
import HeaderAdms from "../HeaderAdms/app";
import BotaoPagInicial from "../BotaoPagInicial/app";
import Accordion from "react-bootstrap/Accordion";
import Select from "react-select";
import { useState } from "react";

export default function FichasDeAnimais() {
  const tipoAnimal = [
    { value: "cachorro", label: "Cachorro" },
    { value: "gato", label: "Gato" },
    { value: "ave", label: "Ave" },
  ];
  const idadeAnimais = [
    { value: "1", label: "1 ano" },
    { value: "2", label: "2 anos" },
    { value: "3", label: "3 anos" },
    { value: "4", label: "4 anos" },
    { value: "5", label: "5 anos" },
    { value: "6", label: "6 anos" },
    { value: "7", label: "7 anos" },
    { value: "8", label: "8 anos" },
    { value: "9", label: "9 anos" },
    { value: "10", label: "10 anos" },
    { value: "11", label: "11 anos" },
    { value: "12", label: "12 anos" },
    { value: "13", label: "13 anos" },
    { value: "14", label: "14 anos" },
    { value: "15", label: "15 anos" },
    { value: "16", label: "16 anos" },
    { value: "17", label: "17 anos" },
    { value: "18", label: "18 anos" },
    { value: "19", label: "19 anos" },
    { value: "20", label: "20 anos" },
  ];
  const sexoDoAnimal = [
    { value: "macho", label: "Macho" },
    { value: "femea", label: "Fêmea" },
  ];
  const StatusVacinacao = [
    { value: "vacinado", label: "Vacinado" },
    { value: "naoVacinado", label: "Não vacinado" },
  ];
  const StatusCastracao = [
    { value: "castrado", label: "Castrado" },
    { value: "naoCastrado", label: "Não castrado" },
  ];
  const StatusAdocao = [
    { value: "adotado", label: "Adotado" },
    { value: "naoAdotado", label: "Não adotado" },
  ];

  const [image, setImage] = useState(null);

  const onImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setImage(URL.createObjectURL(event.target.files[0]));
    }
  };
  return (
    <div>
      <HeaderAdms />
      <BotaoPagInicial />
      <div className={styles.utilitarios}>
        <Accordion className={styles.acordeao} defaultActiveKey="0">
          <Accordion.Item eventKey="0">
            <Accordion.Header>
              <h1 className={styles.tituloAcordeao}>Filtros de pesquisa</h1>
            </Accordion.Header>
            <Accordion.Body className={styles.corpoAcordeao}>
              <div className={styles.containerFiltrosDeSelecao}>
                <Select
                  isMulti
                  options={tipoAnimal}
                  classNamePrefix="select"
                  placeholder="Tipo de animal"
                  className={styles.filtroSelecao}
                />
                <Select
                  isMulti
                  options={idadeAnimais}
                  placeholder="idade"
                  className={styles.filtroSelecao}
                />
                <Select
                  isMulti
                  options={sexoDoAnimal}
                  placeholder="sexo"
                  className={styles.filtroSelecao}
                />
                <Select
                  isMulti
                  options={StatusVacinacao}
                  placeholder="Status de vacinação"
                  className={styles.filtroSelecao}
                />
                <Select
                  isMulti
                  options={StatusCastracao}
                  placeholder="Status de castração"
                  className={styles.filtroSelecao}
                />
                <Select
                  isMulti
                  options={StatusAdocao}
                  placeholder="Status de adoção"
                  className={styles.filtroSelecao}
                />
              </div>

              <div className={styles.containerPesquisa}>
                <input
                  className={styles.barrinhaDePesquisa}
                  type="text"
                  name=""
                  placeholder="Pesquise pelo nome"
                ></input>
                <button className={styles.botaoPesquisar} href="#">
                  <img
                    className={styles.lupa}
                    src="/pagFichasDAnimais/lupa.png"
                  ></img>
                </button>
              </div>
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="1">
            <Accordion.Header>
              <h1 className={styles.tituloAcordeao}>Inserir ficha de animal</h1>
            </Accordion.Header>
            <Accordion.Body className={styles.corpoAcordeao2}>
              <div className={styles.inserirImagem}>
                <img
                  className={styles.previaImagem}
                  src={image}
                  alt="Prévia da imagem"
                />
                <label htmlFor="inputDeImagem" className={styles.labelDeImagem}>
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
              <div className={styles.itemInserir}>
                <h1 className={styles.tituloItemInserir}>
                  Dados de identificação
                </h1>
                <div className={styles.alinharDadosDeInsercao}>
                  <label className={styles.labelDeIdentificacao}>Nome:</label>
                  <input
                    className={styles.inputDadosIdentificacao}
                    maxLength={30}
                    type="text"
                    placeholder="max. de 30 caracteres"
                  />
                </div>
                <div className={styles.alinharDadosDeInsercao}>
                  <label className={styles.labelDeIdentificacao}>Idade:</label>
                  <input
                    className={styles.inputDadosIdentificacao}
                    min="0"
                    max="20"
                    type="number"
                    placeholder="insira uma idade"
                  />
                </div>
                <div className={styles.alinharDadosDeInsercao}>
                  <label className={styles.labelDeIdentificacao}>Sexo:</label>
                  <Select
                    options={sexoDoAnimal}
                    placeholder="selecione"
                    className={styles.selectInserirAnimal}
                  />
                </div>
                <div className={styles.alinharDadosDeInsercao}>
                  <label className={styles.labelDeIdentificacao}>Tipo:</label>
                  <Select
                    options={tipoAnimal}
                    classNamePrefix="select"
                    placeholder="selecione"
                    className={styles.selectInserirAnimal}
                  />
                </div>
              </div>
              <div className={styles.itemInserir2}>
                <h1 className={styles.tituloItemInserir}>Dados de saúde</h1>
                <div className={styles.alinharDadosDeInsercao}>
                  <label className={styles.labelDadosSaude}>
                    Status de vacinação:
                  </label>
                  <Select
                    options={StatusVacinacao}
                    placeholder="selecione"
                    className={styles.selectInserirAnimal}
                  />
                </div>
                <div className={styles.alinharDadosDeInsercao}>
                  <label className={styles.labelDadosSaude}>
                    Status de castração:
                  </label>
                  <Select
                    options={StatusCastracao}
                    placeholder="selecione"
                    className={styles.selectInserirAnimal}
                  />
                </div>
                <div className={styles.alinharDadosDeInsercao}>
                  <label className={styles.labelDadosSaude}>
                    Status de adoção:
                  </label>
                  <Select
                    options={StatusAdocao}
                    placeholder="selecione"
                    className={styles.selectInserirAnimal}
                  />
                </div>
              </div>
              <div className={styles.alinharBotaoInserir}>
                <button className={styles.botaoInserir}>Inserir animal</button>
              </div>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </div>
      <div className={styles.alinharPainel}>
        <div className={styles.fundoPainel}>
          {[...Array(10)].map((_, index) => (
            <div className={styles.cardAnimais} key={index}>
              <div className={styles.divImagem}>
                <img
                  className={styles.imagemAnimais}
                  src="/pagFichasDAnimais/imagemTeste.jpg"
                  alt="Imagem inexistente ou não encontrada"
                />
              </div>
              <div className={styles.infoAnimais}>
                <h1 className={styles.nomeAnimal}>Scooby</h1>
                <p className={styles.dadosAnimais}>Idade: ∞</p>
                <p className={styles.dadosAnimais}>
                  Sexo: macho
                </p>
                <p className={styles.dadosAnimais}>
                  Status de castração: Castrado
                </p>
                <button className={styles.botaoVerMais}>Ver mais</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
