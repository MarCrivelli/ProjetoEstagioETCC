import { useState, useEffect } from "react";
import { Carousel } from "react-responsive-carousel";
import Select from "react-select";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import styles from "./carrosselAnimais.module.css";

export default function CarrosselAnimaisAutonomo() {
  const [erro, setErro] = useState("");
  const [animais, setAnimais] = useState([]);
  const [animaisCarrossel, setAnimaisCarrossel] = useState([]);
  const [animalSelecionado, setAnimalSelecionado] = useState(null);
  const [modoEdicao, setModoEdicao] = useState(false);
  const [descricaoSaida, setDescricaoSaida] = useState("");
  const [mostrarImagemSaida, setMostrarImagemSaida] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [carregandoCarrossel, setCarregandoCarrossel] = useState(false);

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

      if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);

      const data = await response.json();
      setAnimais(
        data.map((animal) => ({
          value: animal.id,
          label: animal.nome,
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
      // Garante que sempre teremos um array válido
      setAnimaisCarrossel(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Erro ao carregar animais do carrossel:", error);
      setErro("Falha ao carregar animais do carrossel. Tente novamente.");
      setAnimaisCarrossel([]); // Define como array vazio em caso de erro
    } finally {
      setCarregandoCarrossel(false);
    }
  };

  const handleSelecionarAnimal = async (selectedOption) => {
    try {
      const response = await fetch(
        `http://localhost:3003/carrossel/animais/${selectedOption.value}`
      );

      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }

      const data = await response.json();
      setAnimalSelecionado(data);
      setDescricaoSaida(data.descricaoSaida || "");
      setMostrarImagemSaida(false);
    } catch (error) {
      console.error("Erro ao buscar animal:", error);
      setErro("Erro ao buscar detalhes do animal. Tente novamente.");
    }
  };

  const alternarImagem = () => {
    setMostrarImagemSaida(!mostrarImagemSaida);
    if (!mostrarImagemSaida && !modoEdicao) {
      setModoEdicao(true);
    }
  };

  const handleAdicionarAnimal = async () => {
    if (!animalSelecionado || !descricaoSaida) {
      setErro("Preencha todos os campos obrigatórios");
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
          descricaoSaida,
        }),
      });

      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }

      // Recarrega as listas
      await carregarAnimaisCarrossel();
      await carregarAnimais();

      // Limpa o formulário
      setAnimalSelecionado(null);
      setDescricaoSaida("");
      setModoEdicao(false);
      setMostrarImagemSaida(false);
      setErro("");
    } catch (error) {
      console.error("Erro ao adicionar animal ao carrossel:", error);
      setErro("Erro ao adicionar animal. Tente novamente.");
    }
  };

  if (carregando || carregandoCarrossel) {
    return <div className={styles.loading}>Carregando...</div>;
  }

  if (erro) {
    return (
      <div className={styles.error}>
        {erro}
        <button onClick={() => {
          setErro("");
          carregarAnimaisCarrossel();
          carregarAnimais();
        }}>
          Tentar novamente
        </button>
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
      >
        {/* Slide do formulário */}
        <div className={styles.slideFormulario}>
          <div className={styles.alinharDadosAnimal}>
            <div className={styles.containerImagensAnimal}>
              <h2>{mostrarImagemSaida ? "Depois" : "Antes"}</h2>
              {animalSelecionado && (
                <img
                  className={styles.imagensAnimal}
                  src={
                    mostrarImagemSaida && animalSelecionado.imagemSaida
                      ? `http://localhost:3003/uploads/${animalSelecionado.imagemSaida}`
                      : `http://localhost:3003/uploads/${animalSelecionado.imagem}`
                  }
                  alt={`Imagem do animal ${animalSelecionado.nome}`}
                  onError={(e) => {
                    e.target.src = "/placeholder-image.jpg";
                  }}
                />
              )}
            </div>
            <div className={styles.containerDescricaoAnimal}>
              <div className={styles.alinharDescricao}>
                <label>Nome do animal</label>
                <Select
                  options={animais}
                  onChange={handleSelecionarAnimal}
                  placeholder="Selecione um animal"
                />
              </div>
              <div className={styles.alinharDescricao}>
                <label>Descrição do animal</label>
                {modoEdicao ? (
                  <textarea
                    className={styles.descricoesAnimal}
                    value={descricaoSaida}
                    onChange={(e) => setDescricaoSaida(e.target.value)}
                    placeholder="Digite a descrição de saída do animal"
                  />
                ) : (
                  <p className={styles.descricoesAnimal}>
                    {animalSelecionado?.descricao ||
                      "Selecione um animal para ver sua descrição"}
                  </p>
                )}
              </div>
              {animalSelecionado && (
                <div className={styles.alinharBotaoMudarDescricao}>
                  <button onClick={alternarImagem}>
                    {mostrarImagemSaida ? "Antes" : "Depois"}
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className={styles.alinharBotaoInserirAnimal}>
            <button
              onClick={handleAdicionarAnimal}
              disabled={!descricaoSaida || !animalSelecionado}
            >
              {carregando ? "Processando..." : "Inserir Animal"}
            </button>
          </div>
        </div>

        {/* Slides dos animais cadastrados no carrossel */}
        {animaisCarrossel.length > 0 ? (
          animaisCarrossel.map((item) => (
            <div key={item.id} className={styles.slideAnimaisCadastrados}>
              <div className={styles.containerImagensAnimal}>
                <h2>Antes</h2>
                {item.animal?.imagem && (
                  <img
                    className={styles.imagensAnimal}
                    src={`http://localhost:3003/uploads/${item.animal.imagem}`}
                    alt={`Imagem de ${item.animal.nome || "animal"}`}
                    onError={(e) => {
                      e.target.src = "/placeholder-image.jpg";
                    }}
                  />
                )}
              </div>
              <div className={styles.containerDescricaoAnimal}>
                <h1 className={styles.nomeAnimal}>
                  {item.animal?.nome || "Animal sem nome"}
                </h1>
                <p className={styles.descricoesAnimal}>
                  {item.descricaoSaida || item.animal?.descricao || "Sem descrição disponível"}
                </p>
                <div className={styles.alinharBotaoMudarDescricao}>
                  <button>Antes/Depois</button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className={styles.slideAnimaisCadastrados}>
            <p>Nenhum animal cadastrado no carrossel</p>
          </div>
        )}
      </Carousel>
    </div>
  );
}