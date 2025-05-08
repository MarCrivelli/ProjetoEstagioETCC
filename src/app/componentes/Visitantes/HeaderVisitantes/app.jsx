import styles from "./headerVisitantes.module.css";
import { Link } from "react-router-dom";
import { FaHeart } from 'react-icons/fa';
import { useState, useEffect } from 'react';

export default function Header() {
  const [menuAberto, setMenuAberto] = useState(false);

  // Fecha o menu quando a tela for redimensionada para mais de 700px
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 700) {
        setMenuAberto(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Impede rolagem quando o menu está aberto
  useEffect(() => {
    if (menuAberto) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [menuAberto]);

  return (
    <>
      <header className={styles.headerVisitantes}>
        <Link className={styles.linkLogo} to="/" title="Instituto Esperança">
          <img
            src="/logos/logoBranca.png"
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
              <button 
                className={styles.btnMobile}
                onClick={() => setMenuAberto(!menuAberto)}
                aria-label="Menu"
              >
                <span className={styles.hamburguerVisitantes}></span>
              </button>
            </li>
          </ul>
        </nav>
      </header>

      {/* Overlay escuro */}
      {menuAberto && (
        <div 
          className={styles.overlay} 
          onClick={() => setMenuAberto(false)}
        />
      )}

      {/* Menu lateral */}
      <div className={`${styles.menuLateral} ${menuAberto ? styles.menuAberto : ''}`}>
        {/* Botão de fechar */}
        <button 
          className={styles.botaoFechar}
          onClick={() => setMenuAberto(false)}
          aria-label="Fechar menu"
        >
          ×
        </button>
        <nav>
          <ul>
            <li>
              <Link 
                to="/quero_adotar" 
                className={styles.linkMenuMobile}
                onClick={() => setMenuAberto(false)}
              >
                Quero adotar!
              </Link>
            </li>
            <li>
              <Link 
                to="/como_doar" 
                className={styles.linkMenuMobile}
                onClick={() => setMenuAberto(false)}
              >
                Como doar?
              </Link>
            </li>
            <li>
              <Link 
                to="/denuncie" 
                className={styles.linkMenuMobile}
                onClick={() => setMenuAberto(false)}
              >
                Denuncie
              </Link>
            </li>
            <li>
              <Link 
                to="/saude_unica" 
                className={styles.linkMenuMobile}
                onClick={() => setMenuAberto(false)}
              >
                <FaHeart/>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
}