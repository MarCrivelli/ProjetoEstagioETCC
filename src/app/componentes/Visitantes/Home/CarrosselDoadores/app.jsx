import { useState, useEffect } from "react";
import api from "../../../../../services/api";
import styles from "./carrosselDoadores.module.css";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { FaChevronRight, FaChevronLeft } from "react-icons/fa";

export default function CarrosselDoadoresVisitantes({ ehMobile }) {
  const [doadores, setDoadores] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    const carregarDoadores = async () => {
      try {
        const response = await api.get('/doadores');
        setDoadores(response.data);
        setErro(null);
      } catch (error) {
        console.error("Erro ao carregar doadores:", error);
        setErro("Não foi possível carregar os doadores. Tente novamente mais tarde.");
      } finally {
        setCarregando(false);
      }
    };

    carregarDoadores();
  }, []);

  if (carregando) {
    return (
      <div className={styles.fundoCarrosselVisitantes}>
        <div className={styles.carregando}>Carregando doadores...</div>
      </div>
    );
  }

  if (erro) {
    return (
      <div className={styles.fundoCarrosselVisitantes}>
        <div className={styles.erro}>{erro}</div>
      </div>
    );
  }

  if (doadores.length === 0) {
    return (
      <div className={styles.fundoCarrosselVisitantes}>
        <div className={styles.semDoadores}>
          <img 
            src="/sem-doadores.png" 
            alt="Nenhum doador cadastrado"
            className={styles.imagemSemDoadores}
          />
          <h2>Nenhum doador cadastrado ainda</h2>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.fundoCarrosselVisitantes}>
      <Carousel
        showArrows={!ehMobile}
        showThumbs={false}
        showStatus={false}
        showIndicators={!ehMobile}
        infiniteLoop={true}
        swipeable={true}
        emulateTouch={true}
        className={styles.carrossel}
        renderArrowPrev={(onClickHandler, hasPrev, label) =>
          ehMobile ? null : (
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
        renderArrowNext={(onClickHandler, hasNext, label) =>
          ehMobile ? null : (
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
                src={`/uploads/${doador.imagem}`}
                alt={doador.nome}
                className={styles.fotoDoador}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/imagem-padrao-doador.jpg";
                }}
              />
            </div>
            <div className={styles.infoDoador}>
              <h2 className={styles.nomeDoador}>{doador.nome}</h2>
              <p className={styles.descricaoDoador}>{doador.descricao}</p>
            </div>
          </div>
        ))}
      </Carousel>
    </div>
  );
}