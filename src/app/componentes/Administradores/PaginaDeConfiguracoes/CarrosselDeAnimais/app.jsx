import { useState } from "react";
import { Carousel } from "react-responsive-carousel";
import Select from "react-select";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import styles from "./carrosselAnimais.module.css";

export default function CarrosselAnimaisAutonomo() {
  return (
    <div className={styles.fundoCarrossel}>
      <Carousel
        className={styles.carrossel}
        showThumbs={false}
        showStatus={false}
        infiniteLoop={true}
        showIndicators={false}
      >
        <div className={styles.slideFormulario}>
          <div className={styles.alinharDadosAnimal}>
            <div className={styles.containerImagensAnimal}>
              <h2>Antes</h2>
              <img
                className={styles.imagensAnimal}
                src="/scooby.jpg"
                alt="imagem de quando o animal chegou no Instituto"
              />
            </div>
            <div className={styles.containerDescricaoAnimal}>
              <div className={styles.alinharDescricao}>
                <label>Nome do animal</label>
                <Select />
              </div>
              <div className={styles.alinharDescricao}>
                <label>Descrição do animal</label>
                <p className={styles.descricoesAnimal}>a</p>
              </div>
              <div className={styles.alinharBotaoMudarDescricao}>
                <button>Antes</button>
              </div>
            </div>
          </div>
          <div className={styles.alinharBotaoInserirAnimal}>
            <button>Inserir Animal</button>
          </div>
        </div>

        <div className={styles.slideAnimaisCadastrados}>
          <div className={styles.containerImagensAnimal}>
            <h2>Antes</h2>
            <img
              className={styles.imagensAnimal}
              src="/scooby.jpg"
              alt="imagem de quando o animal chegou no Instituto"
            />
          </div>
          <div className={styles.containerDescricaoAnimal}>
            <h1 className={styles.nomeAnimal}>Nome</h1>
              <p className={styles.descricoesAnimal}>a</p>
            <div className={styles.alinharBotaoMudarDescricao}>
              <button>Antes</button>
            </div>
          </div>
        </div>
      </Carousel>
    </div>
  );
}
