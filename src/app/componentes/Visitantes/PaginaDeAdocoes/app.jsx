import { useState, useEffect } from "react";
import Header from "../HeaderVisitantes/app";
import Footer from "../Footer/app";
import carregarAnimais from "../../GerenciarDadosAnimais/CarregarAnimais/carregarAnimais";
import styles from "./adote.module.css";
import opcoes from "/src/app/componentes/Administradores/OpcoesDeSelecao/opcoes";
import { Carousel } from "react-responsive-carousel";

export default function QueroAdotar() {
  const [centerSlidePercentage, setCenterSlidePercentage] = useState(26);

  useEffect(() => {
    const atualizarCenterSlide = () => {
      const largura = window.innerWidth;

      if (largura <= 480) {
        setCenterSlidePercentage(80);
      } else if (largura <= 768) {
        setCenterSlidePercentage(60);
      } else if (largura <= 1024) {
        setCenterSlidePercentage(40);
      } else if (largura <= 1400) {
        setCenterSlidePercentage(37);
      } else {
        setCenterSlidePercentage(26);
      }
    };

    atualizarCenterSlide();
    window.addEventListener("resize", atualizarCenterSlide);

    return () => {
      window.removeEventListener("resize", atualizarCenterSlide);
    };
  }, []);

  const { animaisFiltrados, carregando, erro, recarregarAnimais } =
    carregarAnimais({
      removerAnimaisQuePossuam: {
        statusAdocao: "adotado",
        descricaoEntrada: "__vazio__",
      },
    });

  const [itemAtual, setItemAtual] = useState(0);
  const [animalAbertoId, setAnimalAbertoId] = useState(null);
  if (erro) return <p>Erro: {erro}</p>;

  const ultimoIndice = animaisFiltrados.length - 1;

  const irParaProximo = (e) => {
    e.preventDefault();
    e.stopPropagation();

    setAnimalAbertoId(null);
    setItemAtual((valorAtual) =>
      valorAtual < ultimoIndice ? valorAtual + 1 : valorAtual,
    );
  };

  const irParaAnterior = (e) => {
    e.preventDefault();
    e.stopPropagation();

    setAnimalAbertoId(null);
    setItemAtual((valorAtual) =>
      valorAtual > 0 ? valorAtual - 1 : valorAtual,
    );
  };

  const poucosAnimais = animaisFiltrados.length <= 3;
  const isMobile = window.innerWidth <= 768;

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

          <section className={styles.modulo}>
            <Carousel
              className={`${styles.carrossel} ${
                poucosAnimais && !isMobile ? styles.poucos : ""
              }`}
              selectedItem={itemAtual}
              onChange={(indice) => {
                setItemAtual(indice);
                setAnimalAbertoId(null);
              }}
              showThumbs={false}
              showStatus={false}
              showIndicators={false}
              showArrows={false}
              infiniteLoop={false}
              swipeable={isMobile || !poucosAnimais}
              emulateTouch={isMobile || !poucosAnimais}
              autoPlay={true}
              centerMode={true}
              centerSlidePercentage={
                poucosAnimais && isMobile ? 80 : centerSlidePercentage
              }
              transitionTime={800}
              interval={4000}
            >
              {animaisFiltrados.map((animal, indice) => {
                const emFoco = indice === itemAtual;
                const mostrandoDescricao = animal.id === animalAbertoId;

                return (
                  <div key={animal.id} className={styles.itemSlide}>
                    <div
                      className={`${styles.cardAnimal} ${
                        emFoco ? styles.cardAtivo : styles.cardInativo
                      }`}
                    >
                      {!mostrandoDescricao ? (
                        <>
                          <img
                            src={`http://localhost:3003/uploads/${animal.imagemEntrada}`}
                            alt={animal.nome}
                            draggable={false}
                            loading="lazy"
                          />

                          <h1>{animal.nome}</h1>

                          <p>
                            <strong>Idade: </strong>
                            {opcoes.vincularLabel(
                              animal.idade?.toString(),
                              "idadeAnimais",
                            )}
                          </p>

                          <p>
                            <strong>Sexo: </strong>
                            {opcoes.vincularLabel(animal.sexo, "sexoDoAnimal")}
                          </p>

                          <p>
                            <strong>Status de castração: </strong>
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
                              setAnimalAbertoId(animal.id);
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
                        </>
                      ) : (
                        <div className={styles.descricaoAnimal}>
                          <h1 className={styles.nomeAnimal}>{animal.nome}</h1>

                          <p>{animal.descricaoEntrada}</p>

                          <button
                            type="button"
                            className={styles.botaoVoltar}
                            onMouseDown={(e) => e.stopPropagation()}
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setAnimalAbertoId(null);
                            }}
                          >
                            Voltar
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </Carousel>
          </section>

          <section
            className={`${styles.modulo} ${styles.parallax} ${styles.parallax2}`}
          >
            <h1>Critérios de adoção</h1>
          </section>

          <section className={`${styles.modulo} ${styles.conteudo}`}>
            <div className={styles.bloco}>
              <h1>Avaliação Comportamental</h1>
              <p></p>
            </div>
            <div className={styles.bloco}>
              <h1>Ficha limpa</h1>
              <p></p>
            </div>
            <div className={styles.bloco}>
              <h1>Ambiente Adequado</h1>
              <p></p>
            </div>
            <div className={styles.bloco}>
              <h1>Rotina Adequada</h1>
              <p></p>
            </div>
            <div className={styles.bloco}>
              <h1>Financeiro</h1>
              <p></p>
            </div>
          </section>

          <section
            className={`${styles.modulo} ${styles.parallax} ${styles.parallax3}`}
          >
            <h1>
              Quais são as circunstâncias não favoráveis para se ter um pet?
            </h1>
          </section>

          <section className={`${styles.modulo} ${styles.conteudo}`}>
            <div className={styles.bloco}>
              <h1>Avaliação Comportamental</h1>
              <p></p>
            </div>
            <div className={styles.bloco}>
              <h1>Ficha limpa</h1>
              <p></p>
            </div>
            <div className={styles.bloco}>
              <h1>Ambiente Adequado</h1>
              <p></p>
            </div>
            <div className={styles.bloco}>
              <h1>Rotina Adequada</h1>
              <p></p>
            </div>
            <div className={styles.bloco}>
              <h1>Financeiro</h1>
              <p></p>
            </div>
          </section>
        </main>
      </div>

      <Footer />
    </>
  );
}
