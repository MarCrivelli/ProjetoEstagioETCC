import styles from "./headerAdm.module.css";
import { Link } from "react-router-dom";
import { useState, useEffect } from 'react';

export default function HeaderAdms() {
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
      <header className={styles.headerAdms}>
        <Link className={styles.linkLogo} to="/administracao" title="Instituto Esperança">
          <img
            src="/logos/logoBranca.png"
            className={styles.logo}
            alt="Logo do Instituto Esperança"
          />
        </Link>

        <nav className={styles.nav}>
          <ul className={styles.menu} role="menu">
            <li>
              <Link to="/fichas_de_animais" className={styles.linkSubPaginas}>
                Fichas de animais
              </Link>
            </li>
            <li>
              <Link to="/programar_postagem" className={styles.linkSubPaginas}>
                Postagens
              </Link>
            </li>
            <li>
              <Link to="/configuracoes" className={styles.linkSubPaginas}>
                Configurações
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
                to="/fichas_de_animais" 
                className={styles.linkMenuMobile}
                onClick={() => setMenuAberto(false)}
              >
                <img src="/headerAdms/pata.png"/>
                Fichas de animais
              </Link>
            </li>
            <li>
              <Link 
                to="/programar_postagem" 
                className={styles.linkMenuMobile}
                onClick={() => setMenuAberto(false)}
              >
                <img src="/headerAdms/post.png"/>
                Postagens
              </Link>
            </li>
            <li>
              <Link 
                to="/configuracoes" 
                className={styles.linkMenuMobile}
                onClick={() => setMenuAberto(false)}
              >
                <img src="/headerAdms/engrenagem.png"/>
                Configurações
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
}