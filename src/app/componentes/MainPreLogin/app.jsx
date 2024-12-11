import "./main.css";
import 'bootstrap/dist/css/bootstrap.css';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import Header from "../HeaderPreLogin/app";

export default function Main() {

    var erro = false

    if(erro){
        return(
            <h1>Erro</h1>
        )
    }
    
    return (
        <div className="mainPreLogin">
            <Header/>
            <div className="logoPreLogin">
                <img
                    src="logo.png"
                    width={800}
                    height={400}
                    className="imagemLogo"
                />
                <div className="textoLogoPreLogin">
                    <h1 className="titulo">Instituto Esperança</h1>
                    <p>A voz dos animais</p>
                </div>
            </div>
            <Carousel className="carrossel">
                <div className="blocoCarrossel">
                    <img className="imagem" src="mainVisitantes/cachorro.png" />
                    <div className="textoCarrossel">
                        <h1>Olá</h1>
                        <p>Insto é um teste daaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaqaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaae responsividade, então vou enrolar aqui só para ter um texto grande.</p>
                    </div>
                </div>
                <div className="blocoCarrossel">
                    <img className="imagem" src="avatar.png" />
                    <div className="textoCarrossel">
                        <h1>Olá</h1>
                        <p>Insto é um teste daaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaqaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaae responsividade, então vou enrolar aqui só para ter um texto grande.</p>
                    </div>
                </div>
                <div className="blocoCarrossel">
                    <img className="imagem" src="avatar.png" />
                    <div className="textoCarrossel">
                        <h1>Olá</h1>
                        <p>Insto é um teste daaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaqaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaae responsividade, então vou enrolar aqui só para ter um texto grande.</p>
                    </div>
                </div>
            </Carousel>
        </div>
    );
}