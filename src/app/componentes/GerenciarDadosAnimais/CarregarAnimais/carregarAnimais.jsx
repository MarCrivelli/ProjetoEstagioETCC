import { useCallback, useEffect, useMemo, useState } from "react";
import { buscarAnimaisBackend } from "../BuscarAnimais/buscarAnimais";
import {
  aplicarFiltrosAnimais,
  removerAnimaisPorCampos,
  existemFiltrosAtivos,
  criarFiltrosAnimaisPadrao,
} from "../FiltrarAnimais/filtrarAnimais";

export default function carregarAnimais(opcoes = {}) {
  const {
    filtros = null,
    removerAnimaisQuePossuam = {},
    aplicarFiltrosAutomaticamente = true,
  } = opcoes;

  const [animaisCadastrados, setAnimaisCadastrados] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  const recarregarAnimais = useCallback(async () => {
    try {
      setCarregando(true);
      setErro(null);

      const animais = await buscarAnimaisBackend();
      setAnimaisCadastrados(animais);
    } catch (error) {
      console.error("Erro ao buscar animais:", error);
      setErro(error.message);
      setAnimaisCadastrados([]);
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    recarregarAnimais();
  }, [recarregarAnimais]);

  const filtrosNormalizados = filtros || criarFiltrosAnimaisPadrao();

  const animaisFiltrados = useMemo(() => {
    let resultado = [...animaisCadastrados];

    if (aplicarFiltrosAutomaticamente) {
      resultado = aplicarFiltrosAnimais(resultado, filtrosNormalizados);
    }

    resultado = removerAnimaisPorCampos(
      resultado,
      removerAnimaisQuePossuam
    );

    return resultado;
  }, [
    animaisCadastrados,
    filtrosNormalizados,
    removerAnimaisQuePossuam,
    aplicarFiltrosAutomaticamente,
  ]);

  return {
    animaisCadastrados,
    animaisFiltrados,
    carregando,
    erro,
    recarregarAnimais,
    setAnimaisCadastrados,
    filtrosAtivos: existemFiltrosAtivos(filtrosNormalizados),
  };
}