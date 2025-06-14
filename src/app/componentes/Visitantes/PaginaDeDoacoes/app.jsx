import Header from "../HeaderVisitantes/app";
import Footer from "../Footer/app";
import styles from "./doe.module.css";

export default function ComoDoar() {
  return (
    <>
      <div className={styles.ajusteHeader}>
        <Header />
      </div>
      <div className={styles.ajusteElementosDaPagina}>
        <div className={styles.seccao}>
          <h1>
            Ficou interessado em realizar uma doação para a nossa causa? Saiba como:
          </h1>
          <p>
            <strong className={styles.strong}>Dica 1: </strong>É importante
            manter a calma nesses momentos e não fazer nada com as próprias
            mãos, a não ser que seja estritamente necessário, pois do contrário,
            em alguns casos, pode acabar resultando em agressões físicas ou até
            a morte, tanto para o animal quanto para você!
          </p>
          <p>
            <strong className={styles.strong}>Dica 2: </strong>Todo estado
            possui uma delegacia virtual no qual você possa acessar para
            denunciar, no anonimato ou não, diferentes tipos de situações,
            incluindo situações referentes a causa animal. Caso você seja de
            Mato Grosso do Sul,{" "}
            <a
              href="http://devir.pc.ms.gov.br/#/"
              target="_blank"
              className={styles.link}
            >
              clique aqui
            </a>{" "}
            para ser redirecionado diretamente para a delegacia virtual do
            estado.
          </p>
          <p>
            <strong className={styles.strong}>Dica 3: </strong> Você pode ligar
            para a polícia ambiental ou militar para essas situações também,
            especialmente se a ocorrência envolver animais silvestres &#40;
            animais que não são domesticos, que vivem na natureza &#41;.
          </p>
        </div>

        <div className={styles.seccao}>
          <h1>Quais situações são válidas para realizar uma denúncia?</h1>
          <p>
            <strong className={styles.strong}>1 - Cativeiro: </strong> nenhum
            animal deve ficar o tempo inteiro preso, seja em correntes ou
            gaiolas. Os animais devem ser soltos por ao menos 3 horas todos os
            dias e é recomendado o passeio com cães e gatos pelo menos 2 vezes
            na semana, com fins de reduzir o estresse do animal. Além disso,
            enquanto o animal estiver preso ele precisa ficar em um local com
            sombra, água e comida ao alcance, corrente com pelo menos 2 metros
            de comprimento para o animal se poder se mover e uma coleira frouxa,
            que permita você colocar dois dedos entre a mesma o pescoço do
            animal.
          </p>
          <p>
            <strong className={styles.strong}>2- Negligência: </strong>
            animais precisam de cuidados constantes, ainda mais se ficarem
            dentro de casa, pois não podem ou não tem habilidade para procurar
            água e comida sozinhos. É preciso fornecer a quantidade recomendada
            de ração de acordo com o porte do animal, água o tempo todo, um
            lugar coberto para não pegarem chuva ou sol, visitas ao veterinário
            &#40; quando necessário &#41; e passeios e banhos semanais.
          </p>
          <p>
            <strong className={styles.strong}>3- Agressões: </strong> apesar de
            ser normalizado por algumas pessoas, bater, espancar ou agredir o
            animal de qualquer forma, causando lesões ou dor, é sim um motivo
            para denúncia e pode fazer com que o dono perca a tutela do animal.
          </p>
          <p>
            <strong className={styles.strong}>4- Exploração: </strong> quaisquer
            tipos de exploração animal é motivo de denúncia. Neste caso, o termo
            &quot;exploração&quot; pode se encaixar em: explorar para fins
            lucrativos, não cuidando da saúde do animal e fazendo-o ir além de
            seus limites &#40; um exemplo é o que acontece com animais que são
            resgatados de círcos clandestinos &#41;. E explorar para fins
            próprios, como realizar tarefas pesadas ou atos sexuais.
          </p>
          <p>
            <strong className={styles.strong}>5- Envenenamento: </strong> dar de
            propósito substâncias tóxicas, álcool, drogas, cigarro e outros é
            mais do que um bom motivo para realizar uma denúncia, pois podem
            causar convunções, falha nos órgãos e até a morte de animais.
          </p>
          <p>
            <strong className={styles.strong}>6- Crueldade: </strong>{" "}
            comportamentos cruéis, como machucar, afogar, ou até mesmo forçar
            situações em que deixam o animal com medo, apenas por diversão,
            também é passível de denúncia.
          </p>
        </div>
      </div>
      <Footer/>
    </>
  );
}
