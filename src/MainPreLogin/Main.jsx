import "./main.css";
import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';

export default function Main() {
    return (
        <div class="mainPreLogin">
            <div class="logoPreLogin">
                <img
                    src="logo.png"
                    width={450}
                    height={400}
                />
                <div class="textoLogoPreLogin">
                    <h1>Instituto Esperança</h1>
                    <p>A voz dos animais</p>
                </div>
            </div>
            <Carousel>
                <div>
                    <img  class="imagem" src="logo.png" />
                    <p className="legend">Legend 1</p>
                </div>
                <div>
                    <img src="logo.png" />
                </div>
                <div>
                    <img src="logo.png" />
                    <p className="legend">Legend 3</p>
                </div>
            </Carousel>
        </div>
    );
}