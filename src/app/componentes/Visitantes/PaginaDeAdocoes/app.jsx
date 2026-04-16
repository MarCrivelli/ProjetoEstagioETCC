import { useState } from "react";
import Header from "../HeaderVisitantes/app";
import Footer from "../Footer/app";
import carregarAnimais from "../../GerenciarDadosAnimais/CarregarAnimais/carregarAnimais";
import styles from "./adote.module.css";
import opcoes from "/src/app/componentes/Administradores/OpcoesDeSelecao/opcoes";
import { Carousel } from "react-responsive-carousel";

export default function QueroAdotar() {
  const { animaisFiltrados, carregando, erro } = carregarAnimais({});
  const [itemAtual, setItemAtual] = useState(0);

  if (carregando) return <p>Carregando...</p>;
  if (erro) return <p>Erro: {erro}</p>;

  const ultimoIndice = animaisFiltrados.length - 1;

  const irParaProximo = (e) => {
    e.preventDefault();
    e.stopPropagation();

    setItemAtual((valorAtual) =>
      valorAtual < ultimoIndice ? valorAtual + 1 : valorAtual,
    );
  };

  const irParaAnterior = (e) => {
    e.preventDefault();
    e.stopPropagation();

    setItemAtual((valorAtual) =>
      valorAtual > 0 ? valorAtual - 1 : valorAtual,
    );
  };

  return (
    <>
      <div className={styles.containerParallax}>
        <main>
          <section
            className={`${styles.modulo} ${styles.parallax} ${styles.parallax1}`}
          >
            <Header />
            <h1>Animais disponíveis para a adoção</h1>
          </section>

          <section className={`${styles.modulo} ${styles.conteudo}`}>
            <Carousel
              className={styles.carrossel}
              selectedItem={itemAtual}
              onChange={setItemAtual}
              showThumbs={false}
              showStatus={false}
              showIndicators={false}
              showArrows={false}
              infiniteLoop={false}
              swipeable={false}
              emulateTouch={false}
              autoPlay={true}
              centerMode={true}
              centerSlidePercentage={26}
              transitionTime={800}
              interval={4000}
            >
              {animaisFiltrados.map((animal, indice) => {
                const emFoco = indice === itemAtual;

                return (
                  <div key={animal.id} className={styles.itemSlide}>
                    <div
                      className={`${styles.cardAnimal} ${
                        emFoco ? styles.cardAtivo : styles.cardInativo
                      }`}
                    >
                      <img
                        src={`http://localhost:3003/uploads/${animal.imagemEntrada}`}
                        alt={animal.nome}
                        draggable={false}
                      />

                      <h1>{animal.nome}</h1>

                      <p>
                        Idade:{" "}
                        {opcoes.vincularLabel(
                          animal.idade?.toString(),
                          "idadeAnimais",
                        )}
                      </p>

                      <p>
                        Sexo:{" "}
                        {opcoes.vincularLabel(animal.sexo, "sexoDoAnimal")}
                      </p>

                      <p>
                        Status de castração:{" "}
                        {opcoes.vincularLabel(
                          animal.statusCastracao,
                          "StatusCastracao",
                        )}
                      </p>

                      <button
                        type="button"
                        className={styles.botaoSobre}
                        onMouseDown={(e) => e.stopPropagation()}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          console.log("Sobre animal:", animal.id);
                        }}
                      >
                        Sobre
                      </button>

                      {emFoco && (
                        <div className={styles.acoesCard}>
                          
                            <button
                              type="button"
                              className={`${styles.botaoNavegacao} ${styles.botaoEsquerdo}`}
                              onClick={irParaAnterior}
                              disabled={itemAtual === 0}
                            >
                              &lt;
                            </button>

                            <button
                              type="button"
                              className={`${styles.botaoNavegacao} ${styles.botaoDireito}`}
                              onClick={irParaProximo}
                              disabled={itemAtual === ultimoIndice}
                            >
                              &gt;
                            </button>
                          
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </Carousel>
          </section>
        </main>
      </div>

      <Footer />
    </>
  );
}
