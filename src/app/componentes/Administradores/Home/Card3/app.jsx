import styles from "./card3.module.css";
import { Carousel } from "react-responsive-carousel";
import { useRef } from "react";

export default function Card3() {
  //================ Trecho responsável por fazer a div "inserirDocumentos" funcionar como um input ================//
  const ReferenciaDoInputFile = useRef(null);

  const divComReferenciaDoInput = () => {
    ReferenciaDoInputFile.current?.click();
  };

  // <div
  //         className={styles.inserirDocumentos}
  //         onClick={divComReferenciaDoInput}
  //       >
  //         <input type="file" ref={ReferenciaDoInputFile} style={{ display: "none" }} />

  return (
    <Carousel className={styles.carrosselDocumentos}>
      <div className={styles.slideCarrossel}>
        <div className={styles.documentos}>
          <div
            className={`${styles.estilizacaoDocumento} ${styles.estilizacaoAddDocumento}`}
          ></div>

          <div
            className={styles.estilizacaoDocumento}
            onClick={divComReferenciaDoInput}
          ></div>
        </div>
      </div>

      <div className={styles.slideCarrossel}></div>
    </Carousel>
  );
}
