import "bootstrap/dist/css/bootstrap.css";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import styles from "./homeAdm.module.css";
import HeaderAdms from "../../HeaderAdms/app";
import BotaoPagInicial from "../../BotaoPagInicialAdms/app";
import RolarPCima from "../../../BotaoScroll/app";
import { useState, useRef, useEffect } from "react";
import Card1 from "../Card1/app";
import Card2 from "../Card2/app";
import Card3 from "../Card3/app";

// Configuração da API - ajuste conforme seu ambiente
const API_BASE_URL = 'http://localhost:3003'; // Porta do seu backend

export default function HomeAdms() {
  const [lembretes, setLembretes] = useState([]);
  const [menuAberto, setMenuAberto] = useState(false);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState(null);
  const [ultimoLembreteId, setUltimoLembreteId] = useState(null); // ✅ Para controlar animação
  const [novoLembrete, setNovoLembrete] = useState({
    dataInicio: "",
    dataFim: "",
    descricao: "",
    corData: "#0095ff",
    ehPeriodo: false,
  });

  const containerRef = useRef();

  // Carregar avisos ao montar o componente
  useEffect(() => {
    carregarAvisos();
  }, []);

  const carregarAvisos = async () => {
    try {
      setLoading(true);
      setErro(null);
      
      const response = await fetch(`${API_BASE_URL}/avisos`);
      
      if (response.ok) {
        const avisos = await response.json();
        setLembretes(avisos);
        setUltimoLembreteId(null); // ✅ Limpar animação ao carregar
      } else {
        const errorData = await response.json();
        setErro(errorData.erro || 'Erro ao carregar avisos');
        console.error('Erro ao carregar avisos:', errorData);
      }
    } catch (error) {
      setErro('Erro de conexão com o servidor');
      console.error('Erro na requisição:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleMenu = () => {
    setMenuAberto(!menuAberto);
  };

  const abrirFormulario = () => {
    setMostrarFormulario(true);
    setMenuAberto(false);
    setErro(null); // Limpar erros anteriores
    
    // ✅ Prevenir mudanças de layout quando modal abre
    document.body.classList.add('modal-aberto');
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
    setErro(null); // Limpar erros
    
    // ✅ Remover classe quando modal fecha
    document.body.classList.remove('modal-aberto');
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNovoLembrete((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const adicionarLembrete = async () => {
    // Validações básicas (mantendo as originais)
    if (!novoLembrete.descricao || !novoLembrete.dataInicio) {
      setErro('Preencha todos os campos obrigatórios');
      return;
    }

    if (novoLembrete.ehPeriodo && !novoLembrete.dataFim) {
      setErro('Para períodos, a data final é obrigatória');
      return;
    }

    // Validar se data final é posterior à inicial
    if (novoLembrete.ehPeriodo && novoLembrete.dataFim) {
      if (new Date(novoLembrete.dataFim) < new Date(novoLembrete.dataInicio)) {
        setErro('A data final deve ser posterior à data inicial');
        return;
      }
    }

    try {
      setLoading(true);
      setErro(null);

      const response = await fetch(`${API_BASE_URL}/avisos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          descricao: novoLembrete.descricao,
          dataInicio: novoLembrete.dataInicio,
          dataFim: novoLembrete.ehPeriodo ? novoLembrete.dataFim : null,
          ehPeriodo: novoLembrete.ehPeriodo,
          corData: novoLembrete.corData,
        }),
      });

      if (response.ok) {
        const novoAviso = await response.json();
        setLembretes(prev => [...prev, novoAviso]);
        setUltimoLembreteId(novoAviso.id); // ✅ Marcar como novo para animação
        
        // ✅ Limpar a marcação após a animação (0.7s + buffer)
        setTimeout(() => {
          setUltimoLembreteId(null);
        }, 1000);
        
        fecharFormulario();
      } else {
        const errorData = await response.json();
        setErro(errorData.erro || 'Erro ao adicionar aviso');
      }
    } catch (error) {
      setErro('Erro de conexão com o servidor');
      console.error('Erro na requisição:', error);
    } finally {
      setLoading(false);
    }
  };

  const removerLembrete = async (id) => {
    try {
      setLoading(true);
      
      const response = await fetch(`${API_BASE_URL}/avisos/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setLembretes(prev => prev.filter(lembrete => lembrete.id !== id));
      } else {
        const errorData = await response.json();
        setErro(errorData.erro || 'Erro ao remover aviso');
        console.error('Erro ao remover aviso:', errorData);
      }
    } catch (error) {
      setErro('Erro de conexão com o servidor');
      console.error('Erro na requisição:', error);
    } finally {
      setLoading(false);
    }
  };

  // Função auxiliar para exibir mensagens de erro (sem causar layout shift)
  const exibirErro = () => {
    if (!erro) return null;
    
    return (
      <div 
        className="alert alert-danger alert-dismissible fade show position-fixed" 
        role="alert"
        style={{
          top: '20px',
          right: '20px',
          zIndex: 1050,
          maxWidth: '400px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
        }}
      >
        {erro}
        <button 
          type="button" 
          className="btn-close" 
          onClick={() => setErro(null)}
          aria-label="Close"
        ></button>
      </div>
    );
  };

  return (
    <div className={styles.fundoPagina}>
      <HeaderAdms />
      <BotaoPagInicial />
      <RolarPCima />

      {/* ✅ Mensagem de erro fora do fluxo normal */}
      {exibirErro()}

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
            ultimoLembreteId={ultimoLembreteId}
          />

          <Card2 />

          <Card3 />
        </div>
      </div>
    </div>
  );
}