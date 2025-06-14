import { useParams } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import Select from "react-select";

import opcoes from "/src/app/componentes/Administradores/OpcoesDeSelecao/opcoes";
import HeaderAdms from "../HeaderAdms/app";
import RolarPCima from "../../BotaoScroll/app";
import BotaoPagInicial from "../BotaoPagInicialAdms/app";
import styles from "../PaginaDeVerMais/verMais.module.css";

export default function VerMais() {
  const { id } = useParams();
  const [animal, setAnimal] = useState(null);
  const [editedAnimal, setEditedAnimal] = useState(null);
  const [isDirty, setIsDirty] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const buscarAnimal = async () => {
      try {
        const resposta = await fetch(`http://localhost:3003/animais/${id}`);
        const dados = await resposta.json();
        setAnimal(dados);
        setEditedAnimal({ ...dados });
      } catch (error) {
        console.error("Erro ao buscar animal:", error);
      }
    };

    buscarAnimal();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedAnimal((prev) => ({
      ...prev,
      [name]: value,
    }));
    checkDirty();
  };

  const handleTextareaChange = (e) => {
    const { name, value } = e.target;
    setEditedAnimal((prev) => ({
      ...prev,
      [name]: value,
    }));
    checkDirty();
  };

  const handleSelectChange = (name, selectedOption) => {
    setEditedAnimal((prev) => ({
      ...prev,
      [name]: selectedOption.value,
    }));
    checkDirty();
  };

  const checkDirty = () => {
    const changed = Object.keys(editedAnimal).some(
      (key) => animal[key] !== editedAnimal[key]
    );
    setIsDirty(changed);
  };

  const handleImagemSaidaChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("imagemSaida", file);

    try {
      const resposta = await fetch(
        `http://localhost:3003/animais/${id}/imagem-saida`,
        {
          method: "PUT",
          body: formData,
        }
      );

      if (resposta.ok) {
        const dados = await resposta.json();
        setAnimal(dados.animal);
        setEditedAnimal({ ...dados.animal });
        alert("Imagem de saída atualizada com sucesso!");
      } else {
        alert("Erro ao atualizar imagem de saída.");
      }
    } catch (error) {
      console.error("Erro ao atualizar imagem de saída:", error);
    }
  };

  const handleImagemEntradaChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("imagem", file);

    try {
      const resposta = await fetch(
        `http://localhost:3003/animais/${id}/imagem`,
        {
          method: "PUT",
          body: formData,
        }
      );

      if (resposta.ok) {
        const dados = await resposta.json();
        setAnimal(dados.animal);
        setEditedAnimal({ ...dados.animal });
        alert("Imagem de entrada atualizada com sucesso!");
      } else {
        alert("Erro ao atualizar imagem de entrada.");
      }
    } catch (error) {
      console.error("Erro ao atualizar imagem de entrada:", error);
    }
  };

  const handleSaveChanges = async () => {
    try {
      const resposta = await fetch(`http://localhost:3003/animais/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editedAnimal),
      });

      if (resposta.ok) {
        const dados = await resposta.json();
        setAnimal(dados);
        setEditedAnimal({ ...dados });
        setIsDirty(false);
        alert("Dados atualizados com sucesso!");
      } else {
        alert("Erro ao atualizar dados do animal.");
      }
    } catch (error) {
      console.error("Erro ao atualizar animal:", error);
    }
  };

  if (!animal || !editedAnimal) {
    return <div>Carregando...</div>;
  }

  return (
    <div className={styles.fundoPagina}>
      <HeaderAdms />
      <BotaoPagInicial />
      <RolarPCima />

      <div className={styles.fundoVermais}>
        <div className={styles.painel}>
          <div className={styles.bloco}>
            <Carousel
              className={styles.carrossel}
              showThumbs={false}
              showStatus={false}
            >
              <div className={styles.slideImagemEntrada}>
                <img
                  src={
                    animal.imagem
                      ? `http://localhost:3003/uploads/${animal.imagem}`
                      : "/pagFichasDAnimais/imagemTeste.jpg"
                  }
                  alt="Imagem de entrada"
                />
                <label className={styles.botaoTrocarImagem}>
                  Trocar imagem
                  <input
                    type="file"
                    onChange={handleImagemEntradaChange}
                    style={{ display: "none" }}
                    accept="image/*"
                  />
                </label>
              </div>
              <div className={styles.slideImagemSaida}>
                {animal.imagemSaida ? (
                  <>
                    <img
                      src={`http://localhost:3003/uploads/${animal.imagemSaida}`}
                      alt="Imagem de saída"
                    />
                    <label className={styles.botaoTrocarImagem}>
                      Trocar imagem
                      <input
                        type="file"
                        onChange={handleImagemSaidaChange}
                        style={{ display: "none" }}
                        accept="image/*"
                      />
                    </label>
                  </>
                ) : (
                  <>
                    <div className={styles.placeholderImagemSaida}>
                      <span>Nenhuma imagem de saída cadastrada</span>
                    </div>
                    <label className={styles.botaoAdicionarImagem}>
                      Escolher imagem
                      <input
                        type="file"
                        onChange={handleImagemSaidaChange}
                        style={{ display: "none" }}
                        accept="image/*"
                        ref={fileInputRef}
                      />
                    </label>
                  </>
                )}
              </div>
            </Carousel>

            {/* Nova seção de descrição */}
            <div className={styles.dadosDeIdentificacao}>
              <h1 className={styles.tituloDadosDeIdentificacao}>
                Descrição do Animal
              </h1>
              <textarea
                className={styles.descricaoTextarea}
                name="descricao"
                value={editedAnimal.descricao || ""}
                onChange={handleTextareaChange}
                placeholder="Adicione uma descrição sobre o animal (comportamento, histórico, etc.)"
                rows={5}
              />
            </div>

            <div className={styles.dadosDeIdentificacao}>
              <h1 className={styles.tituloDadosDeIdentificacao}>
                Dados de identificação
              </h1>
              <div className={styles.alinharDadosDeIdentificacao}>
                <label className={styles.labelDeIdentificacao}>Nome:</label>
                <input
                  className={styles.inputDadosIdentificacao}
                  maxLength={30}
                  type="text"
                  placeholder={animal.nome}
                />
              </div>
              <div className={styles.alinharDadosDeIdentificacao}>
                <label className={styles.labelDeIdentificacao}>Idade:</label>
                <input
                  className={styles.inputDadosIdentificacao}
                  min="0"
                  max="20"
                  type="number"
                  placeholder="insira uma idade"
                />
              </div>
              <div className={styles.alinharDadosDeIdentificacao}>
                <label className={styles.labelDeIdentificacao}>Sexo:</label>
                <Select
                  options={opcoes.sexoDoAnimal}
                  placeholder="selecione"
                  className={styles.selectInserirAnimal}
                />
              </div>
              <div className={styles.alinharDadosDeIdentificacao}>
                <label className={styles.labelDeIdentificacao}>Tipo:</label>
                <Select
                  options={opcoes.tipoAnimal}
                  placeholder="selecione"
                  className={styles.selectInserirAnimal}
                />
              </div>
              <div className={styles.alinharDadosDeIdentificacao}>
                <label className={styles.labelDeIdentificacao}>
                  Status de microchipagem:
                </label>
                <Select
                  options={opcoes.StatusMicrochipagem}
                  placeholder="selecione"
                  className={styles.selectInserirAnimal}
                />
              </div>
            </div>

            <div className={styles.dadosDeIdentificacao}>
              <h1 className={styles.tituloDadosDeIdentificacao}>
                Dados de saúde
              </h1>
              <div className={styles.alinharDadosDeIdentificacao}>
                <label className={styles.labelDadosSaude}>
                  Status de vacinação:
                </label>
                <Select
                  options={opcoes.StatusVacinacao}
                  placeholder="selecione"
                  className={styles.selectInserirAnimal}
                />
              </div>
              <div className={styles.alinharDadosDeIdentificacao}>
                <label className={styles.labelDadosSaude}>
                  Status de castração:
                </label>
                <Select
                  options={opcoes.StatusCastracao}
                  placeholder="selecione"
                  className={styles.selectInserirAnimal}
                />
              </div>
              <div className={styles.alinharDadosDeIdentificacao}>
                <label className={styles.labelDadosSaude}>
                  Status de adoção:
                </label>
                <Select
                  options={opcoes.StatusAdocao}
                  placeholder="selecione"
                  className={styles.selectInserirAnimal}
                />
              </div>
              <div className={styles.alinharDadosDeIdentificacao}>
                <label className={styles.labelDadosSaude}>
                  Status de vermifugação:
                </label>
                <Select
                  options={opcoes.StatusVermifugacao}
                  placeholder="selecione"
                  className={styles.selectInserirAnimal}
                />
              </div>
            </div>

            <div className={styles.botaoSalvarContainer}>
              <button
                className={`${styles.botaoSalvar} ${
                  !isDirty ? styles.desativado : ""
                }`}
                onClick={handleSaveChanges}
                disabled={!isDirty}
              >
                Salvar Alterações
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
