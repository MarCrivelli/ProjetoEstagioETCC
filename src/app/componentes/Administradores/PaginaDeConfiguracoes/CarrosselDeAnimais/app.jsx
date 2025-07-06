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
  const [descricaoSaida, setDescricaoSaida] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [carregandoCarrossel, setCarregandoCarrossel] = useState(false);
  const [mostrarImagemSaidaPorItem, setMostrarImagemSaidaPorItem] = useState(
    {}
  );

  useEffect(() => {
    carregarAnimais();
    carregarAnimaisCarrossel();
    console.log("Animais do carrossel:", carregarAnimaisCarrossel());
  }, []);

  const carregarAnimais = async () => {
    try {
      setCarregando(true);
      const response = await fetch(
        "http://localhost:3003/carrossel/animais/selecao"
      );

      console.log("Resposta da API (/carrossel/animais/selecao):", response); // Log de debug

      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }

      const data = await response.json();
      console.log("Dados recebidos (/carrossel/animais/selecao):", data); // Log de debug

      // Verificação básica - mostra todos os animais sem filtro inicialmente
      setAnimais(
        data.map((animal) => ({
          value: animal.id,
          label: animal.nome,
          originalData: animal, // Mantemos os dados completos para referência
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
       console.log("Dados do carrossel recebidos:", data); // Log de debug

       const dadosProcessados = Array.isArray(data.data) // Verifique se está acessando a propriedade correta
         ? data.data.filter(item => item?.animal).map(item => ({
             ...item,
             animal: {
               ...item.animal,
               imagem: item.animal.imagem || null,
               imagemSaida: item.animal.imagemSaida || null,
               nome: item.animal.nome || "Animal sem nome",
               descricao: item.animal.descricao || "Sem descrição"
             }
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
    if (!selectedOption) return;

    try {
      const response = await fetch(
        `http://localhost:3003/animais/${selectedOption.value}`
      );

      if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);

      const data = await response.json();
      setAnimalSelecionado(data);
      setDescricaoSaida(data.descricaoSaida || "");
    } catch (error) {
      console.error("Erro ao buscar animal:", error);
      setErro("Erro ao buscar detalhes do animal. Tente novamente.");
    }
  };

  const alternarImagemItem = (itemId) => {
    setMostrarImagemSaidaPorItem((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
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
        const errorData = await response.json().catch(() => ({}));
        console.error("Erro detalhado:", errorData);
        throw new Error(
          errorData.message ||
            `Erro ao adicionar animal (Status ${response.status})`
        );
      }

      // Recarrega as listas
      await Promise.all([carregarAnimaisCarrossel(), carregarAnimais()]);

      // Limpa o formulário
      setAnimalSelecionado(null);
      setDescricaoSaida("");
      setErro("");
    } catch (error) {
      console.error("Erro ao adicionar animal ao carrossel:", error);
      setErro(
        error.message ||
          "Erro ao adicionar animal. Verifique o console para mais detalhes."
      );
    }
  };

  if (carregando || carregandoCarrossel) {
    return <div className={styles.loading}>Carregando...</div>;
  }

  if (erro) {
    return (
      <div className={styles.error}>
        {erro}
        <button
          onClick={() => {
            setErro("");
            carregarAnimaisCarrossel();
            carregarAnimais();
          }}
        >
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
              <h2>Antes</h2>
              {animalSelecionado?.imagem ? (
                <img
                  className={styles.imagensAnimal}
                  src={`http://localhost:3003/uploads/${animalSelecionado.imagem}`}
                  alt={`Imagem do animal ${animalSelecionado.nome}`}
                  onError={(e) => {
                    e.target.src = "/placeholder-image.jpg";
                    e.target.onerror = null;
                  }}
                />
              ) : (
                <div className={styles.placeholderImagem}>
                  Sem imagem disponível
                </div>
              )}
            </div>
            <div className={styles.containerDescricaoAnimal}>
              <div className={styles.alinharDescricao}>
                <label>Nome do animal</label>
                <Select
                  options={animais}
                  onChange={handleSelecionarAnimal}
                  placeholder="Selecione um animal"
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
              <div className={styles.alinharDescricao}>
                <label>Descrição de saída</label>
                <textarea
                  className={styles.descricoesAnimal}
                  value={descricaoSaida}
                  onChange={(e) => setDescricaoSaida(e.target.value)}
                  placeholder="Digite a descrição de saída do animal"
                />
              </div>
            </div>
          </div>
          <div className={styles.alinharBotaoInserirAnimal}>
            <button
              onClick={handleAdicionarAnimal}
              disabled={!descricaoSaida || !animalSelecionado}
            >
              Inserir Animal
            </button>
          </div>
        </div>

        {/* Slides dos animais cadastrados no carrossel */}
        {animaisCarrossel.length > 0 ? (
          animaisCarrossel.map((item) => {
            const mostrarSaida = mostrarImagemSaidaPorItem[item.id] || false;

            return (
              <div key={item.id} className={styles.slideAnimaisCadastrados}>
                <div className={styles.containerImagensAnimal}>
                  <h2>{mostrarSaida ? "Depois" : "Antes"}</h2>
                  {mostrarSaida ? (
                    item.animal.imagemSaida ? (
                      <img
                        className={styles.imagensAnimal}
                        src={`http://localhost:3003/uploads/${item.animal.imagemSaida}`}
                        alt={`Imagem depois do animal ${item.animal.nome}`}
                        onError={(e) => {
                          e.target.src = "/placeholder-image.jpg";
                          e.target.onerror = null;
                        }}
                      />
                    ) : (
                      <div className={styles.placeholderImagem}>
                        Sem imagem de depois
                      </div>
                    )
                  ) : item.animal.imagem ? (
                    <img
                      className={styles.imagensAnimal}
                      src={`http://localhost:3003/uploads/${item.animal.imagem}`}
                      alt={`Imagem antes do animal ${item.animal.nome}`}
                      onError={(e) => {
                        e.target.src = "/placeholder-image.jpg";
                        e.target.onerror = null;
                      }}
                    />
                  ) : (
                    <div className={styles.placeholderImagem}>
                      Sem imagem de antes
                    </div>
                  )}
                </div>
                <div className={styles.containerDescricaoAnimal}>
                  <h1 className={styles.nomeAnimal}>{item.animal.nome}</h1>
                  <p className={styles.descricoesAnimal}>
                    {mostrarSaida
                      ? item.descricaoSaida || "Sem descrição de saída"
                      : item.animal.descricao || "Sem descrição"}
                  </p>
                  <div className={styles.alinharBotaoMudarDescricao}>
                    <button onClick={() => alternarImagemItem(item.id)}>
                      {mostrarSaida ? "Ver Antes" : "Ver Depois"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className={styles.slideAnimaisCadastrados}>
            <p>Nenhum animal cadastrado no carrossel</p>
          </div>
        )}
      </Carousel>
    </div>
  );
}
