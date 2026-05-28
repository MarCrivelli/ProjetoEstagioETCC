import { useState } from "react";
import styles from "./card3.module.css";

export default function Card3() {

  const [paginaAtual, setPaginaAtual] = useState(1);
  const [maxDocumentosPorPag, setMaxDocumentosPorPag] = useState(10);
  
  return (
    <div className={styles.desenvolvimento}>
      
    </div>
  );
}
