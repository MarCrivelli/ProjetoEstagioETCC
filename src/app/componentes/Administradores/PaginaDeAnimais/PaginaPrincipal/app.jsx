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
  const [modoSelecaoPostagem, setModoSelecaoPostagem] = useState(false);
  const [animaisSelecionados, setAnimaisSelecionados] = useState([]);

  // Buscar animais
  useEffect(() => {
    const buscarAnimais = async () => {
      try {
        setLoading(true);
        setError(null);
        let resposta = await fetch("http://localhost:3003/animais");

        if (!resposta.ok) {
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

  // Verificar modo seleção e animais selecionados ao carregar
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const modoPostagem = urlParams.get("modoPostagem");

    if (modoPostagem === "true") {
      setModoSelecaoPostagem(true);
      document.body.classList.add("modo-selecao-ativo");
      
      // Recuperar animais selecionados salvos na memória/URL
      const animaisSalvos = urlParams.get("animaisSelecionados");
      if (animaisSalvos) {
        try {
          const animaisArray = JSON.parse(decodeURIComponent(animaisSalvos));
          setAnimaisSelecionados(animaisArray);
        } catch (error) {
          console.error("Erro ao recuperar animais selecionados:", error);
        }
      }
    }

    return () => {
      document.body.classList.remove("modo-selecao-ativo");
    };
  }, []);

  // Salvar animais selecionados na URL quando mudarem
  useEffect(() => {
    if (modoSelecaoPostagem && animaisSelecionados.length > 0) {
      const urlParams = new URLSearchParams(window.location.search);
      urlParams.set("animaisSelecionados", encodeURIComponent(JSON.stringify(animaisSelecionados)));
      const novaUrl = `${window.location.pathname}?${urlParams.toString()}`;
      window.history.replaceState({}, "", novaUrl);
    }
  }, [animaisSelecionados, modoSelecaoPostagem]);

  // Controlar animações
  useEffect(() => {
    const container = document.querySelector(`.${styles.containerPostagem}`);
    const botaoSelecao = document.querySelector(
      `.${styles.botoesFlutuantes} .${styles.botaoAcao}:nth-child(3)`
    );

    if (modoSelecaoPostagem) {
      // Mostra o terceiro botão flutuante
      document.body.classList.add("modo-selecao-ativo");

      // Mostra o botão postar se houver animais selecionados
      if (animaisSelecionados.length > 0) {
        container?.classList.add(styles.visivel);
        botaoSelecao?.classList.add(styles.botaoSelecaoAtivo);
      } else {
        container?.classList.remove(styles.visivel);
        botaoSelecao?.classList.remove(styles.botaoSelecaoAtivo);
      }
    } else {
      // Esconde tudo quando não está no modo seleção
      document.body.classList.remove("modo-selecao-ativo");
      container?.classList.remove(styles.visivel);
      botaoSelecao?.classList.remove(styles.botaoSelecaoAtivo);
    }
  }, [animaisSelecionados, modoSelecaoPostagem]);

  // Funções auxiliares
  const toggleSelecaoAnimal = (animalId) => {
    setAnimaisSelecionados((prev) =>
      prev.includes(animalId)
        ? prev.filter((id) => id !== animalId)
        : [...prev, animalId]
    );
  };

  // Função para desativar o modo de seleção
  const desativarModoSelecao = () => {
    setModoSelecaoPostagem(false);
    setAnimaisSelecionados([]);
    document.body.classList.remove("modo-selecao-ativo");
    
    // Limpar parâmetros da URL
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.delete("modoPostagem");
    urlParams.delete("animaisSelecionados");
    
    const novaUrl = urlParams.toString() 
      ? `${window.location.pathname}?${urlParams.toString()}`
      : window.location.pathname;
    
    window.history.replaceState({}, "", novaUrl);
  };

  const aplicarFiltros = () => {
    if (!Array.isArray(animaisCompleto)) {
      setAnimais([]);
      return;
    }

    const animaisFiltrados = animaisCompleto.filter((animal) => {
      const nomeMatch =
        !filtros.nome ||
        animal.nome.toLowerCase().includes(filtros.nome.toLowerCase());

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

    setFiltrosAplicados(
      Object.values(filtros).some((value) =>
        Array.isArray(value) ? value.length > 0 : value !== ""
      )
    );
    setAnimais(animaisFiltrados);
  };

  useEffect(() => {
    aplicarFiltros();
  }, [filtros, animaisCompleto]);

  const handleAnimalCadastrado = () => {
    setMostrarCadastro(false);
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

  // remover
  useEffect(() => {
    console.log("Modo seleção:", modoSelecaoPostagem);
    console.log("Animais selecionados:", animaisSelecionados);
  }, [modoSelecaoPostagem, animaisSelecionados]);

  return (
    <div
      className={`${styles.fundoPagina} ${
        modoSelecaoPostagem ? styles.modoSelecaoAtivo : ""
      }`}
    >
      <HeaderAdms />
      <BotaoPagInicial />
      <RolarPCima />

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

      <div className={styles.containerPostagem}>
        <button
          className={`${styles.fecharContainerPostagem} ${
            modoSelecaoPostagem ? styles.ativo : ""
          }`}
          onClick={desativarModoSelecao}
        >
          X
        </button>
        <p>
          {animaisSelecionados.length}
          {animaisSelecionados.length === 1 ? " animal selecionado" : " animais selecionados"}
        </p>
        <button className={styles.botaoPostar}>Postar</button>
      </div>

      {mostrarFiltros && (
        <div className={styles.modalOverlay}>
          <div className={`${styles.modalContent} ${styles.modalFiltros}`}>
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

      {mostrarCadastro && (
        <div className={styles.modalOverlay}>
          <div className={`${styles.modalContent} ${styles.modalCadastro}`}>
            <button
              className={styles.fecharModal}
              onClick={() => setMostrarCadastro(false)}
            >
              ×
            </button>
            <h2>Cadastrar Animal</h2>
            <CadastroDeAnimais
              animais={animaisCompleto}
              setAnimais={setAnimaisCompleto}
              onClose={handleAnimalCadastrado}
            />
          </div>
        </div>
      )}

      <div className={styles.fundoPainel}>
        <div className={styles.painel}>
          {loading ? (
            <div className={styles.loading}>
              <img src="/carregando.svg" alt="Carregando" />
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
              modoSelecaoPostagem={modoSelecaoPostagem}
              animaisSelecionados={animaisSelecionados}
              toggleSelecaoAnimal={toggleSelecaoAnimal}
            />
          )}
        </div>
      </div>
    </div>
  );
}