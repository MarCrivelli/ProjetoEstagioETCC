import styles from "./home.module.css";
import Cabecalho from "../../HeaderVisitantes/app";
import BotaoParaPaginaDeAdms from "../../BotaoPagInicialVisitantes/app";
import CarrosselDoador from "../CarrosselDoadores/app";
import CarrosselAnimais from "../CarrosselAnimais/app";

import { FaPaw, FaHandHoldingHeart } from "react-icons/fa";
import { Link } from "react-router-dom";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { useState, useEffect } from "react";

export default function PaginaInicialVisitantes() {
  const [carrosselAtivo, setCarrosselAtivo] = useState("doadores");
  const [indiceAnimalAtual, setIndiceAnimalAtual] = useState(0);
  const [mostrarAntesDepois, setMostrarAntesDepois] = useState(true);
  const titulos = {
    doadores: "Doadores recentes",
    animais: "Animais Resgatados pelo Instituto Esperança",
  };

  const [ehMobile, setEhMobile] = useState(false);

  useEffect(() => {
    const lidarComRedimensionamento = () => {
      setEhMobile(window.innerWidth <= 768);
    };

    lidarComRedimensionamento();
    window.addEventListener("resize", lidarComRedimensionamento);

    return () => {
      window.removeEventListener("resize", lidarComRedimensionamento);
    };
  }, []);

  const doadores = [
    {
      id: 1,
      nome: "João Silva",
      imagem: "/usuarioTeste.jpeg",
      texto:
        "Apoio mensalmente o Instituto Esperança porque acredito na causa animal.",
    },
    {
      id: 2,
      nome: "Marco",
      imagem: "/usuarioTeste.jpeg",
      texto:
        "Apoio mensalmente o Instituto Esperança porque acredito na causa animal.",
    },
  ];

  const animais = [
    {
      id: 1,
      nome: "Rex",
      antes: "/adobeTeste.jpg",
      depois: "/mainVisitantes/testeAnimal.jpg",
      descricaoAntes:
        "Encontrado abandonado e desnutrido em um terreno baldio.",
      descricaoDepois:
        "Após 3 meses de cuidados, foi adotado por uma família amorosa.",
    },
    {
      id: 2,
      nome: "Lua",
      antes: "/animal1.jpg",
      depois: "/mainVisitantes/testeVaca.jpg",
      descricaoAntes:
        "Encontrado abandonado e desnutrido em um terreno baldio.",
      descricaoDepois:
        "Após 3 meses de cuidados, foi adotado por uma família amorosa.",
    },
  ];

  return (
    <div className={styles.paginaInicialVisitantes}>
      <BotaoParaPaginaDeAdms />

      <div className={styles.imagemDeFundo}>
        <Cabecalho />
        <div className={styles.logoPreLogin}>
          <img
            src="logos/logoBranca.png"
            width={800}
            height={400}
            alt="Logo Instituto Esperança"
          />
          <div className={styles.textoLogoPreLogin}>
            <h1>Instituto Esperança</h1>
            <p>A voz dos animais</p>
          </div>
        </div>
      </div>

      <div className={styles.alinharCards}>
        <div className={`${styles.card} ${styles.card1}`}>
          <img src="/mainVisitantes/cachorroTriste.png" alt="Cachorro triste" />
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
          <img src="/mainVisitantes/dinheiro.png" alt="Dinheiro" />
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
          <img src="/mainVisitantes/adocao.png" alt="Adoção" />
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
          <img src="/mainVisitantes/colaborador.png" alt="Colaborador" />
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

      <div className={styles.secaoCarrossel}>
        <div className={styles.containerCarrossel}>
          <div className={styles.botoesCarrossel}>
            <button
              className={`${styles.botaoCarrossel} ${
                carrosselAtivo === "doadores" ? styles.ativo : ""
              }`}
              onClick={() => setCarrosselAtivo("doadores")}
              aria-label="Doadores"
            >
              <div className={styles.iconeWrapper}>
                <FaHandHoldingHeart className={styles.iconeCarrossel} />
              </div>
            </button>
            <button
              className={`${styles.botaoCarrossel} ${
                carrosselAtivo === "animais" ? styles.ativo : ""
              }`}
              onClick={() => setCarrosselAtivo("animais")}
              aria-label="Nossos Animais"
            >
              <div className={styles.iconeWrapper}>
                <FaPaw className={styles.iconeCarrossel} />
              </div>
            </button>
          </div>

          <div className={styles.conteudoCarrossel}>
            <h1 className={styles.tituloCarrossel}>
              {titulos[carrosselAtivo]}
            </h1>
            {carrosselAtivo === "doadores" && (
              <CarrosselDoador doadores={doadores} ehMobile={ehMobile} />
            )}
            {carrosselAtivo === "animais" && (
              <CarrosselAnimais
                animais={animais}
                ehMobile={ehMobile}
                indiceAnimalAtual={indiceAnimalAtual}
                setIndiceAnimalAtual={setIndiceAnimalAtual}
              />
            )}
          </div>
        </div>
      </div>
      <div className={styles.infoInstituto}>
        <div className={styles.sobreNos}>
          <h1>Sobre nós</h1>
          <p>
            O instituto Esperança é uma instituição sem fins lucrativos que atua
            diretamente na causa animal com o objetivo principal de
            conscientizar as pessoas quanto ao bem estar animal, maus tratos e
            adoção responsável. Além disso desenvolvemos trabalhos voltados para
            a tríade da Saúde Única (ser humano, meio ambiente e animais).
            Contamos com o apoio de uma casa de passagem, que de acordo com a
            disponibilidade de vaga acolhe animais em situação de
            vulnerabilidade, onde recebem atendimento médico veterinário,
            tratamento terapêutico e ressocialização, para assim,
            posteriormente, estarem disponíveis para adoção responsável. Além
            disso, contamos com o projeto Abrigo comunitário , onde damos
            assistências para aquelas pessoas que decidiram zelar por algum
            animalzinho na comunidade em que vive.
          </p>
        </div>
        <div className={styles.redesSociais}>
          <h1>Nos siga nas redes sociais!</h1>
          <div className={styles.alinharRedesSociais}>
            <a href="https://www.instagram.com/esperancaavozdosanimais/" target="_blank">
              <img src="/mainVisitantes/instagram.png"></img>
            </a>
            <a href="https://www.facebook.com/esperanca.a.voz.dos.animais" target="_blank">
              <img src="/mainVisitantes/facebook.png"></img>
            </a>
          </div>
        </div>
        <div className={styles.contato}>
          <h1>Contate-nos</h1>
          <div className={styles.alinharInfoContato}>
            <strong>Telefone:</strong>
            <p>+55 67 99904-2349</p>
          </div>
          <div className={styles.alinharInfoContato}>
            <strong>Cidade que atuamos:</strong>
            <p>Taquarussu (MS)</p>
          </div>
          <div className={styles.alinharInfoContato}>
            <strong>Localização:</strong>
            <p>Rua José Martins dos Santos, nº 150</p>
          </div>
        </div>
      </div>
    </div>
  );
}
