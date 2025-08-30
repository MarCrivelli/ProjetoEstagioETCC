import Header from "../HeaderVisitantes/app";
import Footer from "../Footer/app";
import styles from "./doe.module.css";

export default function ComoDoar() {
  return (
    <div className={styles.fundoDaPagina}>
      <Header />
      <div className={styles.ajusteElementosDaPagina}>
        <div className={styles.seccao}>
          <h1>
            Ficou interessado em realizar uma doação para a nossa causa? Saiba
            como:
          </h1>
          <p>
            <strong className={styles.strong}>1- </strong>Você pode fazer uma
            doação em dinheiro escaneando o QR code abaixo. Qualquer quantia é
            bem vinda, doe o que puder.
          </p>
          <p>
            <strong className={styles.strong}>2- </strong> Você pode mandar
            suprimentos ou equipamentos para o <span>nosso Instituto,</span>{" "}
            onde o avaliaremos e utilizaremos para o cuidado de nossos animais.
            Itens que nós aceitamos:
            <ul className={styles.lista}>
              <li>Ração &#40;para gatos ou cachorros&#41;;</li>
              <li>Cone veterinário;</li>
              <li>Coleira;</li>
              <li>
                Caminha de cachorro ou cobertores &#40;pode ser usado&#41;.
              </li>
            </ul>
            <strong className={styles.strong}>Importante!</strong> A ração
            precisa estar totalmente fechada e na embalagem original, pois do
            contrário não aceitaremos. Além disso, não doe caminhas ou cobertores
            usados de seu pet caso o mesmo esteja com doenças ou infecções
            contagiosas, como sarna ou cinomose, por exemplo.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
