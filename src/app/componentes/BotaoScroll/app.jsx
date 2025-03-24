import styles from "./botaoScroll.module.css";
import { useState, useEffect } from "react";

function RolarPCima() {
  const [mostrarBotao, setMostrarBotao] = useState(false);

  const rolarParaTopo = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const verificarScroll = () => {
      if (window.scrollY > 300) {
        setMostrarBotao(true);
      } else {
        setMostrarBotao(false);
      }
    };

    window.addEventListener("scroll", verificarScroll);
    return () => window.removeEventListener("scroll", verificarScroll);
  }, []);

  return (
    <button
      onClick={rolarParaTopo}
      className={`${styles.botaoScroll} ${mostrarBotao ? styles.visivel : ""}`}
    >
      <img className={styles.imagemBotao} src="/SetaPCima.png"></img>
    </button>
  );
}

export default RolarPCima;