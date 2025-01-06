import styles from "./mainAdm.module.css";
import 'bootstrap/dist/css/bootstrap.css';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';
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
                <div className={`${styles.card} ${styles.card1}`}>
                </div>
                <div className={`${styles.card} ${styles.card2}`}>
                    <div className={styles.divLembrete}>
                        <h1>Lembrete de vacinação</h1>
                        <p>Há <span className={styles.sublinhadoVacinacao}>999</span> animais a serem vacinados</p>
                    </div>
                </div>
                <div className={`${styles.card} ${styles.card3}`}>
                    <Carousel className={styles.carrossel}>
                        <div className={styles.blocoCarrossel}>
                            <h1>olá</h1>
                        </div>
                        <div className={styles.blocoCarrossel}>
                            <h1>olá</h1>
                        </div>
                        <div className={styles.blocoCarrossel}>
                            <h1>olá</h1>
                        </div>
                    </Carousel>
                </div>
                <div className={`${styles.card} ${styles.card4}`}>
                    <img
                      src="/usuario.png"
                      alt="Botão que leva à página de autenticação"
                      className={styles.iconeAvatar}
                    />
                    <h1 className={styles.nomeUsuario}>Nome Qualquer de Usuário</h1>
                    <div className={styles.infoUsuario}>
                        <p><strong>Última alteração:</strong> há 999 dias</p>
                        <p><strong>Nível de acesso:</strong> administrador</p>
                    </div>
                    <button className={`${styles.padraoBotao} ${styles.botaoEscuro}`}>
                        Funções de administrador
                    </button>
                    <button className={`${styles.padraoBotao} ${styles.botaoClaro}`}></button>
                </div>
            </div>
        </div>
    );
}
