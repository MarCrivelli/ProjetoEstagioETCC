import styles from "./cadastroDeAnimais.module.css";
import { useState } from "react";
import Select from "react-select";

export default function CadastroDeAnimais({ animais, setAnimais }) {

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

  const onImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setImage(event.target.files[0]);
    }
  };

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

    try {
      const resposta = await fetch("http://localhost:3003/animais", {
        method: "POST",
        body: formData,
      });

      if (resposta.ok) {
        const novoAnimal = await resposta.json();
        setAnimais([...animais, novoAnimal]);
        alert("Animal cadastrado com sucesso!");
        // Reset form
        setNome("");
        setIdade("");
        setSexo("");
        setTipo("");
        setStatusMicrochipagem("");
        setStatusVacinacao("");
        setStatusCastracao("");
        setStatusAdocao("");
        setStatusVermifugacao("");
        setImage(null);
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

  return (
    <form onSubmit={registrarAnimal} className={styles.formularioCadastro}>
      <div className={styles.inserirImagem}>
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
          onChange={onImageChange}
          className={styles.inputDeImagem}
        />
        <span className={styles.nomeArquivo}>
          {image ? "Arquivo selecionado" : "Nenhum arquivo selecionado"}
        </span>
      </div>
      <div className={styles.itemInserir}>
        <h1 className={styles.tituloItemInserir}>Dados de identificação</h1>
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
          <label className={styles.labelDeIdentificacao}>Idade:</label>
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
            onChange={(selectedOption) => setSexo(selectedOption.value)}
          />
        </div>
        <div className={styles.alinharDadosDeInsercao}>
          <label className={styles.labelDeIdentificacao}>Tipo:</label>
          <Select
            options={tipoAnimal}
            placeholder="selecione"
            className={styles.selectInserirAnimal}
            onChange={(selectedOption) => setTipo(selectedOption.value)}
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
          <label className={styles.labelDadosSaude}>Status de vacinação:</label>
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
          <label className={styles.labelDadosSaude}>Status de castração:</label>
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
          <label className={styles.labelDadosSaude}>Status de adoção:</label>
          <Select
            options={StatusAdocao}
            placeholder="selecione"
            className={styles.selectInserirAnimal}
            onChange={(selectedOption) => setStatusAdocao(selectedOption.value)}
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
        <button className={styles.botaoInserir}>Inserir animal</button>
      </div>
    </form>
  );
}
