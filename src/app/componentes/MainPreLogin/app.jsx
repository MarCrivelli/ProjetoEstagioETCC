import "./main.css";
import 'bootstrap/dist/css/bootstrap.css';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';

export default function Main() {
    
    return (
        <div className="mainPreLogin">
            <div className="logoPreLogin">
                <img
                    src="logo.png"
                    width={450}
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
                    <img className="imagem" src="avatar.png" />
                    <p className="legend">AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA</p>
                </div>
                <div className="blocoCarrossel">
                    <img className="imagem" src="avatar.png" />
                    <p className="legend">Legend 2</p>
                </div>
                <div className="blocoCarrossel">
                    <img className="imagem" src="avatar.png" />
                    <p className="legend">Legend 3</p>
                </div>
            </Carousel>
        </div>
    );
}