import Header from "../HeaderVisitantes/app";
import Footer from "../Footer/app";
import styles from "./saudeUnica.module.css";

export default function SaudeUnica() {
  return (
    <>
      <div className={styles.ajusteHeader}>
        <Header />
      </div>
      <div className={styles.ajusteElementosDaPagina}>
        <div className={styles.seccao}>
          <h1>
            O que é Saúde Única?
          </h1>
          <p>
            A Saúde Única é uma abordagem integrada e interdisciplinar proposta
            por organizações internacionais, como a Organização Mundial da
            Saúde &#40;OMS&#41;, a Organização Mundial da Saúde Animal &#40;OIE&#41; e a
            Organização das Nações Unidas para Alimentação e Agricultura &#40;FAO&#41;,
            que reconhece que a saúde humana, a saúde animal e a saúde ambiental
            estão interligadas. Ou seja, para garantir a saúde das pessoas, é
            necessário também cuidar dos animais e do meio ambiente.
          </p>
        </div>

        <div className={styles.seccao}>
          <h1>Em quais ocasiões a saúde humana, animal e ambiental se interligam?</h1>
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
      <Footer />
    </>
  );
}
