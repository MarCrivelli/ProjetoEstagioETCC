import { useState, useEffect } from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { Tooltip } from "react-tooltip";
import Select from "react-select";
import styles from "./carrosselAnimais.module.css";

const SetaCustomizadaDoCarrossel = ({ onClick, direcao }) => {
  const Icone = direcao === "left" ? FiChevronLeft : FiChevronRight;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`${styles.setaCarrossel} ${
        direcao === "left" ? styles.setaEsquerda : styles.setaDireita
      }`}
      aria-label={direcao === "left" ? "Anterior" : "Próximo"}
    >
      <Icone size={24} />
    </button>
  );
};

export default function CarrosselAnimais() {
  // Estados principais
  const [erro, setErro] = useState("");
  const [animais, setAnimais] = useState([]);
  const [animaisCarrossel, setAnimaisCarrossel] = useState([]);
  const [animalSelecionado, setAnimalSelecionado] = useState(null);
  const [carregando, setCarregando] = useState(false);
  const [carregandoCarrossel, setCarregandoCarrossel] = useState(false);

  // Estados para controle de exibição
  const [mostrarSaidaFormulario, setMostrarSaidaFormulario] = useState(false);
  const [mostrarSaidaPorSlide, setMostrarSaidaPorSlide] = useState({});

  // Estados para edição
  const [editandoSlide, setEditandoSlide] = useState(null);
  const [novaDescricaoSaida, setNovaDescricaoSaida] = useState("");
  const [descricaoSaidaAlterada, setDescricaoSaidaAlterada] = useState(false);
  const [salvandoEdicao, setSalvandoEdicao] = useState(false);

  useEffect(() => {
    carregarAnimais();
    carregarAnimaisCarrossel();
  }, []);

  const carregarAnimais = async () => {
    try {
      setCarregando(true);
      const response = await fetch(
        "http://localhost:3003/carrossel/animais/selecao"
      );

      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }

      const data = await response.json();

      // Filtra apenas animais com todas as 5 informações obrigatórias
      const animaisCompletos = data.filter(
        (animal) =>
          animal.nome &&
          animal.descricao &&
          animal.descricaoSaida &&
          animal.imagem &&
          animal.imagemSaida
      );

      setAnimais(
        animaisCompletos.map((animal) => ({
          value: animal.id,
          label: animal.nome,
          originalData: animal,
        }))
      );
    } catch (error) {
      console.error("Falha ao carregar animais:", error);
      setErro("Falha ao carregar animais. Tente novamente.");
    } finally {
      setCarregando(false);
    }
  };

  const carregarAnimaisCarrossel = async () => {
    try {
      setCarregandoCarrossel(true);
      const response = await fetch("http://localhost:3003/carrossel/animais");

      if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);

      const data = await response.json();

      const dadosProcessados = Array.isArray(data.data)
        ? data.data
            .filter((item) => item?.animal)
            .map((item) => ({
              ...item,
              animal: {
                ...item.animal,
                imagem: item.animal.imagem || null,
                imagemSaida: item.animal.imagemSaida || null,
                nome: item.animal.nome || "Animal sem nome",
                descricao: item.animal.descricao || "Sem descrição",
              },
            }))
        : [];

      setAnimaisCarrossel(dadosProcessados);
    } catch (error) {
      console.error("Erro ao carregar animais do carrossel:", error);
      setErro("Falha ao carregar animais do carrossel. Tente novamente.");
      setAnimaisCarrossel([]);
    } finally {
      setCarregandoCarrossel(false);
    }
  };

  const handleSelecionarAnimal = async (selectedOption) => {
    if (!selectedOption) {
      setAnimalSelecionado(null);
      // Reset do estado de exibição quando desseleciona
      setMostrarSaidaFormulario(false);
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3003/animais/${selectedOption.value}`
      );

      if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);

      const data = await response.json();
      setAnimalSelecionado(data);
      // Reset do estado de exibição para novo animal
      setMostrarSaidaFormulario(false);
    } catch (error) {
      console.error("Erro ao buscar animal:", error);
      setErro("Erro ao buscar detalhes do animal. Tente novamente.");
    }
  };

  const handleInserirAnimal = async () => {
    if (!animalSelecionado) {
      setErro("Selecione um animal para inserir");
      return;
    }

    try {
      const response = await fetch("http://localhost:3003/carrossel/animais", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          animalId: animalSelecionado.id,
          descricaoSaida: animalSelecionado.descricaoSaida,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Erro ao adicionar animal`);
      }

      // Recarrega os dados - CORREÇÃO: recarrega também os animais do select
      await Promise.all([carregarAnimaisCarrossel(), carregarAnimais()]);

      // Limpa o formulário
      setAnimalSelecionado(null);
      setMostrarSaidaFormulario(false);
      setErro("");
    } catch (error) {
      console.error("Erro ao inserir animal:", error);
      setErro(error.message || "Erro ao inserir animal. Tente novamente.");
    }
  };

  const alternarDadosFormulario = () => {
    if (animalSelecionado) {
      setMostrarSaidaFormulario(!mostrarSaidaFormulario);
    }
  };

  const alternarDadosSlide = (slideId) => {
    setMostrarSaidaPorSlide((prev) => ({
      ...prev,
      [slideId]: !prev[slideId],
    }));
  };

  const iniciarEdicaoSlide = (slide) => {
    setEditandoSlide(slide.id);
    setNovaDescricaoSaida(slide.descricaoSaida || "");
    setDescricaoSaidaAlterada(false);
  };

  const handleDescricaoChange = (value) => {
    setNovaDescricaoSaida(value);
    setDescricaoSaidaAlterada(true);
  };

  const cancelarEdicao = () => {
    setEditandoSlide(null);
    setNovaDescricaoSaida("");
    setDescricaoSaidaAlterada(false);
  };

  const salvarEdicaoSlide = async (slideId) => {
    try {
      setSalvandoEdicao(true);

      const dadosParaEnviar = {
        descricaoSaida: novaDescricaoSaida,
      };

      console.log("Enviando dados:", dadosParaEnviar);
      console.log(
        "Para endpoint:",
        `http://localhost:3003/carrossel/animais/${slideId}`
      );

      const response = await fetch(
        `http://localhost:3003/carrossel/animais/${slideId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dadosParaEnviar),
        }
      );

      console.log("Status da resposta:", response.status);

      if (!response.ok) {
        // Tenta obter mais detalhes do erro
        let errorMessage = `Erro HTTP: ${response.status}`;
        try {
          const errorData = await response.json();
          console.log("Dados do erro:", errorData);
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch (parseError) {
          console.log("Erro ao parsear resposta de erro:", parseError);
          // Se não conseguir parsear, tenta obter como texto
          try {
            const errorText = await response.text();
            console.log("Texto do erro:", errorText);
            errorMessage = errorText || errorMessage;
          } catch (textError) {
            console.log("Erro ao obter texto do erro:", textError);
          }
        }
        throw new Error(errorMessage);
      }

      const responseData = await response.json();
      console.log("Resposta de sucesso:", responseData);

      // Recarrega os dados
      await carregarAnimaisCarrossel();

      // Limpa o estado de edição
      setEditandoSlide(null);
      setNovaDescricaoSaida("");
      setDescricaoSaidaAlterada(false);
    } catch (error) {
      console.error("Erro ao salvar edição:", error);
      setErro(`Erro ao salvar alterações: ${error.message}`);
    } finally {
      setSalvandoEdicao(false);
    }
  };

  if (carregando || carregandoCarrossel) {
    return (
      <div className={styles.fundoCarrossel}>
        <div className={styles.carregando}>
          <img src="/carregando.svg" alt="Carregando" />
          <p>Carregando...</p>
        </div>
      </div>
    );
  }

  if (erro) {
    return (
      <div className={styles.fundoCarrossel}>
        <div className={styles.erro}>
          <p>{erro}</p>
          <button
            onClick={() => {
              setErro("");
              carregarAnimais();
              carregarAnimaisCarrossel();
            }}
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.fundoCarrossel}>
      <Carousel
        className={styles.carrossel}
        showThumbs={false}
        showStatus={false}
        infiniteLoop={true}
        showIndicators={false}
        renderArrowPrev={(onClickHandler, hasPrev) =>
          hasPrev && (
            <SetaCustomizadaDoCarrossel
              onClick={onClickHandler}
              direcao="left"
            />
          )
        }
        renderArrowNext={(onClickHandler, hasNext) =>
          hasNext && (
            <SetaCustomizadaDoCarrossel
              onClick={onClickHandler}
              direcao="right"
            />
          )
        }
      >
        {/* Slide do Formulário */}
        <div className={styles.slideFormulario}>
          <div className={styles.divBotaoTrocarDados}>
            <img
              src="/pagConfiguracoes/trocarDados.png"
              alt="Trocar dados"
              onClick={alternarDadosFormulario}
              style={{
                cursor: animalSelecionado ? "pointer" : "default",
                opacity: animalSelecionado ? 1 : 0.5,
                transform: mostrarSaidaFormulario
                  ? "rotate(-90deg)"
                  : "rotate(90deg)",
                transition: "transform 0.3s ease",
              }}
            />
          </div>
          <div className={styles.conteudoSlide}>
            <div className={styles.containerImagem}>
              {!animalSelecionado ? (
                <div className={styles.preRenderImagem}>
                  Sem imagem por enquanto
                </div>
              ) : (
                <img
                  className={styles.imagemAnimal}
                  src={`http://localhost:3003/uploads/${
                    mostrarSaidaFormulario
                      ? animalSelecionado.imagemSaida
                      : animalSelecionado.imagem
                  }`}
                  alt={`${mostrarSaidaFormulario ? "Depois" : "Antes"} - ${
                    animalSelecionado.nome
                  }`}
                  onError={(e) => {
                    e.target.src = "/placeholder-image.jpg";
                    e.target.onerror = null;
                  }}
                />
              )}
            </div>
            <div className={styles.containerDados}>
              <div className={styles.containerNome}>
                <div className={styles.alinharLabelComAjuda}>
                  <label>Nome do animal</label>
                  <button
                    data-tooltip-id="idSelectNome"
                    className={styles.botaoAjuda}
                  >
                    ?
                  </button>
                  <Tooltip id="idSelectNome" place="top">
                    Clique na caixa abaixo e selecione o nome de algum animal
                    para que suas informações apareçam no slide.
                  </Tooltip>
                </div>
                <Select
                  className={styles.selectNomeAnimal}
                  placeholder="Selecione"
                  options={animais}
                  onChange={handleSelecionarAnimal}
                  value={
                    animalSelecionado
                      ? {
                          value: animalSelecionado.id,
                          label: animalSelecionado.nome,
                        }
                      : null
                  }
                />
              </div>
              <div className={styles.containerDescricao}>
                <div className={styles.alinharLabelComAjuda}>
                  <label>
                    Descrição de {mostrarSaidaFormulario ? "saída" : "entrada"}
                  </label>
                  <button
                    data-tooltip-id="idDescricoesAnimal"
                    className={styles.botaoAjuda}
                  >
                    ?
                  </button>
                  <Tooltip id="idDescricoesAnimal" place="top">
                    {mostrarSaidaFormulario
                      ? "A descrição de saída explica o que aconteceu com o animal após ser resgatado"
                      : "A descrição de entrada é uma breve explicação do estado em que o animal foi encontrado ao ser resgatado"}
                  </Tooltip>
                </div>
                {!animalSelecionado ? (
                  <p className={styles.semDescricao}>
                    Selecione um animal para ver sua descrição
                  </p>
                ) : (
                  <p className={styles.descricaoAnimal}>
                    {mostrarSaidaFormulario
                      ? animalSelecionado.descricaoSaida
                      : animalSelecionado.descricao}
                  </p>
                )}
              </div>
            </div>
          </div>
          <div className={styles.divBotaoSlide}>
            <button
              className={styles.botaoInserir}
              onClick={handleInserirAnimal}
              disabled={!animalSelecionado}
            >
              Inserir animal
            </button>
          </div>
        </div>

        {/* Slides dos Animais Cadastrados */}
        {animaisCarrossel.length > 0 ? (
          animaisCarrossel.map((slide) => {
            const mostrarSaida = mostrarSaidaPorSlide[slide.id] || false;
            const estaEditando = editandoSlide === slide.id;

            return (
              <div key={slide.id} className={styles.slideAnimaisCadastrados}>
                <div
                  className={styles.divBotaoTrocarDados}
                  onClick={() => alternarDadosSlide(slide.id)}
                >
                  <img
                    src="/pagConfiguracoes/trocarDados.png"
                    alt="Trocar dados"
                    style={{
                      cursor: "pointer",
                      transform: mostrarSaida
                        ? "rotate(-90deg)"
                        : "rotate(90deg)",
                      transition: "transform 0.3s ease",
                    }}
                  />
                </div>
                <div className={styles.conteudoSlide}>
                  <div className={styles.containerImagem}>
                    <img
                      className={styles.imagemAnimal}
                      src={`http://localhost:3003/uploads/${
                        mostrarSaida
                          ? slide.animal.imagemSaida
                          : slide.animal.imagem
                      }`}
                      alt={`${mostrarSaida ? "Depois" : "Antes"} - ${
                        slide.animal.nome
                      }`}
                      onError={(e) => {
                        e.target.src = "/placeholder-image.jpg";
                        e.target.onerror = null;
                      }}
                    />
                  </div>
                  <div className={styles.containerDados}>
                    <div className={styles.containerNome}>
                      <h1>{slide.animal.nome}</h1>
                    </div>
                    <div className={styles.containerDescricao}>
                      <div className={styles.alinharLabelComAjuda}>
                        <label>
                          Descrição de {mostrarSaida ? "saída" : "entrada"}
                        </label>
                        <button
                          data-tooltip-id={`tooltip-${slide.id}`}
                          className={styles.botaoAjuda}
                        >
                          ?
                        </button>
                        <Tooltip id={`tooltip-${slide.id}`} place="top">
                          {mostrarSaida
                            ? "Descrição de saída - o que aconteceu com o animal após ser resgatado"
                            : "Descrição de entrada - estado em que o animal foi encontrado"}
                        </Tooltip>
                      </div>

                      {estaEditando && mostrarSaida ? (
                        <textarea
                          className={styles.descricaoAnimal}
                          value={novaDescricaoSaida}
                          onChange={(e) =>
                            handleDescricaoChange(e.target.value)
                          }
                          placeholder="Digite a nova descrição de saída"
                        />
                      ) : (
                        <p className={styles.descricaoAnimal}>
                          {mostrarSaida
                            ? slide.descricaoSaida
                            : slide.animal.descricao}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                <div className={styles.divBotaoSlide}>
                  {estaEditando ? (
                    <div style={{ display: "flex", gap: "10px" }}>
                      <button
                        className={styles.botaoSalvar}
                        onClick={() => salvarEdicaoSlide(slide.id)}
                        disabled={!descricaoSaidaAlterada || salvandoEdicao}
                      >
                        {salvandoEdicao ? "Salvando..." : "Salvar"}
                      </button>
                      <button
                        className={styles.botaoCancelar}
                        onClick={cancelarEdicao}
                        disabled={salvandoEdicao}
                      >
                        Cancelar
                      </button>
                    </div>
                  ) : (
                    <button
                      className={styles.botaoEditar}
                      onClick={() => iniciarEdicaoSlide(slide)}
                      disabled={!mostrarSaida}
                      style={{
                        backgroundColor: mostrarSaida ? "#4400ff" : "grey",
                      }}
                    >
                      Editar slide
                    </button>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className={styles.slideAnimaisCadastrados}>
            <div className={styles.conteudoSlide}>
              <p>Nenhum animal cadastrado no carrossel</p>
            </div>
          </div>
        )}
      </Carousel>
    </div>
  );
}
