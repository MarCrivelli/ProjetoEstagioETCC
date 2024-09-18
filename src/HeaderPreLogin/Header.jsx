import "./header.css";

export default function Header() {
    return(
      <div class="headerPreLogin">
        <div class="linksDoHeader">
          <div class="minicardDeImagens">
            <img
                width={1000}
                height={1000}
                class="imagensLinksDoHeader"
                src="adocao.png"
            />
          </div>
          <h1>Quero Adotar!</h1>
        </div>
        <div class="linksDoHeader">
          <div class="minicardDeImagens">
            <img
                width={1000}
                height={1000}
                class="imagensLinksDoHeader"
                src="doacao.png"
            />
          </div>
          <h1>Como Doar?</h1>
        </div>
        <div class="linksDoHeader">
          <div class="minicardDeImagens">
            <img
                width={1000}
                height={1000}
                class="imagensLinksDoHeader"
                src="informacoes.png"
            />
          </div>
          <h1>Sobre o Instituto</h1>
        </div>
        <div class="linksDoHeader">
          <div class="minicardDeImagens">
            <img
                width={1000}
                height={1000}
                class="imagensLinksDoHeader"
                src="informacoes.png"
            />
          </div>
          <h1>Sou colaborador</h1>
        </div>
      </div>  
    );
  }