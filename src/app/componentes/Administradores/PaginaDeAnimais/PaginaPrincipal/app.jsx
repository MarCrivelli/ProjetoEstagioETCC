import styles from "./animais.module.css";
import { useState, useEffect } from "react";
import Accordion from "react-bootstrap/Accordion";
import HeaderAdms from "../../HeaderAdms/app";
import RolarPCima from "../../../BotaoScroll/app";
import BotaoPagInicial from "../../BotaoPagInicial/app";
import FiltroDeAnimais from "../FiltroDeAnimais/app";
import CadastroDeAnimais from "../CadastroDeAnimais/app";
import ExibicaoDeAnimais from "../ExibicaoDeAnimais/app";

export default function FichasDeAnimais() {
  const [animaisCompleto, setAnimaisCompleto] = useState([]);
  const [animais, setAnimais] = useState([]);
  const [filtrosAplicados, setFiltrosAplicados] = useState(false);
  const [filtros, setFiltros] = useState({
    tipo: [],
    idade: [],
    sexo: [],
    statusVacinacao: [],
    statusCastracao: [],
    statusAdocao: [],
    statusMicrochipagem: [],
    statusVermifugacao: [],
    nome: ""
  });

  // Função para buscar os animais
  useEffect(() => {
    const buscarAnimais = async () => {
      try {
        const resposta = await fetch("http://localhost:3003/listar/animais");
        const dados = await resposta.json();
        setAnimais(dados);
        setAnimaisCompleto(dados);
      } catch {
        alert("Ocorreu um erro no app!");
      }
    };
    buscarAnimais();
  }, []);

  // Função para aplicar os filtros
  const aplicarFiltros = () => {
    let animaisFiltrados = animaisCompleto;
  
    const filtroAtivo = 
      Object.values(filtros).some(
        value => (Array.isArray(value) ? value.length > 0 : value !== "")
      );
    setFiltrosAplicados(filtroAtivo);
  
    animaisFiltrados = animaisFiltrados.filter((animal) => {
      // Verificação do nome (case insensitive)
      const nomeMatch = 
        !filtros.nome || 
        animal.nome.toLowerCase().includes(filtros.nome.toLowerCase());
      
      // Verificação dos outros filtros
      const outrosFiltrosMatch = 
        (filtros.tipo.length === 0 || filtros.tipo.includes(animal.tipo)) &&
        (filtros.idade.length === 0 || filtros.idade.includes(animal.idade.toString())) &&
        (filtros.sexo.length === 0 || filtros.sexo.includes(animal.sexo)) &&
        (filtros.statusVacinacao.length === 0 || filtros.statusVacinacao.includes(animal.statusVacinacao)) &&
        (filtros.statusCastracao.length === 0 || filtros.statusCastracao.includes(animal.statusCastracao)) &&
        (filtros.statusAdocao.length === 0 || filtros.statusAdocao.includes(animal.statusAdocao)) &&
        (filtros.statusMicrochipagem.length === 0 || filtros.statusMicrochipagem.includes(animal.statusMicrochipagem)) &&
        (filtros.statusVermifugacao.length === 0 || filtros.statusVermifugacao.includes(animal.statusVermifugacao));
  
      return nomeMatch && outrosFiltrosMatch;
    });
  
    setAnimais(animaisFiltrados);
  };

  useEffect(() => {
    aplicarFiltros();
  }, [filtros, animaisCompleto]); 

  return (
    <div>
      <HeaderAdms />
      <BotaoPagInicial />
      <RolarPCima />
      <div className={styles.utilitarios}>
        <Accordion className={styles.acordeao} defaultActiveKey="0">
          {/* Acordeão de filtro */}
          <Accordion.Item eventKey="0">
            <Accordion.Header>
              <h1 className={styles.tituloAcordeao}>Filtros de pesquisa</h1>
            </Accordion.Header>
            <Accordion.Body className={styles.corpoAcordeao}>
              <FiltroDeAnimais filtros={filtros} setFiltros={setFiltros} />
            </Accordion.Body>
          </Accordion.Item>

          {/* Acordeão de cadastro */}
          <Accordion.Item eventKey="1">
            <Accordion.Header>
              <h1 className={styles.tituloAcordeao}>Inserir ficha de animal</h1>
            </Accordion.Header>
            <Accordion.Body>
              <CadastroDeAnimais animais={animais} setAnimais={setAnimais} />
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </div>

      {/* Listagem de animais */}
      <div className={styles.alinharPainel}>
        <div className={styles.fundoPainel}>
          <ExibicaoDeAnimais animais={animais} filtrosAplicados={filtrosAplicados} />
        </div>
      </div>
    </div>
  );
}