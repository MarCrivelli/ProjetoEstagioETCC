import { useState, useEffect } from "react";
import api from "../../../../../services/api";
import axios from "axios";
import styles from "./carrosselAnimais.module.css";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import Select from "react-select";

export default function CarrosselDeAnimais() {
  const [animais, setAnimais] = useState([]);
  const [selectedAnimal, setSelectedAnimal] = useState(null);
  const [novaDescricao, setNovaDescricao] = useState("");
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    const carregarAnimais = async () => {
      try {
        const response = await api.get("/animais", {
          signal: controller.signal,
        });
        setAnimais(response.data);
        setCarregando(false);
      } catch (error) {
        if (!axios.isCancel(error)) {
          console.error("Erro ao carregar animais:", error);
          setCarregando(false);
        }
      }
    };

    carregarAnimais();

    return () => {
      controller.abort();
    };
  }, []);

  const handleAnimalChange = (selectedOption) => {
    setSelectedAnimal(selectedOption.value);
    setNovaDescricao("");
  };

  const handleDescricaoChange = (e) => {
    setNovaDescricao(e.target.value);
  };

  const adicionarDescricao = async () => {
    if (!selectedAnimal || !novaDescricao.trim()) return;

    try {
      const response = await api.post("/carrossel-animais", {
        animalId: selectedAnimal.id,
        descricaoSaida: novaDescricao,
      });

      // Atualizar a lista de animais ou o estado conforme necessário
      setNovaDescricao("");
      alert("Descrição adicionada com sucesso!");
    } catch (error) {
      console.error("Erro ao adicionar descrição:", error);
    }
  };

  // Preparar opções para o Select
  const opcoesAnimais = animais.map((animal) => ({
    value: animal,
    label: animal.nome,
  }));

  if (carregando) {
    return <div>Carregando animais...</div>;
  }

  return (
    <div className={styles.fundoCarrosselAnimais}>
      <div className={styles.painel}>
        <Carousel
          showArrows={true}
          showThumbs={false}
          showStatus={false}
          showIndicators={true}
          infiniteLoop={false}
          className={styles.carrossel}
        >
          {/* Slide do formulário */}
          <div className={styles.slideFormulario}>
            <div className={styles.containerSelecao}>
              <Select
                options={opcoesAnimais}
                onChange={handleAnimalChange}
                placeholder="Selecione um animal"
                className={styles.selectAnimal}
              />
              
              {selectedAnimal && (
                <>
                  <div className={styles.containerImagens}>
                    <div className={styles.imagemContainer}>
                      <h3>Entrada</h3>
                      <img
                        src={`http://localhost:3003/uploads/${selectedAnimal.imagem}`}
                        alt={`${selectedAnimal.nome} - entrada`}
                        className={styles.imagemAnimal}
                      />
                    </div>
                    <div className={styles.imagemContainer}>
                      <h3>Saída</h3>
                      {selectedAnimal.imagemSaida ? (
                        <img
                          src={`http://localhost:3003/uploads/${selectedAnimal.imagemSaida}`}
                          alt={`${selectedAnimal.nome} - saída`}
                          className={styles.imagemAnimal}
                        />
                      ) : (
                        <div className={styles.semImagem}>
                          Sem imagem de saída
                        </div>
                      )}
                    </div>
                  </div>

                  <div className={styles.descricaoContainer}>
                    <p className={styles.descricaoOriginal}>
                      {selectedAnimal.descricao}
                    </p>
                    <textarea
                      value={novaDescricao}
                      onChange={handleDescricaoChange}
                      placeholder="Adicione uma descrição sobre a saída do animal"
                      className={styles.textareaDescricao}
                      rows={5}
                    />
                    <button
                      onClick={adicionarDescricao}
                      disabled={!novaDescricao.trim()}
                      className={styles.botaoAdicionar}
                    >
                      Adicionar Descrição
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Slides dos animais existentes */}
          {animais.map((animal) => (
            <div key={`animal-${animal.id}`} className={styles.itemCarrossel}>
              <div className={styles.containerImagens}>
                <div className={styles.imagemContainer}>
                  <h3>Entrada</h3>
                  <img
                    src={`http://localhost:3003/uploads/${animal.imagem}`}
                    alt={`${animal.nome} - entrada`}
                    className={styles.imagemAnimal}
                  />
                </div>
                <div className={styles.imagemContainer}>
                  <h3>Saída</h3>
                  {animal.imagemSaida ? (
                    <img
                      src={`http://localhost:3003/uploads/${animal.imagemSaida}`}
                      alt={`${animal.nome} - saída`}
                      className={styles.imagemAnimal}
                    />
                  ) : (
                    <div className={styles.semImagem}>
                      Sem imagem de saída
                    </div>
                  )}
                </div>
              </div>

              <div className={styles.infoAnimal}>
                <h1>{animal.nome}</h1>
                <p className={styles.descricaoAnimal}>{animal.descricao}</p>
                {animal.descricaoSaida && (
                  <>
                    <h3>Descrição de Saída:</h3>
                    <p className={styles.descricaoSaida}>
                      {animal.descricaoSaida}
                    </p>
                  </>
                )}
              </div>
            </div>
          ))}
        </Carousel>
      </div>
    </div>
  );
}