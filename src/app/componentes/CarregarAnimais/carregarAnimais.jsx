import { useEffect, useMemo, useState } from "react";

const ENDPOINTS = [
  "http://localhost:3003/animais",
  "http://localhost:3003/listar/animais",
];

async function buscarAnimaisBackend() {
  let ultimoErro = null;

  for (const url of ENDPOINTS) {
    try {
      const resposta = await fetch(url);

      if (!resposta.ok) {
        ultimoErro = new Erro(`Erro ao buscar animais: ${resposta.status}`);
        continue;
      }

      const dados = await resposta.json();
      return Array.isArray(dados) ? dados : [];
    } catch (erro) {
      ultimoErro = erro;
    }
  }

  throw ultimoErro || new Erro("Não foi possível buscar os animais.");
}

function aplicarFiltros(animais, filtros = {}) {
  return animais.filter((animal) => {
    return Object.entries(filtros).every(([campo, valor]) => {
      if (valor === undefined || valor === null || valor === "") {
        return true;
      }

      if (Array.isArray(valor)) {
        return valor.includes(animal[campo]);
      }

      return animal[campo] === valor;
    });
  });
}

function removerPorCampos(animais, removerAnimaisQuePossuam = {}) {
  return animais.filter((animal) => {
    return !Object.entries(removerAnimaisQuePossuam).some(([campo, valor]) => {
      if (valor === undefined || valor === null || valor === "") {
        return false;
      }

      if (Array.isArray(valor)) {
        return valor.includes(animal[campo]);
      }

      return animal[campo] === valor;
    });
  });
}

export default function useAnimais(opcoes = {}) {
  const {
    filtros = {},
    removerAnimaisQuePossuam = {},
    transformador = null,
  } = opcoes;

  const [animaisCadastrados, setAnimaisCadastrados] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  const recarregar = async () => {
    try {
      setCarregando(true);
      setErro(null);

      const animais = await buscarAnimaisBackend();
      setAnimaisCadastrados(animais);
    } catch (erro) {
      console.erro("Erro ao buscar animais:", erro);
      setErro(erro.message);
      setAnimaisCadastrados([]);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    recarregar();
  }, []);

  const animaisFiltrados = useMemo(() => {
    let resultado = [...animaisCadastrados];

    resultado = aplicarFiltros(resultado, filtros);
    resultado = removerPorCampos(resultado, removerAnimaisQuePossuam);

    if (typeof transformador === "function") {
      resultado = transformador(resultado);
    }

    return resultado;
  }, [animaisCadastrados, filtros, removerAnimaisQuePossuam, transformador]);

  return {
    animaisCadastrados,
    animaisFiltrados,
    carregando,
    erro,
    recarregar,
  };
}