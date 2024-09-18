import "./main.css";
import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import Carousel from 'react-bootstrap/Carousel';

export default function Main() {
    return (
        <div class="mainPreLogin">
            <div class="logoPreLogin">
                <img
                    src="logo.png"
                    width={200}
                    height={200}
                />
                <div class="textoLogoPreLogin">
                    <h1>Instituto Esperança</h1>
                    <p>A voz dos animais</p>
                </div>
            </div>
            <div class="carrossel">
                <Carousel>
                    <Carousel.Item interval={5000}>
                    <img
                        width={1000}
                        height={1000}
                        class="imagemCarrossel"
                        src="logo.png"
                        alt="Image One"
                    />
                    </Carousel.Item>
                    <Carousel.Item>
                    <img
                        width={1000}
                        height={1000}
                        class="imagemCarrossel"
                        src="https://media.geeksforgeeks.org/wp-content/uploads/20210425122716/1-300x115.png"
                        alt="Image Two"
                    />
                    </Carousel.Item>
                </Carousel>
            </div>
        </div>
    );
}