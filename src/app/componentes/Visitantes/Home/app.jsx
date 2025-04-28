import "./home.css";
import 'bootstrap/dist/css/bootstrap.css';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import Header from "../HeaderVisitantes/app";
import BotaoPagInicialVisitantes from "../BotaoPagInicialVisitantes/app";

export default function HomeVisitantes() {

    var erro = false

    if(erro){
        return(
            <h1>Erro</h1>
        )
    }
    
    return (
        <div className="mainPreLogin">
            <BotaoPagInicialVisitantes/>
            <Header/>
            <div className="logoPreLogin">
                <img
                    src="logos/logoBranca.png"
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
                        <h1>Aqui, os animais são a nossa família.</h1>
                        <p>Se encontrou um animalzinho abandonado, traga para nós, que nós cuidaremos dele até ele achar um novo lar. Se quiser adotar, também podemos te dar boas dicas de como cuidar do seu pet</p>
                    </div>
                </div>
                <div className="blocoCarrossel">
                    <img className="imagem" src="mainVisitantes/gato.png" />
                    <div className="textoCarrossel">
                        <h1>Recebemos diversos tipos de animais de quatro patar!</h1>
                        <p>Cuidamos não apenas de animais domésticos, como gatos ou cachorros, mas também cuidamos de animais silvestres, como cavalos, papagaios e muitos outros.</p>
                    </div>
                </div>
                <div className="blocoCarrossel">
                    <img className="imagem" src="avatar.png" />
                    <div className="textoCarrossel">
                        <h1>Olá</h1>
                        <p></p>
                    </div>
                </div>
            </Carousel>
            <div className="sobreNos">
                <h1>Quem somos?</h1>
                <p>  
                  O Instituto Esperança é uma instituição sem fins lucrativos que surgiu em meados de 2022, com o objetivo de acolher e cuidar de animais em situação de abandono, 
                  além de garantir que eles recebam um lar adequado, livre de agressões e futuros abandonos. Até pouco antes do instituto surgir, era bem comum ver animais andando em
                  bandos pela cidade, especialmente cachorros, que por sua vez nem eram adotados por terem doenças ou membros quebrados e nem eram acolhidos em um local apropriado, 
                  ficando a par da bondade de moradores locais que forneciam água e restos de alimentos para amenizar a situação. Hoje em dia, a situação já é bem diferente. Agora temos
                  um local onde os animais ficam quentinhos e seguros e são tratados até que estejem em condições de serem adotados. E não acaba por aí! Depois ficarem saudáveis para a
                  adoção, nós agendamos possíveis interessados em adotá-los e fazemos uma avaliação para saber se seus futuros donos estão aptos a receberem um animalzinho em suas casas,
                  além de supervisionar mesmo após a adoção para saber se tudo está correndo como os conformes.
                </p>
            </div>
        </div>
    );
}