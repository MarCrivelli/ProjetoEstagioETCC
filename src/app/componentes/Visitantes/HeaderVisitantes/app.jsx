import styles from "./headerVisitantes.module.css"; // Importando o CSS Module
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className={styles.headerVisitantes}>
      <Link className={styles.linkLogo} to="/" title="Instituto Esperança">
        <img
          src="logos/logoBranca.png"
          className={styles.logo}
          alt="Logo do Instituto Esperança"
        />
      </Link>

      <nav className={styles.nav}>
        <ul className={styles.menu} role="menu">
          <li>
            <Link to="/quero_adotar" className={styles.linkSubPaginas}>
                Quero adotar!
            </Link>
          </li>
          <li>
            <Link to="/como_doar" className={styles.linkSubPaginas}>
                Como doar?
            </Link>
          </li>
          <li>
            <Link to="/denuncie" className={styles.linkSubPaginas}>
                Denuncie
            </Link>
          </li>
          <li>
            <Link to="/saude_unica" className={styles.linkSubPaginas}>
                Saúde única
            </Link>
          </li>
          <li>
            <Link
              className={styles.linkUsuario}
              to="/autenticar"
              title="usuário"
            >
              <img
                src="/usuarioTeste.jpeg"
                alt="Botão que leva à página de autenticação"
                className={styles.iconeUsuario}
              />
            </Link>
          </li>
          <li>
            <button className={styles.btnMobile}>
              <span
                className={styles.hamburguerVisitantes}
              ></span>
            </button>
          </li>
        </ul>
      </nav>
    </header>
  );
}
