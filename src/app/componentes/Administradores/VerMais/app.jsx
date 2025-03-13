import styles from "./verMais.module.css";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";

export default function VerMais() {
  const { id } = useParams();
  const [animal, setAnimal] = useState(null);

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

  if (!animal) {
    return <div>Carregando...</div>;
  }

  return (
    <div className={styles.fundoVermais}>
      <h1>{animal.nome}</h1>
      <p>Idade: {animal.idade}</p>
      <p>Sexo: {animal.sexo}</p>
      <p>Tipo: {animal.tipo}</p>
      <p>Status de Microchipagem: {animal.statusMicrochipagem}</p>
      <p>Status de Vacinação: {animal.statusVacinacao}</p>
      <p>Status de Castração: {animal.statusCastracao}</p>
      <p>Status de Adoção: {animal.statusAdocao}</p>
      <p>Status de Vermifugação: {animal.statusVermifugacao}</p>
      <img
        src={animal.imagem ? `/uploads/${animal.imagem}` : "/pagFichasDAnimais/imagemTeste.jpg"}
        alt="Imagem do animal"
      />
    </div>
  );
}