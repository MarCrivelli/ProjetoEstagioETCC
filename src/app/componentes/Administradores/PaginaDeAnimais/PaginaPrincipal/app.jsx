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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Função para buscar os animais
  useEffect(() => {
    const buscarAnimais = async () => {
      try {
        setLoading(true);
        setError(null);

        // Tenta ambas as rotas possíveis
        let resposta = await fetch("http://localhost:3003/animais");

        if (!resposta.ok) {
          // Se a primeira rota falhar, tenta a alternativa
          resposta = await fetch("http://localhost:3003/listar/animais");
          if (!resposta.ok) {
            throw new Error(`Erro ao buscar animais: ${resposta.status}`);
          }
        }

        const dados = await resposta.json();
        const animaisArray = Array.isArray(dados) ? dados : [];

        setAnimais(animaisArray);
        setAnimaisCompleto(animaisArray);
      } catch (error) {
        console.error("Erro ao buscar animais:", error);
        setError(error.message);
        setAnimais([]);
        setAnimaisCompleto([]);
      } finally {
        setLoading(false);
      }
    };

    buscarAnimais();
  }, []);

  // Função para aplicar os filtros
  const aplicarFiltros = () => {
    if (!Array.isArray(animaisCompleto)) {
      setAnimais([]);
      return;
    }

    let animaisFiltrados = [...animaisCompleto];

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

  // Adicione esta função para recarregar os animais após cadastro
  const handleAnimalCadastrado = () => {
    setMostrarCadastro(false);
    // Recarrega os animais
    const buscarAnimais = async () => {
      try {
        const resposta = await fetch("http://localhost:3003/animais");
        const dados = await resposta.json();
        setAnimais(Array.isArray(dados) ? dados : []);
        setAnimaisCompleto(Array.isArray(dados) ? dados : []);
      } catch (error) {
        console.error("Erro ao recarregar animais:", error);
      }
    };
    buscarAnimais();
  };

  return (
    <div className={styles.fundoPagina}>
      <HeaderAdms />
      <BotaoPagInicial />
      <RolarPCima />

      {/* Botões flutuantes */}
      <div className={styles.botoesFlutuantes}>
        <button
          className={styles.botaoAcao}
          onClick={() => setMostrarFiltros(true)}
        >
          <img src="/pagFichasDAnimais/filtro.png" alt="Filtrar" />
        </button>

        <button
          className={styles.botaoAcao}
          onClick={() => setMostrarCadastro(true)}
        >
          <img src="/pagFichasDAnimais/addAnimal.png" alt="Adicionar animal" />
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
              animais={animaisCompleto}
              setAnimais={setAnimaisCompleto}
              onClose={handleAnimalCadastrado} // Alterado para chamar a função de recarregar
            />
          </div>
        </div>
      )}

      {/* Listagem de animais */}
      <div className={styles.fundoPainel}>
        <div className={styles.painel}>
          {loading ? (
            <div className={styles.loading}>
              <img src="/pagFichasDAnimais/carregando.svg"></img>
              <p>Carregando...</p>
            </div>
          ) : error ? (
            <div className={styles.error}>
              Erro ao carregar animais: {error}
              <button
                onClick={() => window.location.reload()}
                className={styles.botaoRecarregar}
              >
                Tentar novamente
              </button>
            </div>
          ) : (
            <ExibicaoDeAnimais
              animais={animais}
              filtrosAplicados={filtrosAplicados}
            />
          )}
        </div>
      </div>
    </div>
  );
}
