import styles from "./animais.module.css";
import HeaderAdms from "../HeaderAdms/app";
import BotaoPagInicial from "../BotaoPagInicial/app";
import Accordion from "react-bootstrap/Accordion";
import Select from "react-select";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function FichasDeAnimais() {
  const [animaisCompleto, setAnimaisCompleto] = useState([]);
  const [animais, setAnimais] = useState([]);
  const [nome, setNome] = useState("");
  const [idade, setIdade] = useState("");
  const [sexo, setSexo] = useState("");
  const [tipo, setTipo] = useState("");
  const [statusMicrochipagem, setStatusMicrochipagem] = useState("");
  const [statusVacinacao, setStatusVacinacao] = useState("");
  const [statusCastracao, setStatusCastracao] = useState("");
  const [statusAdocao, setStatusAdocao] = useState("");
  const [statusVermifugacao, setStatusVermifugacao] = useState("");
  const [image, setImage] = useState(null);

  const [filtros, setFiltros] = useState({
    tipo: [],
    idade: [],
    sexo: [],
    statusVacinacao: [],
    statusCastracao: [],
    statusAdocao: [],
    statusMicrochipagem: [],
    statusVermifugacao: [],
  });

  const navigation = useNavigate();

  const registrarAnimal = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("nome", nome);
    formData.append("idade", idade);
    formData.append("sexo", sexo);
    formData.append("tipo", tipo);
    formData.append("statusMicrochipagem", statusMicrochipagem);
    formData.append("statusVacinacao", statusVacinacao);
    formData.append("statusCastracao", statusCastracao);
    formData.append("statusAdocao", statusAdocao);
    formData.append("statusVermifugacao", statusVermifugacao); 
    if (image) {
      formData.append("imagem", image);
    }

    // Log dos dados do formulário
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }

    try {
      const resposta = await fetch("http://localhost:3003/animais", {
        method: "POST",
        body: formData,
      });

      if (resposta.ok) {
        alert("Animal cadastrado com sucesso!");
        navigation("/fichas_de_animais");
      } else {
        const erro = await resposta.json();
        console.error("Erro ao cadastrar animal:", erro);
        alert("Erro ao cadastrar o animal.");
      }
    } catch (error) {
      console.error("Erro ao cadastrar animal:", error);
      alert("Ocorreu um erro na aplicação!");
    }
  };

  // Função para buscar os animais
  useEffect(() => {
    const buscarAnimais = async () => {
      try {
        const resposta = await fetch("http://localhost:3003/listar/animais");
        const dados = await resposta.json();
        setAnimais(dados);
        setAnimaisCompleto(dados);
      } catch {
        alert("Ocorreu um erro no app!");
      }
    };
    buscarAnimais();
  }, []);

  // Função para aplicar os filtros
  const aplicarFiltros = () => {
    let animaisFiltrados = animaisCompleto;

    animaisFiltrados = animaisFiltrados.filter((animal) => {
      return (
        (filtros.tipo.length === 0 || filtros.tipo.includes(animal.tipo)) &&
        (filtros.idade.length === 0 ||
          filtros.idade.includes(animal.idade.toString())) &&
        (filtros.sexo.length === 0 || filtros.sexo.includes(animal.sexo)) &&
        (filtros.statusVacinacao.length === 0 ||
          filtros.statusVacinacao.includes(animal.statusVacinacao)) &&
        (filtros.statusCastracao.length === 0 ||
          filtros.statusCastracao.includes(animal.statusCastracao)) &&
        (filtros.statusAdocao.length === 0 ||
          filtros.statusAdocao.includes(animal.statusAdocao)) &&
        (filtros.statusMicrochipagem.length === 0 ||
          filtros.statusMicrochipagem.includes(animal.statusMicrochipagem)) &&
        (filtros.statusVermifugacao.length === 0 ||
          filtros.statusVermifugacao.includes(animal.statusVermifugacao))
      );
    });

    setAnimais(animaisFiltrados);
  };

  // Aplica os filtros sempre que o estado de filtros mudar
  useEffect(() => {
    aplicarFiltros();
  }, [filtros]);

  // Opções para os filtros
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
    { value: "emObservacao", label: "Em observação" },
  ];
  const StatusMicrochipagem = [
    { value: "microchipado", label: "Microchipado" },
    { value: "semMicrochip", label: "Sem microchip" },
  ];
  const StatusVermifugacao = [
    { value: "estaComVerme", label: "Está com verme" },
    { value: "semVerme", label: "Sem Vermes" },
  ];

  // Função para lidar com a seleção de imagem
  const onImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setImage(event.target.files[0]);
    }
  };

  return (
    <div>
      <HeaderAdms />
      <BotaoPagInicial />
      <div className={styles.utilitarios}>
        <Accordion className={styles.acordeao} defaultActiveKey="0">
          {/* Acordeão de filtro */}
          <Accordion.Item eventKey="0">
            <Accordion.Header>
              <h1 className={styles.tituloAcordeao}>Filtros de pesquisa</h1>
            </Accordion.Header>
            <Accordion.Body className={styles.corpoAcordeao}>
              <div className={styles.containerFiltrosDeSelecao}>
                <Select
                  isMulti
                  options={tipoAnimal}
                  placeholder="Tipo de animal"
                  onChange={(selectedOptions) =>
                    setFiltros((prev) => ({
                      ...prev,
                      tipo: selectedOptions.map((opt) => opt.value),
                    }))
                  }
                  className={styles.filtroSelecao}
                />
                <Select
                  isMulti
                  options={idadeAnimais}
                  placeholder="Idade"
                  onChange={(selectedOptions) =>
                    setFiltros((prev) => ({
                      ...prev,
                      idade: selectedOptions.map((opt) => opt.value),
                    }))
                  }
                  className={styles.filtroSelecao}
                />
                <Select
                  isMulti
                  options={sexoDoAnimal}
                  placeholder="Sexo"
                  onChange={(selectedOptions) =>
                    setFiltros((prev) => ({
                      ...prev,
                      sexo: selectedOptions.map((opt) => opt.value),
                    }))
                  }
                  className={styles.filtroSelecao}
                />
                <Select
                  isMulti
                  options={StatusVacinacao}
                  placeholder="Status de vacinação"
                  onChange={(selectedOptions) =>
                    setFiltros((prev) => ({
                      ...prev,
                      statusVacinacao: selectedOptions.map((opt) => opt.value),
                    }))
                  }
                  className={styles.filtroSelecao}
                />
                <Select
                  isMulti
                  options={StatusCastracao}
                  placeholder="Status de castração"
                  onChange={(selectedOptions) =>
                    setFiltros((prev) => ({
                      ...prev,
                      statusCastracao: selectedOptions.map((opt) => opt.value),
                    }))
                  }
                  className={styles.filtroSelecao}
                />
                <Select
                  isMulti
                  options={StatusAdocao}
                  placeholder="Status de adoção"
                  onChange={(selectedOptions) =>
                    setFiltros((prev) => ({
                      ...prev,
                      statusAdocao: selectedOptions.map((opt) => opt.value),
                    }))
                  }
                  className={styles.filtroSelecao}
                />
                <Select
                  isMulti
                  options={StatusMicrochipagem}
                  placeholder="Status de microchipagem"
                  onChange={(selectedOptions) =>
                    setFiltros((prev) => ({
                      ...prev,
                      statusMicrochipagem: selectedOptions.map(
                        (opt) => opt.value
                      ),
                    }))
                  }
                  className={styles.filtroSelecao}
                />
                <Select
                  isMulti
                  options={StatusVermifugacao}
                  placeholder="Status de vermifugação"
                  onChange={(selectedOptions) =>
                    setFiltros((prev) => ({
                      ...prev,
                      statusVermifugacao: selectedOptions.map(
                        (opt) => opt.value
                      ),
                    }))
                  }
                  className={styles.filtroSelecao}
                />
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
              </div>
            </Accordion.Body>
          </Accordion.Item>

          {/* Acordeão de cadastro */}
          <Accordion.Item eventKey="1">
            <Accordion.Header>
              <h1 className={styles.tituloAcordeao}>Inserir ficha de animal</h1>
            </Accordion.Header>
            <Accordion.Body>
              <form
                onSubmit={registrarAnimal}
                className={styles.formularioCadastro}
              >
                <div className={styles.inserirImagem}>
                  <img
                    className={styles.previaImagem}
                    src={image ? URL.createObjectURL(image) : ""}
                    alt="Prévia da imagem"
                  />
                  <label
                    htmlFor="inputDeImagem"
                    className={styles.labelDeImagem}
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
                    {image
                      ? "Arquivo selecionado"
                      : "Nenhum arquivo selecionado"}
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
                      value={nome}
                      onChange={(event) => setNome(event.target.value)}
                    />
                  </div>
                  <div className={styles.alinharDadosDeInsercao}>
                    <label className={styles.labelDeIdentificacao}>
                      Idade:
                    </label>
                    <input
                      className={styles.inputDadosIdentificacao}
                      min="0"
                      max="20"
                      type="number"
                      placeholder="insira uma idade"
                      value={idade}
                      onChange={(event) => setIdade(event.target.value)}
                    />
                  </div>
                  <div className={styles.alinharDadosDeInsercao}>
                    <label className={styles.labelDeIdentificacao}>Sexo:</label>
                    <Select
                      options={sexoDoAnimal}
                      placeholder="selecione"
                      className={styles.selectInserirAnimal}
                      onChange={(selectedOption) =>
                        setSexo(selectedOption.value)
                      }
                    />
                  </div>
                  <div className={styles.alinharDadosDeInsercao}>
                    <label className={styles.labelDeIdentificacao}>Tipo:</label>
                    <Select
                      options={tipoAnimal}
                      placeholder="selecione"
                      className={styles.selectInserirAnimal}
                      onChange={(selectedOption) =>
                        setTipo(selectedOption.value)
                      }
                    />
                  </div>
                  <div className={styles.alinharDadosDeInsercao}>
                    <label className={styles.labelDeIdentificacao}>
                      Status de microchipagem:
                    </label>
                    <Select
                      options={StatusMicrochipagem}
                      placeholder="selecione"
                      className={styles.selectInserirAnimal}
                      onChange={(selectedOption) =>
                        setStatusMicrochipagem(selectedOption.value)
                      }
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
                      onChange={(selectedOption) =>
                        setStatusVacinacao(selectedOption.value)
                      }
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
                      onChange={(selectedOption) =>
                        setStatusCastracao(selectedOption.value)
                      }
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
                      onChange={(selectedOption) =>
                        setStatusAdocao(selectedOption.value)
                      }
                    />
                  </div>
                  <div className={styles.alinharDadosDeInsercao}>
                    <label className={styles.labelDadosSaude}>
                      Status de vermifugação:
                    </label>
                    <Select
                      options={StatusVermifugacao}
                      placeholder="selecione"
                      className={styles.selectInserirAnimal}
                      onChange={(selectedOption) =>
                        setStatusVermifugacao(selectedOption.value)
                      }
                    />
                  </div>
                </div>
                <div className={styles.alinharBotaoInserir}>
                  <button className={styles.botaoInserir}>
                    Inserir animal
                  </button>
                </div>
              </form>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </div>

      {/* Listagem de animais */}
      <div className={styles.alinharPainel}>
        <div className={styles.fundoPainel}>
          {animais.map((animal) => (
            <div className={styles.cardAnimais} key={animal.id}>
              <div className={styles.divImagem}>
                <img
                  className={styles.imagemAnimais}
                  src={
                    animal.imagem
                      ? `http://localhost:3003/uploads/${animal.imagem}`
                      : "/pagFichasDAnimais/imagemTeste.jpg"
                  }
                  alt="Imagem do animal"
                />
              </div>
              <div className={styles.infoAnimais}>
                <h1 className={styles.nomeAnimal}>{animal.nome}</h1>
                <p className={styles.dadosAnimais}>Idade: {animal.idade} ano(s)</p>
                <p className={styles.dadosAnimais}>Sexo: {animal.sexo}</p>
                <p className={styles.dadosAnimais}>Status de vacinação: {animal.statusVacinacao}</p>
                <p className={styles.dadosAnimais}>Status de castração: {animal.statusCastracao}</p>
                <Link
                  to={`/ver_mais/${animal.id}`}
                  className={styles.botaoVerMais}
                >
                  Ver mais
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
