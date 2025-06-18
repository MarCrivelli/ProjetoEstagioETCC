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
  const [isLoading, setIsLoading] = useState(false);
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

  const handleImageUpload = async (file, fieldName) => {
    if (!file) return;

    const formData = new FormData();
    formData.append(fieldName, file);

    try {
      setIsLoading(true);
      const resposta = await fetch(
        `http://localhost:3003/animais/${id}/${fieldName}`,
        {
          method: "PUT",
          body: formData,
        }
      );

      if (resposta.ok) {
        const dados = await resposta.json();
        setAnimal(dados.animal);
        setEditedAnimal({ ...dados.animal });
        alert(
          `Imagem ${
            fieldName === "imagem" ? "principal" : "de saída"
          } atualizada com sucesso!`
        );
      } else {
        alert(
          `Erro ao atualizar imagem ${
            fieldName === "imagem" ? "principal" : "de saída"
          }.`
        );
      }
    } catch (error) {
      console.error(`Erro ao atualizar imagem ${fieldName}:`, error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveChanges = async () => {
    try {
      setIsLoading(true);
      const resposta = await fetch(`http://localhost:3003/animais/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editedAnimal),
      });

      if (resposta.ok) {
        const dados = await resposta.json();
        setAnimal(dados.animal);
        setEditedAnimal({ ...dados.animal });
        setIsDirty(false);
        alert("Dados atualizados com sucesso!");
      } else {
        alert("Erro ao atualizar dados do animal.");
      }
    } catch (error) {
      console.error("Erro ao atualizar animal:", error);
    } finally {
      setIsLoading(false);
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
          <Carousel
            className={styles.carrossel}
            showThumbs={false}
            showStatus={false}
          >
            <div
              className={styles.slideImagemEntrada}
              style={{
                backgroundImage: animal.imagem
                  ? `url(http://localhost:3003/uploads/${animal.imagem})`
                  : "url(/pagFichasDAnimais/imagemTeste.jpg)",
              }}
            >
              <div className={styles.containerImagemCarrossel}>
                <img
                  src={
                    animal.imagem
                      ? `http://localhost:3003/uploads/${animal.imagem}`
                      : "/pagFichasDAnimais/imagemTeste.jpg"
                  }
                  alt="Imagem de entrada"
                  className={styles.imagemPrincipal}
                />
                <label className={styles.botaoTrocarImagem}>
                  {isLoading ? "Processando..." : "Trocar imagem"}
                  <input
                    type="file"
                    onChange={(e) =>
                      handleImageUpload(e.target.files[0], "imagem")
                    }
                    style={{ display: "none" }}
                    accept="image/*"
                    disabled={isLoading}
                  />
                </label>
              </div>
            </div>
            <div
              className={styles.slideImagemSaida}
              style={{
                backgroundImage: animal.imagemSaida
                  ? `url(http://localhost:3003/uploads/${animal.imagemSaida})`
                  : "none",
              }}
            >
              {animal.imagemSaida ? (
                <div className={styles.containerImagemCarrossel}>
                  <img
                    src={`http://localhost:3003/uploads/${animal.imagemSaida}`}
                    alt="Imagem de saída"
                    className={styles.imagemPrincipal}
                  />
                  <label className={styles.botaoTrocarImagem}>
                    {isLoading ? "Processando..." : "Trocar imagem"}
                    <input
                      type="file"
                      onChange={(e) =>
                        handleImageUpload(e.target.files[0], "imagemSaida")
                      }
                      style={{ display: "none" }}
                      accept="image/*"
                      disabled={isLoading}
                    />
                  </label>
                </div>
              ) : (
                <div className={styles.semImagemDeSaida}>
                  <div className={styles.alinharImagemQuebrada}>
                    <img src="/pagVerMais/semImagem.png"></img>
                  </div>
                  <h1>Nenhuma Imagem foi encontrada</h1>
                  <div className={styles.divBotoesUtilitarios}>
                    <label className={styles.botaoAdicionarImagem}>
                      <img src="/pagVerMais/adicionarImagem.png" />
                      <input
                        type="file"
                        onChange={(e) =>
                          handleImageUpload(e.target.files[0], "imagemSaida")
                        }
                        style={{ display: "none" }}
                        accept="image/*"
                        ref={fileInputRef}
                        disabled={isLoading}
                      />
                    </label>
                    {/* Se for preciso acrescentar mais botões, o layout já está preparado */}
                  </div>
                </div>
              )}
            </div>
          </Carousel>

          <div className={styles.alinharDadosDeIdentificacao}>
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
              <div className={styles.alinharDados}>
                <label className={styles.labelDeIdentificacao}>Nome:</label>
                <input
                  className={styles.inputDadosIdentificacao}
                  name="nome"
                  maxLength={30}
                  type="text"
                  value={editedAnimal.nome || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className={styles.alinharDados}>
                <label className={styles.labelDeIdentificacao}>Idade:</label>
                <input
                  className={styles.inputDadosIdentificacao}
                  name="idade"
                  min="0"
                  max="20"
                  type="number"
                  value={editedAnimal.idade || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className={styles.alinharDados}>
                <label className={styles.labelDeIdentificacao}>Sexo:</label>
                <Select
                  options={opcoes.sexoDoAnimal}
                  value={opcoes.sexoDoAnimal.find(
                    (option) => option.value === editedAnimal.sexo
                  )}
                  onChange={(selectedOption) =>
                    handleSelectChange("sexo", selectedOption)
                  }
                  className={styles.selectInserirAnimal}
                />
              </div>
              <div className={styles.alinharDados}>
                <label className={styles.labelDeIdentificacao}>Tipo:</label>
                <Select
                  options={opcoes.tipoAnimal}
                  value={opcoes.tipoAnimal.find(
                    (option) => option.value === editedAnimal.tipo
                  )}
                  onChange={(selectedOption) =>
                    handleSelectChange("tipo", selectedOption)
                  }
                  className={styles.selectInserirAnimal}
                />
              </div>
              <div className={styles.alinharDados}>
                <label className={styles.labelDeIdentificacao}>
                  Status de microchipagem:
                </label>
                <Select
                  options={opcoes.StatusMicrochipagem}
                  value={opcoes.StatusMicrochipagem.find(
                    (option) =>
                      option.value === editedAnimal.statusMicrochipagem
                  )}
                  onChange={(selectedOption) =>
                    handleSelectChange("statusMicrochipagem", selectedOption)
                  }
                  className={styles.selectInserirAnimal}
                />
              </div>
            </div>

            <div className={styles.dadosDeIdentificacao}>
              <h1 className={styles.tituloDadosDeIdentificacao}>
                Dados de saúde
              </h1>
              <div className={styles.alinharDados}>
                <label className={styles.labelDadosSaude}>
                  Status de vacinação:
                </label>
                <Select
                  options={opcoes.StatusVacinacao}
                  value={opcoes.StatusVacinacao.find(
                    (option) => option.value === editedAnimal.statusVacinacao
                  )}
                  onChange={(selectedOption) =>
                    handleSelectChange("statusVacinacao", selectedOption)
                  }
                  className={styles.selectInserirAnimal}
                />
              </div>
              <div className={styles.alinharDados}>
                <label className={styles.labelDadosSaude}>
                  Status de castração:
                </label>
                <Select
                  options={opcoes.StatusCastracao}
                  value={opcoes.StatusCastracao.find(
                    (option) => option.value === editedAnimal.statusCastracao
                  )}
                  onChange={(selectedOption) =>
                    handleSelectChange("statusCastracao", selectedOption)
                  }
                  className={styles.selectInserirAnimal}
                />
              </div>
              <div className={styles.alinharDados}>
                <label className={styles.labelDadosSaude}>
                  Status de adoção:
                </label>
                <Select
                  options={opcoes.StatusAdocao}
                  value={opcoes.StatusAdocao.find(
                    (option) => option.value === editedAnimal.statusAdocao
                  )}
                  onChange={(selectedOption) =>
                    handleSelectChange("statusAdocao", selectedOption)
                  }
                  className={styles.selectInserirAnimal}
                />
              </div>
              <div className={styles.alinharDados}>
                <label className={styles.labelDadosSaude}>
                  Status de vermifugação:
                </label>
                <Select
                  options={opcoes.StatusVermifugacao}
                  value={opcoes.StatusVermifugacao.find(
                    (option) => option.value === editedAnimal.statusVermifugacao
                  )}
                  onChange={(selectedOption) =>
                    handleSelectChange("statusVermifugacao", selectedOption)
                  }
                  className={styles.selectInserirAnimal}
                />
              </div>
            </div>
          </div>

          <div className={styles.botaoSalvarContainer}>
            <button
              className={`${styles.botaoSalvar} ${
                !isDirty || isLoading ? styles.desativado : ""
              }`}
              onClick={handleSaveChanges}
              disabled={!isDirty || isLoading}
            >
              {isLoading ? "Salvando..." : "Salvar Alterações"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
