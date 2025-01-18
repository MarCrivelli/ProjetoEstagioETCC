import styles from "./postagem.module.css";
import HeaderAdms from "../HeaderAdms/app";

export default function ProgramarPostagem() {

    return (
        <div>
            <HeaderAdms />
            <div className={styles.fundoPostagem}>
                <div className={styles.painel}></div>
            </div>
        </div>
    );
}