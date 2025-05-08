import { FaChevronRight, FaChevronLeft } from "react-icons/fa";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import styles from "./carrosselDoadores.module.css";

export default function CarrosselDoador({ doadores, ehMobile }) {
  return (
    <Carousel
      showArrows={!ehMobile}
      showThumbs={false}
      showStatus={false}
      showIndicators={false}
      infiniteLoop={false}
      swipeable={true}
      emulateTouch={true}
      preventMovementUntilSwipeScrollTolerance={true}
      swipeScrollTolerance={15}
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
      {doadores.map((doador) => (
        <div key={doador.id} className={styles.itemCarrossel}>
          <div className={styles.containerImagem}>
            <img
              src={doador.imagem}
              alt={doador.nome}
              className={styles.fotoDoador}
            />
          </div>
          <h1>{doador.nome}</h1>
          <p>{doador.texto}</p>
        </div>
      ))}
    </Carousel>
  );
}