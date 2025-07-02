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

  useEffect(() => {
    carregarAnimais();
    carregarAnimaisCarrossel();
  }, []);

  const carregarAnimais = async () => {
    try {
      const response = await fetch(
        "http://localhost:3003/carrossel/animais/selecao"
      );

      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }

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
    }
  };

  const carregarAnimaisCarrossel = async () => {
  try {
    const response = await fetch('http://localhost:3003/carrossel/animais');
    
    // Verifica se a resposta é JSON
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      throw new Error(`Resposta inesperada: ${text.substring(0, 100)}...`);
    }

    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Erro ao carregar animais do carrossel:', error);
    throw error;
  }
};

  const handleSelecionarAnimal = async (selectedOption) => {
    try {
      const response = await fetch(
        `/carrossel/animais/${selectedOption.value}`
      );
      const data = await response.json();
      setAnimalSelecionado(data);
      setDescricaoSaida("");
      setMostrarImagemSaida(false);
    } catch (error) {
      console.error("Erro ao buscar animal:", error);
    }
  };

  const alternarImagem = () => {
    setMostrarImagemSaida(!mostrarImagemSaida);
    if (!mostrarImagemSaida && !modoEdicao) {
      setModoEdicao(true);
    }
  };

  const handleAdicionarAnimal = async () => {
    if (!animalSelecionado || !descricaoSaida) return;

    try {
      await fetch("/carrossel/animais", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          animalId: animalSelecionado.id,
          descricaoSaida,
        }),
      });

      // Recarrega a lista de animais do carrossel
      await carregarAnimaisCarrossel();

      // Limpa o formulário
      setAnimalSelecionado(null);
      setDescricaoSaida("");
      setModoEdicao(false);
      setMostrarImagemSaida(false);
    } catch (error) {
      console.error("Erro ao adicionar animal ao carrossel:", error);
    }
  };

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
                    mostrarImagemSaida
                      ? animalSelecionado.imagemSaida
                      : animalSelecionado.imagem
                  }
                  alt={`Imagem do animal ${animalSelecionado.nome}`}
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
            <button onClick={handleAdicionarAnimal} disabled={!descricaoSaida}>
              Inserir Animal
            </button>
          </div>
        </div>

        {/* Slides dos animais cadastrados no carrossel */}
        {animaisCarrossel.map((item) => (
          <div key={item.id} className={styles.slideAnimaisCadastrados}>
            <div className={styles.containerImagensAnimal}>
              <h2>Antes</h2>
              <img
                className={styles.imagensAnimal}
                src={item.animal.imagem}
                alt={`Imagem de entrada do animal ${item.animal.nome}`}
              />
            </div>
            <div className={styles.containerDescricaoAnimal}>
              <h1 className={styles.nomeAnimal}>{item.animal.nome}</h1>
              <p className={styles.descricoesAnimal}>
                {item.descricaoSaida || item.animal.descricao}
              </p>
              <div className={styles.alinharBotaoMudarDescricao}>
                <button>Antes/Depois</button>
              </div>
            </div>
          </div>
        ))}
      </Carousel>
    </div>
  );
}
