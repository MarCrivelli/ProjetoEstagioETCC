import styles from "./headerAdm.module.css";
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function HeaderAdms() {
  const [isActive, setIsActive] = useState(false);

  const toggleMenu = (event) => {
    if (event.type === 'touchstart') {
      event.preventDefault();
    }
    setIsActive(!isActive);
  };

  useEffect(() => {
    const button = document.getElementById('btnMobile');
    button.addEventListener('touchstart', toggleMenu, { passive: false });

    return () => {
      button.removeEventListener('touchstart', toggleMenu);
    };
  }, [isActive]);

  return (
    <div className={styles.fundoHeader}>
      <header className={styles.headerAdm}>
        <div className={styles.containerLogoAdm}>
          <Link id="logo" to="/" title="Instituto Esperança">
            <img src="logos/logoPreta.png" className={styles.logoHeader} alt="Instituto Esperança" />
          </Link>
          <div className={styles.textoHeader}>
            <h1>Instituto Esperança</h1>
            <p>A voz dos animais</p>
          </div>
        </div>
        <nav 
          id="nav"
          className={isActive ? styles.active : ''}>
          <button 
            id="btnMobile"
            aria-expanded={isActive}
            aria-label={isActive ? 'Fechar Menu' : 'Abrir Menu'}
            onClick={toggleMenu}
            className={styles.btnMobile}>
            <span className={styles.hamburguer}></span>
          </button>
          <ul className={styles.menu} role="menu">
            <li className={styles.itemLista}>
              <Link to="/quero_adotar" className={styles.linkHeaderAdm}>
                <div className={styles.alinharLinks}>
                  <img className={styles.iconeLink} src="headerAdms/postagem.png" alt="Programar postagem" />
                  <h1 className={styles.textoLink}>Programar postagem</h1>
                </div>
              </Link>
            </li>
            <li className={styles.itemLista}>
              <Link to="/como_doar" className={styles.linkHeaderAdm}>
                <div className={styles.alinharLinks}>
                  <img className={styles.iconeLink} src="headerAdms/animais.png" alt="Fichas de animais" />
                  <h1 className={styles.textoLink}>Fichas de animais</h1>
                </div>
              </Link>
            </li>
            <li className={styles.itemLista}>
              <Link to="/denuncie" className={styles.linkHeaderAdm}>
                <div className={styles.alinharLinks}>
                  <img className={styles.iconeLink} src="headerAdms/configuracoes.png" alt="Configurações" />
                  <h1 className={styles.textoLink}>Configurações</h1>
                </div>
              </Link>
            </li>
          </ul>
        </nav>
      </header>
    </div>
  );
}