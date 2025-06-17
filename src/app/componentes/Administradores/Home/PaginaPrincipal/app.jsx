import "bootstrap/dist/css/bootstrap.css";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import styles from "./homeAdm.module.css";
import HeaderAdms from "../../HeaderAdms/app";
import BotaoPagInicial from "../../BotaoPagInicialAdms/app";
import RolarPCima from "../../../BotaoScroll/app";
import { useState, useRef } from "react";
import Card1 from "../Card1/app";
import Card2 from "../Card2/app";
import Card3 from "../Card3/app";

export default function HomeAdms() {
  const [lembretes, setLembretes] = useState([]);
  const [menuAberto, setMenuAberto] = useState(false);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [novoLembrete, setNovoLembrete] = useState({
    dataInicio: "",
    dataFim: "",
    descricao: "",
    corData: "#0095ff",
    ehPeriodo: false,
  });

  const containerRef = useRef();

  const toggleMenu = () => {
    setMenuAberto(!menuAberto);
  };

  const abrirFormulario = () => {
    setMostrarFormulario(true);
    setMenuAberto(false);
  };

  const fecharFormulario = () => {
    setMostrarFormulario(false);
    setNovoLembrete({
      dataInicio: "",
      dataFim: "",
      descricao: "",
      corData: "#0095ff",
      ehPeriodo: false,
    });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNovoLembrete((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const adicionarLembrete = () => {
    if (!novoLembrete.descricao || !novoLembrete.dataInicio) return;

    const dataFormatada = novoLembrete.ehPeriodo
      ? `${formatarData(novoLembrete.dataInicio)} a ${formatarData(
          novoLembrete.dataFim
        )}`
      : formatarData(novoLembrete.dataInicio);

    const lembrete = {
      id: Date.now(),
      data: dataFormatada,
      descricao: novoLembrete.descricao,
      corData: novoLembrete.corData,
    };

    setLembretes([...lembretes, lembrete]);
    fecharFormulario();
  };

  const formatarData = (dataISO) => {
    const [ano, mes, dia] = dataISO.split("-");
    return `${dia}/${mes}/${ano}`;
  };

  const removerLembrete = (id) => {
    setLembretes(lembretes.filter((lembrete) => lembrete.id !== id));
  };

  return (
    <div className={styles.fundoPagina}>
      <HeaderAdms />
      <BotaoPagInicial />
      <RolarPCima />

      <div className={styles.fundoPainel}>
        <div className={styles.painel}>
          <Card1
            lembretes={lembretes}
            abrirFormulario={abrirFormulario}
            containerRef={containerRef}
            mostrarFormulario={mostrarFormulario}
            novoLembrete={novoLembrete}
            handleChange={handleChange}
            adicionarLembrete={adicionarLembrete}
            fecharFormulario={fecharFormulario}
            removerLembrete={removerLembrete}
          />

          <Card2 />

          <Card3 />

        </div>
      </div>
    </div>
  );
}