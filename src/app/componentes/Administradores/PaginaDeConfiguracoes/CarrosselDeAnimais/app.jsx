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
  // ESTADOS PRINCIPAIS
  const [erro, setErro] = useState("");
  const [animais, setAnimais] = useState([]);
  const [animaisCarrossel, setAnimaisCarrossel] = useState([]);
  const [animalSelecionado, setAnimalSelecionado] = useState(null);
  const [carregando, setCarregando] = useState(false);
  const [carregandoCarrossel, setCarregandoCarrossel] = useState(false);

  // ESTADOS PARA CONTROLE DE EXIBIÇÃO
  const [mostrarSaidaFormulario, setMostrarSaidaFormulario] = useState(false);
  const [mostrarSaidaPorSlide, setMostrarSaidaPorSlide] = useState({});

  // ESTADOS PARA EDIÇÃO NO FORMULÁRIO
  const [descricaoSaidaFormulario, setDescricaoSaidaFormulario] = useState("");

  // ESTADOS PARA EDIÇÃO DOS SLIDES
  const [editandoSlide, setEditandoSlide] = useState(null);
  const [novaDescricaoSaida, setNovaDescricaoSaida] = useState("");
  const [descricaoSaidaAlterada, setDescricaoSaidaAlterada] = useState(false);
  const [salvandoEdicao, setSalvandoEdicao] = useState(false);

  // ESTADOS PARA REMOÇÃO
  const [removendoAnimal, setRemovendoAnimal] = useState(null);

  useEffect(() => {
    carregarAnimais();
    carregarAnimaisCarrossel();
  }, []);

  const carregarAnimais = async () => {
    try {
      setCarregando(true);
      const responseAnimais = await fetch(
        "http://localhost:3003/carrossel/animais/selecao"
      );
      if (!responseAnimais.ok) {
        throw new Error(`Erro HTTP: ${responseAnimais.status}`);
      }
      const dataAnimais = await responseAnimais.json();

      console.log("=== DEBUG: Estrutura completa dos dados do backend ===");
      console.log("Dados brutos recebidos:", dataAnimais);

      if (dataAnimais.length > 0) {
        console.log("Primeiro animal (estrutura completa):", dataAnimais[0]);
        console.log(
          "Todas as propriedades do primeiro animal:",
          Object.keys(dataAnimais[0])
        );
      }

      const responseCarrossel = await fetch(
        "http://localhost:3003/carrossel/animais"
      );
      if (!responseCarrossel.ok) {
        throw new Error(`Erro HTTP: ${responseCarrossel.status}`);
      }
      const dataCarrossel = await responseCarrossel.json();

      const animaisNoCarrossel =
        dataCarrossel && Array.isArray(dataCarrossel.data)
          ? dataCarrossel.data
              .filter((item) => item && item.animal && item.animal.id)
              .map((item) => item.animal.id)
          : [];

      console.log("Animais no carrossel:", animaisNoCarrossel);
      console.log("Total de animais disponíveis:", dataAnimais.length);

      const animaisDisponiveis = dataAnimais.filter((animal) => {
        console.log(
          `=== Animal ${animal.nome || animal.name} (ID: ${animal.id}) ===`
        );
        console.log("Todas as propriedades:", Object.keys(animal));
        console.log("Valores dos campos:", {
          nome: animal.nome,
          name: animal.name,
          descricao: animal.descricao,
          description: animal.description,
          descricaoEntrada: animal.descricaoEntrada,
          imagem: animal.imagem,
          image: animal.image,
          imagemEntrada: animal.imagemEntrada,
          imagemSaida: animal.imagemSaida,
          imagemSaida2: animal.imagemSaida2,
          imageOut: animal.imageOut,
          imagemFinal: animal.imagemFinal,
          descricaoSaida: animal.descricaoSaida,
          descricaoSaida2: animal.descricaoSaida2,
          descricaoFinal: animal.descricaoFinal,
          descriptionOut: animal.descriptionOut,
        });

        const temNome = !!(animal.nome || animal.name);
        const naoEstaNoCarrossel = !animaisNoCarrossel.includes(animal.id);

        console.log(`Incluir animal? ${temNome && naoEstaNoCarrossel}`);
        console.log("=== Fim do animal ===");

        return temNome && naoEstaNoCarrossel;
      });

      console.log(
        "Animais disponíveis para seleção:",
        animaisDisponiveis.length
      );

      setAnimais(
        animaisDisponiveis.map((animal) => ({
          value: animal.id,
          label: animal.nome || animal.name || `Animal ${animal.id}`,
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
    setErro("");

    if (!selectedOption) {
      setAnimalSelecionado(null);
      setMostrarSaidaFormulario(false);
      setDescricaoSaidaFormulario("");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3003/animais/${selectedOption.value}`
      );
      if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);

      const data = await response.json();
      setAnimalSelecionado(data);
      setMostrarSaidaFormulario(false);
      // Inicializa a descrição de saída do formulário com a do animal (se existir)
      setDescricaoSaidaFormulario(data.descricaoSaida || "");
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

    if (!animalSelecionado.imagemSaida) {
      setErro(
        "Este animal não possui imagem de saída. Para inserir no carrossel, é necessário cadastrar uma imagem de saída primeiro."
      );
      return;
    }

    // Usa a descrição do formulário se estiver preenchida, senão usa a do animal
    const descricaoSaidaParaEnviar =
      descricaoSaidaFormulario.trim() || animalSelecionado.descricaoSaida;

    if (!descricaoSaidaParaEnviar) {
      setErro(
        "Descrição de saída é obrigatória para inserir no carrossel. Preencha o campo de descrição de saída."
      );
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
          descricaoSaida: descricaoSaidaParaEnviar,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Erro ao adicionar animal`);
      }

      // CORREÇÃO: Aguarda um pouco antes de recarregar
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Recarrega os dados - carrega primeiro o carrossel, depois os animais disponíveis
      await carregarAnimaisCarrossel();
      await carregarAnimais(); // Separado para garantir que execute após o carrossel ser atualizado

      // Limpa o formulário
      setAnimalSelecionado(null);
      setMostrarSaidaFormulario(false);
      setDescricaoSaidaFormulario("");
      setErro("");
      console.log("Animal inserido com sucesso e listas atualizadas"); // Debug
    } catch (error) {
      console.error("Erro ao inserir animal:", error);
      setErro(error.message || "Erro ao inserir animal. Tente novamente.");
    }
  };

  const handleRemoverAnimal = async (slideId, nomeAnimal) => {
    // Confirma a remoção
    if (
      !window.confirm(
        `Tem certeza que deseja remover "${nomeAnimal}" do carrossel?`
      )
    ) {
      return;
    }

    try {
      setRemovendoAnimal(slideId);

      const response = await fetch(
        `http://localhost:3003/carrossel/animais/${slideId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `Erro ao remover animal do carrossel`
        );
      }

      await new Promise((resolve) => setTimeout(resolve, 100));

      await carregarAnimaisCarrossel();
      await carregarAnimais();

      setMostrarSaidaPorSlide((prev) => {
        const novoEstado = { ...prev };
        delete novoEstado[slideId];
        return novoEstado;
      });

      if (editandoSlide === slideId) {
        cancelarEdicao();
      }

      setErro("");
      console.log("Animal removido com sucesso e listas atualizadas");
    } catch (error) {
      console.error("Erro ao remover animal:", error);
      setErro(
        error.message || "Erro ao remover animal do carrossel. Tente novamente."
      );
    } finally {
      setRemovendoAnimal(null);
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
        let errorMessage = `Erro HTTP: ${response.status}`;
        try {
          const errorData = await response.json();
          console.log("Dados do erro:", errorData);
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch (parseError) {
          console.log("Erro ao parsear resposta de erro:", parseError);
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

      await carregarAnimaisCarrossel();

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
        {/*SLIDE DO FORMULÁRIO*/}
        <div className={styles.slideFormulario}>
          <div
            className={styles.divBotaoTrocarDados}
            onClick={alternarDadosFormulario}
          >
            <img
              src="/pagConfiguracoes/trocarDados.png"
              alt="Trocar dados"
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
                ) : mostrarSaidaFormulario ? (
                  // Se está mostrando saída e não tem descrição, mostra input editável
                  !animalSelecionado.descricaoSaida &&
                  !descricaoSaidaFormulario ? (
                    <textarea
                      className={styles.descricaoAnimal}
                      value={descricaoSaidaFormulario}
                      onChange={(e) =>
                        setDescricaoSaidaFormulario(e.target.value)
                      }
                      placeholder="Digite a descrição de saída do animal"
                      rows={4}
                    />
                  ) : (
                    // Se tem descrição original ou foi editada, mostra como texto mas permite edição
                    <textarea
                      className={styles.descricaoAnimal}
                      value={descricaoSaidaFormulario}
                      onChange={(e) =>
                        setDescricaoSaidaFormulario(e.target.value)
                      }
                      rows={4}
                    />
                  )
                ) : (
                  // Descrição de entrada (sempre read-only)
                  <p className={styles.descricaoAnimal}>
                    {animalSelecionado.descricao}
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
              data-tooltip-id="casoInformacoesFaltando"
            >
              Inserir animal
            </button>
            <Tooltip id="casoDescricaoSaidaFaltando" place="top">
              Pre
            </Tooltip>
          </div>
        </div>

        {/*SLIDES DOS ANIMAIS CADASTRADOS*/}
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
                    <div className={styles.divBotoesEdicao}>
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
                    <div className={styles.divBotoesEdicao}>
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
                      <button
                        className={styles.botaoRemover}
                        onClick={() =>
                          handleRemoverAnimal(slide.id, slide.animal.nome)
                        }
                        disabled={removendoAnimal === slide.id}
                        style={{
                          backgroundColor: "#ff4444",
                          color: "white",
                          border: "none",
                          padding: "8px 16px",
                          borderRadius: "4px",
                          cursor:
                            removendoAnimal === slide.id
                              ? "not-allowed"
                              : "pointer",
                          opacity: removendoAnimal === slide.id ? 0.6 : 1,
                        }}
                      >
                        {removendoAnimal === slide.id
                          ? "Removendo..."
                          : "Remover animal"}
                      </button>
                    </div>
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
