import styles from "./filtroDeAnimais.module.css"
import Select from "react-select";

export default function FiltroDeAnimais({ filtros, setFiltros }) {

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
  
  return (
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
            statusMicrochipagem: selectedOptions.map((opt) => opt.value),
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
            statusVermifugacao: selectedOptions.map((opt) => opt.value),
          }))
        }
        className={styles.filtroSelecao}
      />
      <div className={styles.containerPesquisa}>
        <input
          className={styles.barrinhaDePesquisa}
          type="text"
          placeholder="Pesquise pelo nome"
        />
      </div>
    </div>
  );
}
