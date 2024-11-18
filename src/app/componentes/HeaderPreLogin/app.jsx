import "./header.css";
import { useEffect, useState } from 'react';

export default function Header() {
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
    return(
      <div className="fundoHeader">
        <header id="header" className="header">
          <a id="logo" href="/">
          <img src="avatar.png" className="iconeAvatar"/>
          </a>
            <nav 
            id="nav"
            className={isActive ? 'active' : ''}
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