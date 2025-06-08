import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import HeaderAdms from "../HeaderAdms/app";
import RolarPCima from "../../BotaoScroll/app";
import BotaoPagInicial from "../BotaoPagInicialAdms/app";
import styles from "../PaginaDeVerMais/verMais.module.css";

export default function VerMais() {
  const { id } = useParams();
  const [animal, setAnimal] = useState(null);
  const [imagemSaida, setImagemSaida] = useState(null);

  useEffect(() => {
    const buscarAnimal = async () => {
      try {
        const resposta = await fetch(`http://localhost:3003/animais/${id}`);
        const dados = await resposta.json();
        setAnimal(dados);
      } catch (error) {
        console.error("Erro ao buscar animal:", error);
      }
    };

    buscarAnimal();
  }, [id]);

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
        alert("Imagem de saída atualizada com sucesso!");
      } else {
        alert("Erro ao atualizar imagem de saída.");
      }
    } catch (error) {
      console.error("Erro ao atualizar imagem de saída:", error);
    }
  };

  if (!animal) {
    return <div>Carregando...</div>;
  }

  return (
    <>
      <HeaderAdms />
      <BotaoPagInicial />
      <RolarPCima />

      <div className={styles.fundoVermais}>
        <div className={styles.painel}>
          
        </div>

        {/* <h1>{animal.nome}</h1>
        <p>Idade: {animal.idade}</p>
        <p>Sexo: {animal.sexo}</p>
        <p>Tipo: {animal.tipo}</p>
        <p>Status de Microchipagem: {animal.statusMicrochipagem}</p>
        <p>Status de Vacinação: {animal.statusVacinacao}</p>
        <p>Status de Castração: {animal.statusCastracao}</p>
        <p>Status de Adoção: {animal.statusAdocao}</p>
        <p>Status de Vermifugação: {animal.statusVermifugacao}</p>

        <div className={styles.imagensContainer}>
          <div>
            <h2>Foto de Entrada</h2>
            <img
              src={
                animal.imagem
                  ? `http://localhost:3003/uploads/${animal.imagem}`
                  : "/pagFichasDAnimais/imagemTeste.jpg"
              }
              alt="Imagem de entrada"
              className={styles.imagemAnimal}
            />
          </div>

          <div>
            <h2>Foto de Saída</h2>
            {animal.imagemSaida ? (
              <img
                src={`http://localhost:3003/uploads/${animal.imagemSaida}`}
                alt="Imagem de saída"
                className={styles.imagemAnimal}
              />
            ) : (
              <div className={styles.semImagem}>
                Nenhuma imagem de saída cadastrada.
              </div>
            )}
            <input
              type="file"
              onChange={handleImagemSaidaChange}
              className={styles.inputImagem}
            />
          </div>
        </div> */}

        {/* design antigo */}

        {/* <div className={styles.imagensAnimal}>
            <div className={styles.containerImagemChegada}>
              <h1>Antes</h1>
              <img
                src={
                  animal.imagem
                    ? `http://localhost:3003/uploads/${animal.imagem}`
                    : "/pagFichasDAnimais/imagemTeste.jpg"
                }
                alt="Imagem de entrada"
                className={styles.imagemChegada}
              />
            </div>
            <div className={styles.containerImagemSaida}>
              <h1>Depois</h1>

              {animal.imagemSaida ? (
                <div className={styles.containerComImagem}>
                  <img
                    src={`http://localhost:3003/uploads/${animal.imagemSaida}`}
                    alt="Imagem de saída"
                    className={styles.imagemAnimal}
                  />
                  <label className={styles.botaoAlterarImagem}>
                    Alterar imagem
                    <input
                      type="file"
                      onChange={handleImagemSaidaChange}
                      className={styles.inputEscondido}
                      accept="image/*"
                    />
                  </label>
                </div>
              ) : (
                <label className={styles.containerSemImagem}>
                  <div className={styles.areaUpload}>
                    <span className={styles.iconeUpload}>+</span>
                    <span>Selecionar imagem de saída</span>
                  </div>
                  <input
                    type="file"
                    onChange={handleImagemSaidaChange}
                    className={styles.inputEscondido}
                    accept="image/*"
                  />
                </label>
              )}
            </div>
            <h1 className={styles.nomeAnimal}>{animal.nome}</h1>
          </div> */}
      </div>
    </>
  );
}
