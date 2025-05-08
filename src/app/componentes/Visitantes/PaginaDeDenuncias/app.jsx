import Header from "../HeaderVisitantes/app";
import styles from "./denuncie.module.css";

export default function Denuncie() {
  return (
    <div>
      <div className={styles.ajusteHeader}>
        <Header />
      </div>
      <div className={styles.ajusteElementosDaPagina}>
        <div className={styles.seccao}>
          <h1>
            Presenciou alguma situação e quer denunciá-la para as autoridades
            locais? Saiba como:
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
            especialmente se a ocorrência envolver animais silvestres (animais que não são domesticos, que vivem na natureza).
          </p>
        </div>
      </div>
    </div>
  );
}
