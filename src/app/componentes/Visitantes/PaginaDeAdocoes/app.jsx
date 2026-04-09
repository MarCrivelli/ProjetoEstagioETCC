import Header from "../HeaderVisitantes/app";
import Footer from "../Footer/app";
import { Carousel } from "react-responsive-carousel";
import carregarAnimais from "../../CarregarAnimais/carregarAnimais";
import styles from "./adote.module.css";

export default function QueroAdotar() {
  const { animaisFiltrados, carregando, erro } = carregarAnimais({
    // removerAnimaisQuePossuam: {
    //   statusAdocao: "adotado",
    // },
  });

  if (carregando) return <p>Carregando...</p>;
  if (erro) return <p>Erro: {erro}</p>;

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
              showThumbs={false}
              showStatus={false}
              infiniteLoop={true}
              swipeable={true}
              emulateTouch={true}
              preventMovementUntilSwipeScrollTolerance={true}
              swipeScrollTolerance={40}
            >
              {animaisFiltrados.map((animal) => (
                <div className={styles.painelCarrossel} key={animal.id}>
                  <div className={styles.cardAnimal}>
                    <img
                      src={`http://localhost:3003/uploads/${animal.imagem}`}
                      alt={animal.nome}
                    />
                    <h1>{animal.nome}</h1>
                  </div>
                </div>
              ))}
            </Carousel>
          </section>

          <section
            className={`${styles.modulo} ${styles.parallax} ${styles.parallax2}`}
          >
            <h1>Como adoto um animal?</h1>
          </section>

          <section className={`${styles.modulo} ${styles.conteudo}`}>
            <div className={styles.instrucoes}>
              <p>
                <strong className={styles.strong}>
                  Avaliação comportamental:{" "}
                </strong>
                Para nós, os pets são mais do que apenas animais: são membros da
                família. Um critério muito importante na hora da avaliação é
                como o futuro &quot;pai de pet&quot; se comporta com o animal
                que deseja anotar, desde a primeira interação até a fase de
                adaptação do animal ao novo ambiente.
              </p>
              <p>
                <strong className={styles.strong}>
                  Registro de denúncia:{" "}
                </strong>
                Ficamos sempre atentos a denúncias de possíveis maus-tratos,
                podendo até impedir que algumas pessoas adotem caso exista algum
                histórico de agressividade ou abandono. Em casos onde o animal
                foi adotado e passou a sofrer violência, os próprios membros do
                Instituto podem chamar a polícia e participar do resgate do
                animal. Seja responsável!
              </p>
              <p>
                <strong className={styles.strong}>Ambiente adequado: </strong>{" "}
                Para adotar um animal, é preciso ter um ambiente adequado para
                recebê-lo, pois do contrário ele pode acabar adoecendo e ou
                ficando triste, mesmo que o dono cuide muito bem. Quintais ou
                gaiolas grandes são critérios definitivos na nossa avaliação e
                um ambiente limpo deve ser uma prioridade, sendo esses critérios
                decisivos para uma rejeição de adoção.
              </p>
              <p>
                <strong className={styles.strong}>Rotina adequada: </strong>
                Os pets precisam de atenção e cuidados diários para se manterem
                felizes e saudáveis. Além disso, é necessário tempo para cuidar
                dos animais, passeando, dando banho, dando comida e tratando-o,
                caso o mesmo possua alguma doença ou deficiência. Pessoas que
                ficam longos períodos longe de casa não são desejáveis.
              </p>
              <p>
                <strong className={styles.strong}>Condição financeira: </strong>
                Cuidar de pet custa dinheiro, pois é necessário alimentá-lo com
                uma ração adequada, comprar uma coleira e uma guia para passear,
                entender que esse animais pode e vai precisar fazer consultas no
                veterinário ocasionalmente, etc. Portanto, é necessário uma
                condição mínima para garantir que o animal tenha uma boa
                convivência e saúde.
              </p>
              <p>
                Vale ressaltar que podemos fazer visitas surpresa na casa do
                novo pai de pet, além de, caso necessário, buscar informações
                com a vizinhança. Caso seja determinado que o animal não têm
                condições de ficar no local, podemos trazer o animal de volta
                para o Instituto. Recomendamos que não minta na hora da
                avaliação.
              </p>
            </div>
          </section>

          <section
            className={`${styles.modulo} ${styles.parallax} ${styles.parallax3}`}
          >
            <h1>Quais os critérios?</h1>
          </section>
          <section className={`${styles.modulo} ${styles.conteudo}`}>
            <div className={styles.instrucoes}>
              <p>
                <strong className={styles.strong}>
                  Avaliação comportamental:{" "}
                </strong>
                Para nós, os pets são mais do que apenas animais: são membros da
                família. Um critério muito importante na hora da avaliação é
                como o futuro &quot;pai de pet&quot; se comporta com o animal
                que deseja anotar, desde a primeira interação até a fase de
                adaptação do animal ao novo ambiente.
              </p>
              <p>
                <strong className={styles.strong}>
                  Registro de denúncia:{" "}
                </strong>
                Ficamos sempre atentos a denúncias de possíveis maus-tratos,
                podendo até impedir que algumas pessoas adotem caso exista algum
                histórico de agressividade ou abandono. Em casos onde o animal
                foi adotado e passou a sofrer violência, os próprios membros do
                Instituto podem chamar a polícia e participar do resgate do
                animal. Seja responsável!
              </p>
              <p>
                <strong className={styles.strong}>Ambiente adequado: </strong>{" "}
                Para adotar um animal, é preciso ter um ambiente adequado para
                recebê-lo, pois do contrário ele pode acabar adoecendo e ou
                ficando triste, mesmo que o dono cuide muito bem. Quintais ou
                gaiolas grandes são critérios definitivos na nossa avaliação e
                um ambiente limpo deve ser uma prioridade, sendo esses critérios
                decisivos para uma rejeição de adoção.
              </p>
              <p>
                <strong className={styles.strong}>Rotina adequada: </strong>
                Os pets precisam de atenção e cuidados diários para se manterem
                felizes e saudáveis. Além disso, é necessário tempo para cuidar
                dos animais, passeando, dando banho, dando comida e tratando-o,
                caso o mesmo possua alguma doença ou deficiência. Pessoas que
                ficam longos períodos longe de casa não são desejáveis.
              </p>
              <p>
                <strong className={styles.strong}>Condição financeira: </strong>
                Cuidar de pet custa dinheiro, pois é necessário alimentá-lo com
                uma ração adequada, comprar uma coleira e uma guia para passear,
                entender que esse animais pode e vai precisar fazer consultas no
                veterinário ocasionalmente, etc. Portanto, é necessário uma
                condição mínima para garantir que o animal tenha uma boa
                convivência e saúde.
              </p>
              <p>
                Vale ressaltar que podemos fazer visitas surpresa na casa do
                novo pai de pet, além de, caso necessário, buscar informações
                com a vizinhança. Caso seja determinado que o animal não têm
                condições de ficar no local, podemos trazer o animal de volta
                para o Instituto. Recomendamos que não minta na hora da
                avaliação.
              </p>
            </div>
          </section>
        </main>
      </div>
      <Footer />
    </>
  );
}
