import styles from "./mainAdm.module.css";
import 'bootstrap/dist/css/bootstrap.css';
import HeaderAdms from "../HeaderAdms/app";

export default function HomeAdms() {

    var erro = false;

    if (erro) {
        return (
            <h1>Erro</h1>
        );
    }

    return (
        <div className={styles.mainAdms}>
            <HeaderAdms />
            <div className={styles.painel}>
                <div className={`${styles.card} ${styles.card1}`}>Card 1</div>
                <div className={`${styles.card} ${styles.card2}`}>Card 2</div>
                <div className={`${styles.card} ${styles.card3}`}>Card 3</div>
                <div className={`${styles.card} ${styles.card4}`}>Card 4</div>
            </div>
        </div>
    );
}