import "./header.css";

import { useEffect, useState } from 'react';

export default function Header() {
  //O código abaixo cuida dos eventos do header responsivo com botão de hambúrguer.
  const [isActive, setIsActive] = useState(false);

  const toggleMenu = (event) => {
    if (event.type === 'touchstart') {
      event.preventDefault(); // Previne o comportamento padrão
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


  //O código abaixo cuida da função que eu pensei para o navbar ganhar uma borda quando o usuário rolar a tela para baixo
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll); // Cleanup
  }, []);



    return(
      <div className="fundoHeader">
        <header id="header" className={scrolled ? 'scrolled' : ''}>
          <a id="logo" href="/" title="usuário">
            <img src="avatar.png" alt="Botão que leva à página de autenticação" className="iconeAvatar"/>
          </a>
            <nav 
            id="nav"
            className={isActive ? 'active' : '' }
            >
              <button 
              id="btnMobile"
              aria-expanded={isActive}
              aria-label={isActive ? 'Fechar Menu' : 'Abrir Menu'}
              onClick={toggleMenu}
              >
                <span id="hamburguer"></span>
              </button>
              <ul id="menu" role="menu">
                <li>
                  <a className="a">
                    <div className="alinharLinks">
                      <img className="iconeLink" src="adocao.png"></img>
                      <h1 className="textoLink">Quero adotar!</h1>
                    </div>
                  </a>
                </li>
                <li>
                  <a className="a">
                    <div className="alinharLinks">
                      <img className="iconeLink" src="doacao.png"></img>
                      <h1 className="textoLink">Como doar?</h1>
                    </div>
                  </a>
                </li>
                <li>
                  <a className="a">
                    <div className="alinharLinks">
                    <img className="iconeLink" src="denuncia.png"></img>
                      <h1 className="textoLink">Denuncie</h1>
                    </div>
                  </a>
                </li>
                <li>
                  <a className="a">
                    <div className="alinharLinks">
                      <img className="iconeLink" src="saude.png"></img>
                      <h1 className="textoLink">Saúde única</h1>
                    </div>
                  </a>
                </li>
                <li>
                  <a className="a">
                    <div className="alinharLinks">
                      <img className="iconeLink" src="info.png"></img>
                      <h1 className="textoLink">Sobre nós</h1>
                    </div>
                  </a>
                </li>
              </ul>
            </nav>
        </header>
      </div>
    );
  }