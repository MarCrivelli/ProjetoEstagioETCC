import styles from "./home.module.css";
import { Link } from "react-router-dom";
import { Carousel } from "react-responsive-carousel";
import Header from "../HeaderVisitantes/app";
import BotaoPagInicialVisitantes from "../BotaoPagInicialVisitantes/app";

export default function HomeVisitantes() {
  return (
    <div className={styles.homeVisitantes}>
      <BotaoPagInicialVisitantes />

      <div className={styles.imagemDeFundo}>
        <Header />
        <div className={styles.logoPreLogin}>
          <img src="logos/logoBranca.png" width={800} height={400} />
          <div className={styles.textoLogoPreLogin}>
            <h1>Instituto Esperança</h1>
            <p>A voz dos animais</p>
          </div>
        </div>
      </div>

      <div className={styles.alinharCards}>
        <div className={`${styles.card} ${styles.card1}`}>
          <img src="/mainVisitantes/cachorroTriste.png"></img>
          <div className={styles.descricaoCard}>
            <h1>Precisa de ajuda para realizar uma denúncia?</h1>
            <p>
              É importante zelarmos pela saúde dos animais, mesmo que não sejam
              os nossos. Caso você tenha presenciado alguma situação que precise
              de uma atenção das autoridades responsáveis, clique no botão
              abaixo:
            </p>
          </div>
          <Link className={styles.linkBotaoVerMais}>
            <button className={styles.botaoVerMais}>ver mais</button>
          </Link>
        </div>

        <div className={`${styles.card} ${styles.card2}`}>
          <img src="/mainVisitantes/dinheiro.png"></img>
          <div className={styles.descricaoCard}>
            <h1>Quer saber como contribuir para a nossa causa?</h1>
            <p>
              É importante zelarmos pela saúde dos animais, mesmo que não sejam
              os nossos. Caso você tenha presenciado alguma situação que precise
              de uma atenção das autoridades responsáveis, clique no botão
              abaixo:
            </p>
          </div>
          <Link className={styles.linkBotaoVerMais}>
            <button className={styles.botaoVerMais}>ver mais</button>
          </Link>
        </div>

        <div className={`${styles.card} ${styles.card3}`}>
          <img src="/mainVisitantes/adocao.png"></img>
          <div className={styles.descricaoCard}>
            <h1>Tem interesse em adotar um animalzinho?</h1>
            <p>
              É importante zelarmos pela saúde dos animais, mesmo que não sejam
              os nossos. Caso você tenha presenciado alguma situação que precise
              de uma atenção das autoridades responsáveis, clique no botão
              abaixo:
            </p>
          </div>
          <Link className={styles.linkBotaoVerMais}>
            <button className={styles.botaoVerMais}>ver mais</button>
          </Link>
        </div>

        <div className={`${styles.card} ${styles.card4}`}>
          <img src="/mainVisitantes/colaborador.png"></img>
          <div className={styles.descricaoCard}>
            <h1>Gostaria de se juntar a nossa equipe de voluntários?</h1>
            <p>
              É importante zelarmos pela saúde dos animais, mesmo que não sejam
              os nossos. Caso você tenha presenciado alguma situação que precise
              de uma atenção das autoridades responsáveis, clique no botão
              abaixo:
            </p>
          </div>
          <Link className={styles.linkBotaoVerMais}>
            <button className={styles.botaoVerMais}>ver mais</button>
          </Link>
        </div>
      </div>

      <div className={styles.fundoAmarelo}>
        <div className={styles.alinharTituloECarrossel}>
          <h1>Confira alguns de nossos doadores recentes</h1>
          <Carousel className={styles.carrossel}>

            <div className={styles.slideCarrossel}>
              <div className={styles.containerImagemCarrossel}>
                <img
                  className={styles.imagemCarrossel}
                  src="/usuarioTeste.jpeg"
                ></img>
              </div>
              <div className={styles.legendaCarrossel}></div>
            </div>

            <div className={styles.slideCarrossel}>
              <div className={styles.containerImagemCarrossel}>
                <img
                  className={styles.imagemCarrossel}
                  src="/mainVisitantes/testeAnimal.jpg"
                ></img>
              </div>
              <div className={styles.legendaCarrossel}></div>
            </div>
            
          </Carousel>
        </div>
      </div>

      {/* <Carousel className={styles.carrossel}>
            <div className={styles.slideCarrossel}>
              <img className={styles.imagemCarrossel}></img>
              <div className={styles.legendaCarrossel}></div>
            </div>
          </Carousel> */}
    </div>
  );
}
