import { useState } from "react";
import { FaChevronRight, FaChevronLeft } from "react-icons/fa";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import styles from "./carrosselAnimais.module.css";

export default function CarrosselAnimaisAutonomo({ animais = [], ehMobile = false }) {
  // Adicionamos valores padrão para animais e ehMobile
  const [estadosAntesDepois, setEstadosAntesDepois] = useState(
    animais.reduce((acc, animal) => {
      acc[animal.id] = true; // true = antes, false = depois
      return acc;
    }, {})
  );

  const alternarAntesDepois = (animalId) => {
    setEstadosAntesDepois(prev => ({
      ...prev,
      [animalId]: !prev[animalId]
    }));
  };

  // Se não houver animais, retornamos null ou uma mensagem
  if (animais.length === 0) {
    return <div className={styles.semAnimais}>Nenhum animal disponível</div>;
  }

  return (
    <Carousel
      showArrows={!ehMobile}
      showThumbs={false}
      showStatus={false}
      showIndicators={!ehMobile}
      infiniteLoop={true}
      swipeable={true}
      emulateTouch={true}
      preventMovementUntilSwipeScrollTolerance={true}
      swipeScrollTolerance={40}
      renderArrowPrev={
        ehMobile
          ? () => null
          : (onClickHandler, hasPrev, label) => (
              <button
                type="button"
                onClick={onClickHandler}
                title={label}
                className={`${styles.setaCarrossel} ${styles.setaEsquerda}`}
                disabled={!hasPrev}
              >
                <FaChevronLeft />
              </button>
            )
      }
      renderArrowNext={
        ehMobile
          ? () => null
          : (onClickHandler, hasNext, label) => (
              <button
                type="button"
                onClick={onClickHandler}
                title={label}
                className={`${styles.setaCarrossel} ${styles.setaDireita}`}
                disabled={!hasNext}
              >
                <FaChevronRight />
              </button>
            )
      }
    >
      {animais.map((animal) => (
        <div key={animal.id} className={styles.itemCarrosselAnimal}>
          <div className={styles.conteudoAnimal}>
            
            <div className={styles.containerImagem}>
              <h2>{estadosAntesDepois[animal.id] ? "Antes" : "Depois"}</h2>
              <img
                src={estadosAntesDepois[animal.id] ? animal.antes : animal.depois}
                alt={`${animal.nome} ${
                  estadosAntesDepois[animal.id] ? "antes" : "depois"
                }`}
                className={styles.imagemAnimal}
              />
            </div>

            <div className={styles.containerDescricao}>
              <h1>{animal.nome}</h1>
              <p className={styles.descricaoAnimal}>
                {estadosAntesDepois[animal.id]
                  ? animal.descricaoAntes
                  : animal.descricaoDepois}
              </p>
              <button
                className={styles.botaoProximo}
                onClick={() => alternarAntesDepois(animal.id)}
              >
                {estadosAntesDepois[animal.id] ? "Próxima imagem" : "Imagem anterior"}
              </button>
            </div>

          </div>
        </div>
      ))}
    </Carousel>
  );
}