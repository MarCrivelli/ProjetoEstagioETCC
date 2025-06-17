import styles from "./card2.module.css";

export default function Card2() {
  return (
    <div className={styles.card2}>
      <h1 className={styles.tituloLembrete}>Lembrete de vacinação</h1>
      <div className={styles.containerLembrete}>
        <p className={styles.textoLembrete}>
          Há <span className={styles.sublinhadoVacinacao}>999</span> animais a
          serem vacinados
        </p>
      </div>
    </div>
  );
}
