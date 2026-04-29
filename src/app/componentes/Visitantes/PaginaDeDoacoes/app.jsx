import Header from "../HeaderVisitantes/app";
import Footer from "../Footer/app";
import styles from "./doe.module.css";

export default function QueroAdotar() {
  return (
    <>
      <main>
        <section
          className={`${styles.secao} ${styles.parallax} ${styles.parallax1}`}
        >
          <Header />
          <h1>Tem interesse em fazer uma doação monetária?</h1>
        </section>

        <section
          className={`${styles.secao} ${styles.conteudo} ${styles.conteudo1}`}
        >
          <div className={styles.painel}>
            <h1>Escaneie o QR-Code abaixo.</h1>
            <h2>
              Ao escanear, você poderá fazer uma doação para o número PIX do
              Instituto Esperança. Qualquer valor é bem-vindo!
            </h2>
            <img
              src="/QRCodeDoacao/QRCodeTeste.png"
            ></img>

            <input type="string"/>
          </div>
        </section>

        <section
          className={`${styles.secao} ${styles.parallax} ${styles.parallax2}`}
        >
          <h1>Gostaria de doar itens para o nosso instituto?</h1>
        </section>

        <section
          className={`${styles.secao} ${styles.conteudo} ${styles.conteudo2}`}
        >
          <div className={styles.painel}>
              <h1>
                Você também pode mandar suprimentos ou equipamentos para nós!
              </h1>
              <h2>Itens que nós aceitamos:</h2>
            <ul>
              <li>Ração &#40;para gatos ou cachorros&#41;;</li>
              <li>Cone veterinário;</li>
              <li>Coleira;</li>
              <li>
                Caminha de cachorro ou cobertores &#40;pode ser usado&#41;.
              </li>
            </ul>
            <p>
              <strong className={styles.strong}>Importante:</strong> A ração
              precisa estar totalmente fechada e na embalagem original, pois do
              contrário não aceitaremos. Além disso, não doe caminhas ou
              cobertores usados de seu pet caso o mesmo esteja com doenças ou
              infecções contagiosas, como sarna ou cinomose, por exemplo.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
