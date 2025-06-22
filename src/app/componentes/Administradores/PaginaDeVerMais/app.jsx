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
  const [vacinacaoError, setVacinacaoError] = useState("");
  // No início do componente, adicione:
  const [modalAberto, setModalAberto] = useState(false);
  const [imagemAmpliada, setImagemAmpliada] = useState("");

  useEffect(() => {
    const buscarAnimal = async () => {
      try {
        const resposta = await fetch(`http://localhost:3003/animais/${id}`);
        const dados = await resposta.json();

        // Verifica automaticamente o status de vacinação
        const hoje = new Date();
        const umAnoAtras = new Date(hoje);
        umAnoAtras.setFullYear(hoje.getFullYear() - 1);

        if (dados.dataVacinacao && new Date(dados.dataVacinacao) < umAnoAtras) {
          dados.statusVacinacao = "naoVacinado";
          setVacinacaoError(
            "Só será possível modificar o status de vacinação para vacinado quando a data de vacinação for menor que um ano em relação a data atual"
          );
        }

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
    setEditedAnimal((prev) => {
      const newState = { ...prev, [name]: value };
      checkDirty(animal, newState); // Verifica imediatamente
      return newState;
    });
  };

  const handleTextareaChange = (e) => {
    const { name, value } = e.target;
    setEditedAnimal((prev) => {
      const newState = { ...prev, [name]: value };
      checkDirty(animal, newState);
      return newState;
    });
  };

  const handleSelectChange = (name, selectedOption) => {
    setEditedAnimal((prev) => {
      const newState = { ...prev, [name]: selectedOption.value };
      checkDirty(animal, newState);
      return newState;
    });
  };

  const handleDateChange = (e) => {
    const { value } = e.target;
    setEditedAnimal((prev) => {
      const newState = {
        ...prev,
        dataVacinacao: value,
        statusVacinacao: value ? "vacinado" : "naoVacinado",
      };
      checkDirty(animal, newState);
      return newState;
    });
  };

  const checkDirty = (original, edited) => {
    if (!original || !edited) return false;

    const camposIgnorados = ["createdAt", "updatedAt"];

    for (const key in edited) {
      if (camposIgnorados.includes(key)) continue;

      const valorOriginal = original[key] === null ? "" : original[key];
      const valorEditado = edited[key] === null ? "" : edited[key];

      if (typeof valorOriginal !== typeof valorEditado) {
        setIsDirty(true);
        return true;
      }

      if (valorOriginal instanceof Date || valorEditado instanceof Date) {
        if (
          new Date(valorOriginal).getTime() !== new Date(valorEditado).getTime()
        ) {
          setIsDirty(true);
          return true;
        }
      } else if (String(valorOriginal) !== String(valorEditado)) {
        setIsDirty(true);
        return true;
      }
    }

    setIsDirty(false);
    return false;
  };

  const handleImageUpload = async (file, fieldName) => {
    if (!file) return;

    try {
      setIsLoading(true);

      // Endpoint correto para imagem de saída
      const endpoint =
        fieldName === "imagemSaida"
          ? `http://localhost:3003/animais/${id}/imagem-saida`
          : `http://localhost:3003/animais/${id}/imagem`;

      const formData = new FormData();
      formData.append(fieldName, file);

      const response = await fetch(endpoint, {
        method: "PUT",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro ao atualizar imagem");
      }

      const result = await response.json();
      setAnimal(result.animal);
      setEditedAnimal({ ...result.animal });

      alert(result.message || "Imagem atualizada com sucesso!");
    } catch (error) {
      console.error("Erro no upload:", error);
      alert(`Erro: ${error.message}`);
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

  const validarStatusVacinacao = (animal) => {
    if (!animal.dataVacinacao) return false;

    const dataVacinacao = new Date(animal.dataVacinacao);
    const umAnoAtras = new Date();
    umAnoAtras.setFullYear(umAnoAtras.getFullYear() - 1);

    return dataVacinacao >= umAnoAtras;
  };

  if (!animal || !editedAnimal) {
    return <div>Carregando...</div>;
  }

  const ModalAmpliarImagem = () => {
    if (!modalAberto) return null;

    return (
      <div
        className={styles.modalOverlay}
        onClick={() => setModalAberto(false)}
      >
        <div
          className={styles.modalContent}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            className={styles.botaoFecharModal}
            onClick={() => setModalAberto(false)}
          >
            &times;
          </button>
          <img
            src={imagemAmpliada}
            alt="Imagem ampliada"
            className={styles.imagemAmpliada}
          />
        </div>
      </div>
    );
  };

  return (
    <div className={styles.fundoPagina}>
      <HeaderAdms />
      <BotaoPagInicial />
      <RolarPCima />
      <ModalAmpliarImagem />

      <div className={styles.fundoVermais}>
        <div className={styles.painel}>
          <Carousel
            className={styles.carrossel}
            showThumbs={false}
            showStatus={false}
          >
            {/* Slide da Imagem de Entrada */}
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
                <div className={styles.botoesUtilitarios}>
                  <label className={styles.botaoTrocarImagem}>
                    <img src="/pagVerMais/galeria.png" alt="Trocar imagem" />
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
                  <button
                    className={styles.botaoVerAmpliado}
                    onClick={() => {
                      setImagemAmpliada(
                        animal.imagem
                          ? `http://localhost:3003/uploads/${animal.imagem}`
                          : "/pagFichasDAnimais/imagemTeste.jpg"
                      );
                      setModalAberto(true);
                    }}
                  >
                    <img src="/pagVerMais/olho.png" alt="Ver imagem ampliada" />
                  </button>
                </div>
              </div>
            </div>

            {/* Slide da Imagem de Saída */}
            <div
              className={styles.slideImagemSaida}
              style={{
                backgroundImage: animal.imagemSaida
                  ? `url(http://localhost:3003/uploads/${animal.imagemSaida})`
                  : animal.imagem
                  ? `url(http://localhost:3003/uploads/${animal.imagem})`
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
                  <div className={styles.botoesUtilitarios}>
                    <label className={styles.botaoTrocarImagem}>
                      <img src="/pagVerMais/galeria.png" alt="Trocar imagem" />
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
                    <button
                      className={styles.botaoVerAmpliado}
                      onClick={() => {
                        setImagemAmpliada(
                          animal.imagem
                            ? `http://localhost:3003/uploads/${animal.imagemSaida}`
                            : "/pagFichasDAnimais/imagemTeste.jpg"
                        );
                        setModalAberto(true);
                      }}
                    >
                      <img
                        src="/pagVerMais/olho.png"
                        alt="Ver imagem ampliada"
                      />
                    </button>
                  </div>
                </div>
              ) : (
                <div className={styles.semImagemDeSaida}>
                  <div className={styles.alinharImagemQuebrada}>
                    <img src="/pagVerMais/semImagem.png" alt="Sem imagem" />
                  </div>
                  <h1>Nenhuma imagem de saída foi cadastrada</h1>
                  <p>
                    Para inserir uma imagem,{" "}
                    <label>
                      clique aqui
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
                    </label>{" "}
                    e selecione uma imagem do seu dispositivo
                  </p>
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
                  onChange={(selectedOption) => {
                    const hoje = new Date();
                    const umAnoAtras = new Date(hoje);
                    umAnoAtras.setFullYear(hoje.getFullYear() - 1);

                    if (selectedOption.value === "vacinado") {
                      if (!editedAnimal.dataVacinacao) {
                        setVacinacaoError(
                          "Informe a data de vacinação primeiro"
                        );
                        return;
                      } else if (
                        new Date(editedAnimal.dataVacinacao) < umAnoAtras
                      ) {
                        setVacinacaoError(
                          "Data de vacinação expirada (deve ser nos últimos 12 meses)"
                        );
                        return;
                      }
                    }

                    setVacinacaoError("");
                    handleSelectChange("statusVacinacao", selectedOption);
                  }}
                  className={styles.selectInserirAnimal}
                  isDisabled={
                    editedAnimal.statusVacinacao === "naoVacinado" &&
                    (!editedAnimal.dataVacinacao ||
                      new Date(editedAnimal.dataVacinacao) <
                        new Date(
                          new Date().setFullYear(new Date().getFullYear() - 1)
                        ))
                  }
                />
                {vacinacaoError && (
                  <p className={styles.errorMessage}>{vacinacaoError}</p>
                )}
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
              <div className={styles.alinharDados}>
                <label className={styles.labelDadosSaude}>
                  Data da última vacinação
                </label>
                <input
                  className={styles.inputDadosIdentificacao}
                  type="date"
                  name="dataVacinacao"
                  value={
                    editedAnimal.dataVacinacao
                      ? editedAnimal.dataVacinacao.split("T")[0]
                      : ""
                  }
                  onChange={handleDateChange}
                  max={new Date().toISOString().split("T")[0]}
                />
              </div>
            </div>
          </div>

          <div className={styles.botaoSalvarContainer}>
            <button
              className={`${styles.botaoSalvar} ${
                !isDirty || isLoading ? styles.desativado : ""
              }`}
              onClick={() => {
                // Verificação final antes de salvar
                if (!checkDirty(animal, editedAnimal)) {
                  alert("Nenhuma alteração foi feita");
                  return;
                }
                handleSaveChanges();
              }}
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
