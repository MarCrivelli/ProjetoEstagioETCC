import styles from "./filtroDeAnimais.module.css";
import Select from "react-select";
import { useState, useRef } from "react";

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

  const [termoPesquisa, setTermoPesquisa] = useState(filtros.nome || "");

  // Refs para os componentes Select
  const tipoSelectRef = useRef(null);
  const idadeSelectRef = useRef(null);
  const sexoSelectRef = useRef(null);
  const vacinacaoSelectRef = useRef(null);
  const castracaoSelectRef = useRef(null);
  const adocaoSelectRef = useRef(null);
  const microchipSelectRef = useRef(null);
  const vermifugacaoSelectRef = useRef(null);

  const handlePesquisaNome = (event) => {
    const termo = event.target.value;
    setTermoPesquisa(termo);
    setFiltros((prev) => ({
      ...prev,
      nome: termo,
    }));
  };

  const limparTodosFiltros = () => {
    // Resetar o estado dos filtros
    setTermoPesquisa("");
    setFiltros({
      tipo: [],
      idade: [],
      sexo: [],
      statusVacinacao: [],
      statusCastracao: [],
      statusAdocao: [],
      statusMicrochipagem: [],
      statusVermifugacao: [],
      nome: "",
    });

    // Resetar os componentes Select visualmente
    tipoSelectRef.current?.clearValue();
    idadeSelectRef.current?.clearValue();
    sexoSelectRef.current?.clearValue();
    vacinacaoSelectRef.current?.clearValue();
    castracaoSelectRef.current?.clearValue();
    adocaoSelectRef.current?.clearValue();
    microchipSelectRef.current?.clearValue();
    vermifugacaoSelectRef.current?.clearValue();
  };

  return (
    <div className={styles.containerFiltrosDeSelecao}>
      <Select
        ref={tipoSelectRef}
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
        value={filtros.tipo.map((opt) =>
          tipoAnimal.find((o) => o.value === opt)
        )}
      />
      <Select
        ref={idadeSelectRef}
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
        value={filtros.idade.map((opt) =>
          idadeAnimais.find((o) => o.value === opt)
        )}
      />
      <Select
        ref={sexoSelectRef}
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
        value={filtros.sexo.map((opt) =>
          sexoDoAnimal.find((o) => o.value === opt)
        )}
      />
      <Select
        ref={vacinacaoSelectRef}
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
        value={filtros.statusVacinacao.map((opt) =>
          StatusVacinacao.find((o) => o.value === opt)
        )}
      />
      <Select
        ref={castracaoSelectRef}
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
        value={filtros.statusCastracao.map((opt) =>
          StatusCastracao.find((o) => o.value === opt)
        )}
      />
      <Select
        ref={adocaoSelectRef}
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
        value={filtros.statusAdocao.map((opt) =>
          StatusAdocao.find((o) => o.value === opt)
        )}
      />
      <Select
        ref={microchipSelectRef}
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
        value={filtros.statusMicrochipagem.map((opt) =>
          StatusMicrochipagem.find((o) => o.value === opt)
        )}
      />
      <Select
        ref={vermifugacaoSelectRef}
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
        value={filtros.statusVermifugacao.map((opt) =>
          StatusVermifugacao.find((o) => o.value === opt)
        )}
      />
      <div className={styles.containerPesquisa}>
        <input
          className={styles.barrinhaDePesquisa}
          type="text"
          placeholder="Pesquise pelo nome"
          value={termoPesquisa}
          onChange={handlePesquisaNome}
        />
      </div>

      <div className={styles.divLimparFiltro}>
        <button
          onClick={limparTodosFiltros}
          className={styles.botaoLimparFiltros}
        >
          Limpar todos os filtros
        </button>
      </div>
    </div>
  );
}
