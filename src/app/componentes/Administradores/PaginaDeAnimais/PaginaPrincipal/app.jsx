import styles from "./animais.module.css";
import { useState, useEffect } from "react";
import HeaderAdms from "../../HeaderAdms/app";
import RolarPCima from "../../../BotaoScroll/app";
import BotaoPagInicial from "../../BotaoPagInicialAdms/app";
import FiltroDeAnimais from "../FiltroDeAnimais/app";
import CadastroDeAnimais from "../CadastroDeAnimais/app";
import ExibicaoDeAnimais from "../ExibicaoDeAnimais/app";

export default function FichasDeAnimais() {
  const [animaisCompleto, setAnimaisCompleto] = useState([]);
  const [animais, setAnimais] = useState([]);
  const [filtrosAplicados, setFiltrosAplicados] = useState(false);
  const [filtros, setFiltros] = useState({
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
  const [mostrarCadastro, setMostrarCadastro] = useState(false);
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

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

    const filtroAtivo = Object.values(filtros).some((value) =>
      Array.isArray(value) ? value.length > 0 : value !== ""
    );
    setFiltrosAplicados(filtroAtivo);

    animaisFiltrados = animaisFiltrados.filter((animal) => {
      // Verificação do nome (case insensitive)
      const nomeMatch =
        !filtros.nome ||
        animal.nome.toLowerCase().includes(filtros.nome.toLowerCase());

      // Verificação dos outros filtros
      const outrosFiltrosMatch =
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
          filtros.statusVermifugacao.includes(animal.statusVermifugacao));

      return nomeMatch && outrosFiltrosMatch;
    });

    setAnimais(animaisFiltrados);
  };

  useEffect(() => {
    aplicarFiltros();
  }, [filtros, animaisCompleto]);

  return (
    <>
      <HeaderAdms />
      <BotaoPagInicial />
      <RolarPCima />

      {/* Botões flutuantes */}
      <div className={styles.botoesFlutuantes}>
        <button
          className={styles.botaoAcao}
          onClick={() => setMostrarFiltros(true)}
        >
          <img src="/pagFichasDAnimais/filtro.png"></img>
        </button>

        <button
          className={styles.botaoAcao}
          onClick={() => setMostrarCadastro(true)}
        >
          <img src="/pagFichasDAnimais/addAnimal.png"></img>
        </button>
      </div>

      {/* Modal de Filtros */}
      {mostrarFiltros && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <button
              className={styles.fecharModal}
              onClick={() => setMostrarFiltros(false)}
            >
              ×
            </button>
            <h2>Filtros de Pesquisa</h2>
            <FiltroDeAnimais
              filtros={filtros}
              setFiltros={setFiltros}
              onClose={() => setMostrarFiltros(false)}
            />
          </div>
        </div>
      )}

      {/* Modal de Cadastro */}
      {mostrarCadastro && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <button
              className={styles.fecharModal}
              onClick={() => setMostrarCadastro(false)}
            >
              ×
            </button>
            <h2>Cadastrar Novo Animal</h2>
            <CadastroDeAnimais
              animais={animais}
              setAnimais={setAnimais}
              onClose={() => setMostrarCadastro(false)}
            />
          </div>
        </div>
      )}

      {/* Listagem de animais */}
      <div className={styles.fundoPainel}>
        <div className={styles.painel}>
          <ExibicaoDeAnimais
            animais={animais}
            filtrosAplicados={filtrosAplicados}
          />
        </div>
      </div>
    </>
  );
}
