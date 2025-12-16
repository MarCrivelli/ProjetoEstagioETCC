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
          <h1>O que é Saúde Única?</h1>
          <p>
            A Saúde Única é uma abordagem integrada e interdisciplinar proposta
            por organizações internacionais, como a Organização Mundial da Saúde
            &#40;OMS&#41;, a Organização Mundial da Saúde Animal &#40;OIE&#41; e
            a Organização das Nações Unidas para Alimentação e Agricultura
            &#40;FAO&#41;, que reconhece que a saúde humana, a saúde animal e a
            saúde ambiental estão interligadas. Ou seja, para garantir a saúde
            das pessoas, é necessário também cuidar dos animais e do meio
            ambiente.
          </p>
        </div>

        <div className={styles.seccao}>
          <h1>
            Em quais ocasiões a saúde humana, animal e ambiental se interligam?
          </h1>
          <p>
            <strong className={styles.strong}>
              1 - Propagação de doenças infecciosas:{" "}
            </strong>{" "}
            algumas doenças infecciosas como a Zoonose, Raiva ou Leptospirose,
            por exemplo, não se limitam apenas a animais ou humanos, podendo ser
            transmitida de um para o outro, sendo extremamente mortais caso não
            haja um tratamento imediato.
          </p>
          <p>
            <strong className={styles.strong}>2- Segurança alimentar: </strong>
            como aprendemos desde cedo na escola, a saúde do ambiente em que
            vivemos impacta diretamente na nossa saúde, bem como a dos animais.
            Comidas de procedência duvidosa ou preparada sem higiene pode fazer
            a nós e aos animais adoecer e até a ajudar a propagar outros tipos
            de doenças, como a Doença da Vaca Louca, que matou várias pessoas
            devido a falta de responsabilidade e conhecimento quanto a práticas
            ambientais duvidosas e consequentemente matando diversas vacas,
            muitas apenas pelo medo da contaminação.
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
