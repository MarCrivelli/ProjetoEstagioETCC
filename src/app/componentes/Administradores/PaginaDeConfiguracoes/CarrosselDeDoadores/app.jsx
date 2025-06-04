import { useState, useEffect, useRef } from "react";
import api from "../../../../../services/api";
import styles from "./carrosselDoadores.module.css";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

export default function CarrosselDeDoadores() {
  const [doadores, setDoadores] = useState([]);
  const [novoDoador, setNovoDoador] = useState({
    imagem: null,
    nome: "",
    descricao: "",
  });
  const fileInputRef = useRef(null);

  // Carrega os doadores do backend
  useEffect(() => {
    carregarDoadores();
  }, []);

  const carregarDoadores = async () => {
    try {
      const response = await api.get('/doadores');
      setDoadores(response.data);
    } catch (error) {
      console.error("Erro ao carregar doadores:", error);
    }
  };

  const handleImageChange = (e) => {
    setNovoDoador({ ...novoDoador, imagem: e.target.files[0] });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNovoDoador({ ...novoDoador, [name]: value });
  };

  const adicionarDoador = async () => {
    try {
      const formData = new FormData();
      formData.append("imagem", novoDoador.imagem);
      formData.append("nome", novoDoador.nome);
      formData.append("descricao", novoDoador.descricao);

      const response = await api.post("/doadores", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setDoadores([response.data, ...doadores]);
      setNovoDoador({ imagem: null, nome: "", descricao: "" });
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error("Erro ao adicionar doador:", error);
    }
  };

  const deletarDoador = async (id) => {
    try {
      const response = await api.delete(`/doadores/${id}`);
      setDoadores(doadores.filter(doador => doador.id !== id));
    } catch (error) {
      console.error("Erro ao deletar doador:", error);
    }
  };

  return (
    <div className={styles.fundoCarrosselDoadores}>
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
            <div className={styles.containerImagem}>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                ref={fileInputRef}
                style={{ display: "none" }}
                id="image-upload"
              />
              <label htmlFor="image-upload" className={styles.botaoAddImagemDoador}>
                {novoDoador.imagem ? (
                  <img
                    src={URL.createObjectURL(novoDoador.imagem)}
                    alt="Preview"
                    className={styles.fotoPreview}
                  />
                ) : (
                  <div className={styles.placeholderImagem}>
                    Clique para adicionar imagem
                  </div>
                )}
              </label>
            </div>
            <input
              type="text"
              name="nome"
              value={novoDoador.nome}
              onChange={handleInputChange}
              placeholder="Nome do doador"
              className={styles.inputForm}
            />
            <textarea
              name="descricao"
              value={novoDoador.descricao}
              onChange={handleInputChange}
              placeholder="Descrição"
              className={styles.textareaForm}
            />
            <button
              onClick={adicionarDoador}
              disabled={!novoDoador.imagem || !novoDoador.nome || !novoDoador.descricao}
              className={styles.botaoAdicionar}
            >
              Adicionar Doador
            </button>
          </div>

          {/* Slides dos doadores existentes */}
          {doadores.map((doador) => (
            <div key={doador.id} className={styles.itemCarrossel}>
              <div className={styles.containerImagem}>
                <img
                  src={`/uploads/${doador.imagem}`}
                  alt={doador.nome}
                  className={styles.fotoDoador}
                />
              </div>
              <h1>{doador.nome}</h1>
              <p>{doador.descricao}</p>
              <button
                onClick={() => deletarDoador(doador.id)}
                className={styles.botaoRemover}
              >
                Remover Doador
              </button>
            </div>
          ))}
        </Carousel>
      </div>
    </div>
  );
}