import "bootstrap/dist/css/bootstrap.css";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import styles from "./homeAdm.module.css";
import HeaderAdms from "../HeaderAdms/app";
import BotaoPagInicial from "../BotaoPagInicialAdms/app";
import RolarPCima from "../../BotaoScroll/app";
import { useState, useRef } from "react";

const Lembrete = ({ data, descricao, corData, onRemover }) => {
  return (
    <div className={`${styles.lembreteItem} ${styles.lembreteEntrada}`}>
      <span className={styles.lembreteData} style={{ color: corData }}>
        {data + ': '}
        <span className={styles.lembreteDescricao}>{descricao}</span>
      </span>
      <button className={styles.lembreteLixeira} onClick={onRemover}>
        🗑️
      </button>
    </div>
  );
};

export default function HomeAdms() {
  const [lembretes, setLembretes] = useState([]);
  const [menuAberto, setMenuAberto] = useState(false);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [novoLembrete, setNovoLembrete] = useState({
    dataInicio: "",
    dataFim: "",
    descricao: "",
    corData: "#00ffe5",
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
      corData: "#00ffe5",
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
    <div>
      <HeaderAdms />
      <BotaoPagInicial />
      <RolarPCima/>

      <div className={styles.painel}>
        <div className={`${styles.card} ${styles.card1}`}>
          <img
            className={styles.iconeCopiar}
            src="/homeAdms/iconeCopiar.png"
            alt="Ícone de copiar"
          />
          <div className={styles.conteudoPrincipalAvisos}>
            <h1
              style={{
                color: "#6a00ff",
                WebkitTextStroke: "1.5px #28005f",
              }}
            >
              Quadro de Avisos
            </h1>

            <div className={styles.containerWrapper}>
              <div className={styles.containerLembretes} ref={containerRef}>
                {lembretes.map((lembrete) => (
                  <Lembrete
                    key={lembrete.id}
                    data={lembrete.data}
                    descricao={lembrete.descricao}
                    corData={lembrete.corData}
                    onRemover={() => removerLembrete(lembrete.id)}
                  />
                ))}
              </div>

              {/* Botão de adicionar lembrete */}
              <button
                className={styles.botaoAdicionar}
                onClick={abrirFormulario}
              >
                +
              </button>
            </div>

            {/* Formulário de novo lembrete */}
            {mostrarFormulario && (
              <div className={styles.modal}>
                <div className={styles.modalContent}>
                  <h2>Novo Lembrete</h2>

                  <div className={styles.alinharLadoALado}>
                    <input
                      type="checkbox"
                      name="ehPeriodo"
                      checked={novoLembrete.ehPeriodo}
                      onChange={handleChange}
                    />
                    <label>Período (em vez de data única)</label>
                  </div>

                  <div className={styles.alinharAcima}>
                    <label className={styles.labelInserirAviso}>
                      Data {novoLembrete.ehPeriodo ? "Inicial" : ""}
                    </label>
                    <input
                      type="date"
                      name="dataInicio"
                      value={novoLembrete.dataInicio}
                      onChange={handleChange}
                      required
                      className={styles.inputInserirAviso}
                    />
                  </div>

                  {novoLembrete.ehPeriodo && (
                    <div className={styles.alinharAcima}>
                      <label className={styles.labelInserirAviso}>Data Final</label>
                      <input
                        type="date"
                        name="dataFim"
                        value={novoLembrete.dataFim}
                        onChange={handleChange}
                        required
                        className={styles.inputInserirAviso}
                      />
                    </div>
                  )}

                  <div className={styles.alinharAcima}>
                    <label className={styles.labelInserirAviso}>Descrição</label>
                    <textarea
                      name="descricao"
                      value={novoLembrete.descricao}
                      onChange={handleChange}
                      required
                      className={`${styles.inputInserirAviso} ${styles.textareaInserirAviso}`}
                    />
                  </div>

                  <div className={styles.alinharLadoALado}>
                    <label>Cor da Data</label>
                    <input
                      type="color"
                      name="corData"
                      value={novoLembrete.corData}
                      onChange={handleChange}
                    />
                  </div>

                  <div className={styles.botoesForm}>
                    <button onClick={fecharFormulario}>Cancelar</button>
                    <button onClick={adicionarLembrete}>Adicionar</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className={`${styles.card} ${styles.card2}`}>
          <div className={styles.divLembrete}>
            <h1
              style={{
                textDecoration: "underline",
                textDecorationThickness: "2px",
                textUnderlineOffset: "11px",
                fontSize: "2rem",
                color: "#ffc800",
                WebkitTextStroke: "1px #977600",
                padding: "5px 15px 0px 15px",
              }}
            >
              Lembrete de vacinação
            </h1>
            <p
              style={{
                color: "rgba(160, 160, 160, 0.904)",
                marginBlock: "auto",
                fontSize: "1.3rem",
              }}
            >
              Há <span className={styles.sublinhadoVacinacao}>999</span> animais
              a serem vacinados
            </p>
          </div>
        </div>

        <div className={`${styles.card} ${styles.card3}`}>
          <img
            src="/usuario.png"
            alt="Botão que leva à página de autenticação"
            className={styles.iconeAvatar}
          />
          <h1 className={styles.nomeUsuario}>Nome Qualquer de Usuário</h1>
          <p
            style={{
              fontSize: "1.4rem",
              color: "black",
            }}
          >
            Administrador
          </p>

          <div className={styles.infoUsuario}>
            <div className={styles.alinharInformacoes}>
              <strong>Data de criação:</strong>
              <p></p>
            </div>
          </div>

          <button className={styles.botaoVerPerfil}>Ver Perfil</button>
        </div>

        <div className={`${styles.card} ${styles.card4}`}></div>
      </div>
    </div>
  );
}
