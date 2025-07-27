import { useParams } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import Select from "react-select";
import { Tooltip } from "react-tooltip";

import opcoes from "/src/app/componentes/Administradores/OpcoesDeSelecao/opcoes";
import HeaderAdms from "../HeaderAdms/app";
import RolarPCima from "../../BotaoScroll/app";
import BotaoPagInicial from "../BotaoPagInicialAdms/app";
import styles from "../PaginaDeVerMais/verMais.module.css";

export default function VerMais() {
  const { id } = useParams();

  // Estados principais - controla os dados do animal
  const [dadosOriginais, setDadosOriginais] = useState(null); // Dados como vieram do banco
  const [dadosEditados, setDadosEditados] = useState(null); // Dados sendo editados pelo usuário

  // Estados de controle da interface
  const [modoEdicao, setModoEdicao] = useState(false); // Controla se está no modo de edição
  const [existemAlteracoes, setExistemAlteracoes] = useState(false); // Se tem alterações pendentes
  const [salvandoDados, setSalvandoDados] = useState(false); // Loading durante salvamento

  // Estados específicos
  const [referenciaArquivo, setReferenciaArquivo] = useState(useRef(null));
  const [erroVacinacao, setErroVacinacao] = useState("");
  const [modalImagemAberto, setModalImagemAberto] = useState(false);
  const [imagemParaAmpliar, setImagemParaAmpliar] = useState("");

  // Estado do seletor de descrição (entrada/saída)
  const [descricaoSelecionada, setDescricaoSelecionada] = useState(
    opcoes.descricoes.find(
      (opcao) => opcao.value === "descricao" // Sempre inicia com descrição de entrada
    ) || opcoes.descricoes[0]
  );

  // CARREGAMENTO INICIAL - Busca os dados do animal no banco
  useEffect(() => {
    const buscarDadosDoAnimal = async () => {
      try {
        const resposta = await fetch(`http://localhost:3003/animais/${id}`);
        const dados = await resposta.json();

        console.log("=== DADOS CARREGADOS DO BANCO ===");
        console.log("descricao (entrada):", dados.descricao);
        console.log("descricaoSaida:", dados.descricaoSaida);

        // Garantir que os campos de descrição existem, mesmo que vazios
        // Isso evita erros no frontend quando os campos são null
        if (!dados.hasOwnProperty("descricao")) {
          dados.descricao = "";
        }
        if (!dados.hasOwnProperty("descricaoSaida")) {
          dados.descricaoSaida = "";
        }

        console.log("Dados após normalização:", dados);

        // VALIDAÇÃO AUTOMÁTICA DA VACINAÇÃO
        // Se a vacina foi há mais de 1 ano, marca como não vacinado
        const hoje = new Date();
        const umAnoAtras = new Date(hoje);
        umAnoAtras.setFullYear(hoje.getFullYear() - 1);

        if (dados.dataVacinacao && new Date(dados.dataVacinacao) < umAnoAtras) {
          dados.statusVacinacao = "naoVacinado";
          setErroVacinacao(
            "Só será possível modificar o status de vacinação para vacinado quando a data de vacinação for menor que um ano em relação a data atual"
          );
        }

        // Salva os dados nos estados
        setDadosOriginais(dados);
        setDadosEditados({ ...dados }); // Cria uma cópia para edição

        console.log("Estados atualizados com sucesso");
      } catch (error) {
        console.error("Erro ao carregar dados do animal:", error);
      }
    };

    buscarDadosDoAnimal();
  }, [id]);

  // HANDLERS DE MUDANÇA - Funções que capturam alterações nos inputs

  // Captura mudanças em campos de texto normais (nome, idade, etc.)
  const capturarMudancaCampo = (e) => {
    const { name, value } = e.target;
    setDadosEditados((anterior) => {
      const novoEstado = { ...anterior, [name]: value };
      verificarSeExistemAlteracoes(dadosOriginais, novoEstado);
      return novoEstado;
    });
  };

  // Captura mudanças específicas no textarea de descrição
  const capturarMudancaDescricao = (e) => {
    const { value } = e.target;
    const campoAtual = obterCampoDescricaoAtual(); // descricao ou descricaoSaida

    setDadosEditados((anterior) => {
      const novoEstado = { ...anterior, [campoAtual]: value };

      console.log(`=== ALTERAÇÃO NA DESCRIÇÃO ===`);
      console.log(`Campo sendo alterado: ${campoAtual}`);
      console.log(`Novo valor: "${value}"`);
      console.log(`Estado completo após alteração:`, novoEstado);

      verificarSeExistemAlteracoes(dadosOriginais, novoEstado);
      return novoEstado;
    });
  };

  // Captura mudanças nos selects (dropdowns)
  const capturarMudancaSelecao = (nomeCampo, opcaoSelecionada) => {
    setDadosEditados((anterior) => {
      const novoEstado = { ...anterior, [nomeCampo]: opcaoSelecionada.value };
      verificarSeExistemAlteracoes(dadosOriginais, novoEstado);
      return novoEstado;
    });
  };

  // Captura mudanças na data de vacinação (tem lógica especial)
  const capturarMudancaData = (e) => {
    const { value } = e.target;
    setDadosEditados((anterior) => {
      const novoEstado = {
        ...anterior,
        dataVacinacao: value,
        // Automaticamente define o status baseado na data
        statusVacinacao: value ? "vacinado" : "naoVacinado",
      };
      verificarSeExistemAlteracoes(dadosOriginais, novoEstado);
      return novoEstado;
    });
  };

  // VERIFICAÇÃO DE ALTERAÇÕES - Compara dados originais com editados
  const verificarSeExistemAlteracoes = (original, editado) => {
    if (!original || !editado) return false;

    // Campos que devem ser ignorados na comparação
    const camposIgnorados = ["createdAt", "updatedAt"];

    console.log(`=== VERIFICANDO SE EXISTEM ALTERAÇÕES ===`);
    console.log(`Original descricao: "${original.descricao || ""}"`);
    console.log(`Editado descricao: "${editado.descricao || ""}"`);
    console.log(`Original descricaoSaida: "${original.descricaoSaida || ""}"`);
    console.log(`Editado descricaoSaida: "${editado.descricaoSaida || ""}"`);

    // Loop para verificar cada campo
    for (const campo in editado) {
      if (camposIgnorados.includes(campo)) continue;

      // Normalizar valores null para string vazia para comparação
      const valorOriginal = original[campo] === null ? "" : original[campo];
      const valorEditado = editado[campo] === null ? "" : editado[campo];

      // Verificar se os tipos são diferentes
      if (typeof valorOriginal !== typeof valorEditado) {
        console.log(
          `Campo ${campo} mudou de tipo: ${typeof valorOriginal} -> ${typeof valorEditado}`
        );
        setExistemAlteracoes(true);
        return true;
      }

      // Verificar datas especificamente
      if (valorOriginal instanceof Date || valorEditado instanceof Date) {
        if (
          new Date(valorOriginal).getTime() !== new Date(valorEditado).getTime()
        ) {
          console.log(
            `Campo ${campo} - data alterada: ${valorOriginal} -> ${valorEditado}`
          );
          setExistemAlteracoes(true);
          return true;
        }
      }
      // Verificar outros valores convertendo para string
      else if (String(valorOriginal) !== String(valorEditado)) {
        console.log(
          `Campo ${campo} alterado: "${valorOriginal}" -> "${valorEditado}"`
        );
        setExistemAlteracoes(true);
        return true;
      }
    }

    console.log(`Nenhuma alteração detectada`);
    setExistemAlteracoes(false);
    return false;
  };

  // UPLOAD DE IMAGENS - Gerencia o envio de fotos
  const processarUploadImagem = async (arquivo, tipoCampo) => {
    if (!arquivo) return;

    try {
      setSalvandoDados(true);

      // Define o endpoint correto baseado no tipo de imagem
      const endpoint =
        tipoCampo === "imagemSaida"
          ? `http://localhost:3003/animais/${id}/imagem-saida`
          : `http://localhost:3003/animais/${id}/imagem`;

      // Prepara os dados para envio
      const dadosFormulario = new FormData();
      dadosFormulario.append(tipoCampo, arquivo);

      const resposta = await fetch(endpoint, {
        method: "PUT",
        body: dadosFormulario,
      });

      if (!resposta.ok) {
        const dadosErro = await resposta.json();
        throw new Error(dadosErro.message || "Erro ao atualizar imagem");
      }

      const resultado = await resposta.json();

      // Atualiza os estados com os novos dados
      setDadosOriginais(resultado.animal);
      setDadosEditados({ ...resultado.animal });

      alert(resultado.message || "Imagem atualizada com sucesso!");
    } catch (error) {
      console.error("Erro no upload da imagem:", error);
      alert(`Erro: ${error.message}`);
    } finally {
      setSalvandoDados(false);
    }
  };

  // SALVAMENTO - Funções para salvar as alterações

  // Salva especificamente a descrição de saída
  const salvarDescricaoSaida = async () => {
    try {
      setSalvandoDados(true);

      const resposta = await fetch(
        `http://localhost:3003/animais/${id}/descricao-saida`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            descricaoSaida: dadosEditados.descricaoSaida,
          }),
        }
      );

      if (resposta.ok) {
        const dados = await resposta.json();
        setDadosOriginais(dados.animal);
        setDadosEditados({ ...dados.animal });
        setExistemAlteracoes(false);
        alert("Descrição de saída atualizada com sucesso!");
      } else {
        alert("Erro ao atualizar descrição de saída.");
      }
    } catch (error) {
      console.error("Erro ao salvar descrição de saída:", error);
      alert("Erro ao atualizar descrição de saída.");
    } finally {
      setSalvandoDados(false);
    }
  };

  // Função principal de salvamento
  const salvarTodasAlteracoes = async () => {
    try {
      setSalvandoDados(true);

      // Se está editando apenas a descrição de saída, usa endpoint específico
      if (
        descricaoSelecionada.value === "descricaoSaida" &&
        existemAlteracoes
      ) {
        await salvarDescricaoSaida();
        return;
      }

      // Caso contrário, salva todos os dados
      const dadosParaEnviar = { ...dadosEditados };

      const resposta = await fetch(`http://localhost:3003/animais/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dadosParaEnviar),
      });

      if (resposta.ok) {
        const dados = await resposta.json();
        setDadosOriginais(dados.animal);
        setDadosEditados({ ...dados.animal });
        setExistemAlteracoes(false);
        setModoEdicao(false); // Sai do modo de edição após salvar
        alert("Dados atualizados com sucesso!");
      } else {
        alert("Erro ao atualizar dados do animal.");
      }
    } catch (error) {
      console.error("Erro ao salvar alterações:", error);
      alert("Erro interno. Tente novamente.");
    } finally {
      setSalvandoDados(false);
    }
  };

  // FUNÇÕES AUXILIARES PARA DESCRIÇÃO

  // Retorna qual campo está sendo editado (descricao ou descricaoSaida)
  const obterCampoDescricaoAtual = () => {
    console.log("Descrição selecionada:", descricaoSelecionada.value);

    if (descricaoSelecionada.value === "descricaoSaida") {
      return "descricaoSaida";
    }
    return "descricao"; // Para descrição de entrada
  };

  // Retorna o valor atual da descrição baseado na seleção
  const obterValorDescricaoAtual = () => {
    const campo = obterCampoDescricaoAtual();
    const valor = dadosEditados[campo] || "";

    console.log(`=== OBTENDO VALOR DA DESCRIÇÃO ===`);
    console.log(`Seleção no dropdown: ${descricaoSelecionada.value}`);
    console.log(`Campo mapeado: ${campo}`);
    console.log(`Valor atual: "${valor}"`);
    console.log(`Todas as descrições:`);
    console.log(`  - descricao: "${dadosEditados.descricao || ""}"`);
    console.log(`  - descricaoSaida: "${dadosEditados.descricaoSaida || ""}"`);

    return valor;
  };

  // Define o placeholder correto para cada tipo de descrição
  const obterPlaceholderDescricao = () => {
    return descricaoSelecionada.value === "descricaoSaida"
      ? "Adicione uma descrição sobre a saída do animal (motivo, condições, etc.)"
      : "Adicione uma descrição sobre o animal (comportamento, histórico, etc.)";
  };

  // CONTROLES DE MODO DE EDIÇÃO

  // Ativa o modo de edição
  const ativarModoEdicao = () => {
    console.log("Modo de edição ativado");
    setModoEdicao(true);
  };

  // Cancela a edição e restaura dados originais
  const cancelarEdicao = () => {
    console.log("Edição cancelada - restaurando dados originais");
    setDadosEditados({ ...dadosOriginais }); // Restaura dados originais
    setExistemAlteracoes(false);
    setModoEdicao(false);
  };

  // VALIDAÇÃO - Verifica se o animal pode ser vacinado
  const validarStatusVacinacao = (animal) => {
    if (!animal.dataVacinacao) return false;

    const dataVacinacao = new Date(animal.dataVacinacao);
    const umAnoAtras = new Date();
    umAnoAtras.setFullYear(umAnoAtras.getFullYear() - 1);

    return dataVacinacao >= umAnoAtras;
  };

  // LOADING - Exibe tela de carregamento se os dados não foram carregados
  if (!dadosOriginais || !dadosEditados) {
    return <div>Carregando dados do animal...</div>;
  }

  // MODAL PARA AMPLIAR IMAGEM
  const ModalAmpliarImagem = () => {
    if (!modalImagemAberto) return null;

    return (
      <div
        className={styles.modalOverlay}
        onClick={() => setModalImagemAberto(false)}
      >
        <div
          className={styles.modalContent}
          onClick={(e) => e.stopPropagation()}
        >
          <label
            className={styles.botaoFecharModal}
            onClick={() => setModalImagemAberto(false)}
          >
            &times;
          </label>
          <img
            src={imagemParaAmpliar}
            alt="Imagem ampliada"
            className={styles.imagemAmpliada}
          />
        </div>
      </div>
    );
  };

  // ESTILOS CUSTOMIZADOS PARA O SELECT DE TÍTULO
  const estilosSelectTitulo = {
    control: (provided) => ({
      ...provided,
      backgroundColor: "transparent",
      border: "none",
      boxShadow: "none",
      minHeight: "auto",
      padding: 0,
      cursor: "pointer",
      display: "flex",
      justifyContent: "center",
      "@media (max-width: 500px)": {
        justifyContent: "flex-start",
      },
      "&:hover": {
        border: "none",
        boxShadow: "none",
      },
    }),
    valueContainer: (provided) => ({
      ...provided,
      padding: 0,
      flexWrap: "nowrap",
      flex: "none",
      width: "auto",
    }),
    singleValue: (provided) => ({
      ...provided,
      width: "auto",
      flex: "none",
      maxWidth: "none",
      overflow: "visible",
      position: "static",
      transform: "none",
      margin: 0,
      fontFamily: '"Jockey One", sans-serif',
      fontSize: "2rem",
      "@media (max-width: 500px)": {
        fontSize: "1.5rem",
      },
    }),
    indicatorsContainer: (provided) => ({
      ...provided,
      flex: "none",
      padding: 0,
      marginLeft: "4px",
    }),
    dropdownIndicator: (provided) => ({
      ...provided,
      padding: 0,
      margin: 0,
    }),
    indicatorSeparator: () => ({
      display: "none",
    }),
  };

  return (
    <div className={styles.fundoPagina}>
      <HeaderAdms />
      <BotaoPagInicial />
      <RolarPCima />
      <ModalAmpliarImagem />

      <div className={styles.fundoVermais}>
        <div className={styles.painel}>
          {/* CARROSSEL DE IMAGENS */}
          <Carousel
            className={styles.carrossel}
            showThumbs={false}
            showStatus={false}
          >
            {/* Slide da Imagem de Entrada */}
            <div
              className={styles.slideImagemEntrada}
              style={{
                backgroundImage: dadosOriginais.imagem
                  ? `url(http://localhost:3003/uploads/${dadosOriginais.imagem})`
                  : "url(/pagFichasDAnimais/imagemTeste.jpg)",
              }}
            >
              <div className={styles.containerImagemCarrossel}>
                <img
                  src={
                    dadosOriginais.imagem
                      ? `http://localhost:3003/uploads/${dadosOriginais.imagem}`
                      : "/pagFichasDAnimais/imagemTeste.jpg"
                  }
                  alt="Imagem de entrada"
                  className={styles.imagemPrincipal}
                />
                {modoEdicao && (
                  <div className={styles.botoesUtilitarios}>
                    <label className={styles.botaoTrocarImagem}>
                      <img src="/pagVerMais/galeria.png" alt="Trocar imagem" />
                      <input
                        type="file"
                        onChange={(e) =>
                          processarUploadImagem(e.target.files[0], "imagem")
                        }
                        style={{ display: "none" }}
                        accept="image/*"
                        disabled={salvandoDados}
                      />
                    </label>
                    <button
                      className={styles.botaoVerAmpliado}
                      onClick={() => {
                        setImagemParaAmpliar(
                          dadosOriginais.imagem
                            ? `http://localhost:3003/uploads/${dadosOriginais.imagem}`
                            : "/pagFichasDAnimais/imagemTeste.jpg"
                        );
                        setModalImagemAberto(true);
                      }}
                    >
                      <img
                        src="/pagVerMais/olho.png"
                        alt="Ver imagem ampliada"
                      />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Slide da Imagem de Saída */}
            <div
              className={styles.slideImagemSaida}
              style={{
                backgroundImage: dadosOriginais.imagemSaida
                  ? `url(http://localhost:3003/uploads/${dadosOriginais.imagemSaida})`
                  : dadosOriginais.imagem
                  ? `url(http://localhost:3003/uploads/${dadosOriginais.imagem})`
                  : "none",
              }}
            >
              {dadosOriginais.imagemSaida ? (
                <div className={styles.containerImagemCarrossel}>
                  <img
                    src={`http://localhost:3003/uploads/${dadosOriginais.imagemSaida}`}
                    alt="Imagem de saída"
                    className={styles.imagemPrincipal}
                  />
                  {modoEdicao && (
                    <div className={styles.botoesUtilitarios}>
                      <label className={styles.botaoTrocarImagem}>
                        <img
                          src="/pagVerMais/galeria.png"
                          alt="Trocar imagem"
                        />
                        <input
                          type="file"
                          onChange={(e) =>
                            processarUploadImagem(
                              e.target.files[0],
                              "imagemSaida"
                            )
                          }
                          style={{ display: "none" }}
                          accept="image/*"
                          disabled={salvandoDados}
                        />
                      </label>
                      <button
                        className={styles.botaoVerAmpliado}
                        onClick={() => {
                          setImagemParaAmpliar(
                            dadosOriginais.imagemSaida
                              ? `http://localhost:3003/uploads/${dadosOriginais.imagemSaida}`
                              : "/pagFichasDAnimais/imagemTeste.jpg"
                          );
                          setModalImagemAberto(true);
                        }}
                      >
                        <img
                          src="/pagVerMais/olho.png"
                          alt="Ver imagem ampliada"
                        />
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className={styles.semImagemDeSaida}>
                  <div className={styles.alinharImagemQuebrada}>
                    <img src="/pagVerMais/semImagem.png" alt="Sem imagem" />
                  </div>
                  <h1>Nenhuma imagem de saída foi cadastrada</h1>
                  {modoEdicao && (
                    <p>
                      Para inserir uma imagem,{" "}
                      <label>
                        clique aqui
                        <input
                          type="file"
                          onChange={(e) =>
                            processarUploadImagem(
                              e.target.files[0],
                              "imagemSaida"
                            )
                          }
                          style={{ display: "none" }}
                          accept="image/*"
                          ref={referenciaArquivo}
                          disabled={salvandoDados}
                        />
                      </label>{" "}
                      e selecione uma imagem do seu dispositivo
                    </p>
                  )}
                </div>
              )}
            </div>
          </Carousel>

          <div className={styles.alinharDadosDeIdentificacao}>
            {/* SEÇÃO DE DESCRIÇÃO */}
            <div className={styles.dadosDeIdentificacao}>
              <Select
                options={opcoes.descricoes}
                styles={estilosSelectTitulo}
                isSearchable={false}
                value={descricaoSelecionada}
                onChange={(opcaoSelecionada) =>
                  setDescricaoSelecionada(opcaoSelecionada)
                }
              />
              <textarea
                className={styles.descricaoTextarea}
                value={obterValorDescricaoAtual()}
                onChange={capturarMudancaDescricao}
                placeholder={obterPlaceholderDescricao()}
                rows={5}
                disabled={!modoEdicao} // Só permite edição no modo de edição
              />
            </div>

            {/* DADOS DE IDENTIFICAÇÃO */}
            <div className={styles.dadosDeIdentificacao}>
              <h1 className={styles.tituloDadosDeIdentificacao}>
                Dados de identificação
              </h1>
              <div className={styles.alinharDados}>
                <label className={styles.labelDeIdentificacao}>Nome:</label>
                <input
                  className={styles.inputDadosIdentificacao}
                  name="nome"
                  maxLength={30}
                  type="text"
                  value={dadosEditados.nome || ""}
                  onChange={capturarMudancaCampo}
                  disabled={!modoEdicao}
                />
              </div>
              <div className={styles.alinharDados}>
                <label className={styles.labelDeIdentificacao}>Idade:</label>
                <input
                  className={styles.inputDadosIdentificacao}
                  name="idade"
                  min="1"
                  max="20"
                  type="number"
                  value={dadosEditados.idade || ""}
                  onChange={capturarMudancaCampo}
                  disabled={!modoEdicao}
                />
              </div>
              <div className={styles.alinharDados}>
                <label className={styles.labelDeIdentificacao}>Sexo:</label>
                <Select
                  options={opcoes.sexoDoAnimal}
                  value={opcoes.sexoDoAnimal.find(
                    (opcao) => opcao.value === dadosEditados.sexo
                  )}
                  onChange={(opcaoSelecionada) =>
                    capturarMudancaSelecao("sexo", opcaoSelecionada)
                  }
                  className={styles.selectInserirAnimal}
                  isDisabled={!modoEdicao}
                />
              </div>
              <div className={styles.alinharDados}>
                <label className={styles.labelDeIdentificacao}>Tipo:</label>
                <Select
                  options={opcoes.tipoAnimal}
                  value={opcoes.tipoAnimal.find(
                    (opcao) => opcao.value === dadosEditados.tipo
                  )}
                  onChange={(opcaoSelecionada) =>
                    capturarMudancaSelecao("tipo", opcaoSelecionada)
                  }
                  className={styles.selectInserirAnimal}
                  isDisabled={!modoEdicao}
                />
              </div>
              <div className={styles.alinharDados}>
                <label className={styles.labelDeIdentificacao}>
                  Status de microchipagem:
                </label>
                <Select
                  options={opcoes.StatusMicrochipagem}
                  value={opcoes.StatusMicrochipagem.find(
                    (opcao) => opcao.value === dadosEditados.statusMicrochipagem
                  )}
                  onChange={(opcaoSelecionada) =>
                    capturarMudancaSelecao(
                      "statusMicrochipagem",
                      opcaoSelecionada
                    )
                  }
                  className={styles.selectInserirAnimal}
                  isDisabled={!modoEdicao}
                />
              </div>
            </div>

            {/* DADOS DE SAÚDE */}
            <div className={styles.dadosDeIdentificacao}>
              <h1 className={styles.tituloDadosDeIdentificacao}>
                Dados de saúde
              </h1>
              <div className={styles.alinharDados}>
                <label className={styles.labelDadosSaude}>
                  Status de vacinação:
                </label>
                <Select
                  options={opcoes.StatusVacinacao}
                  value={opcoes.StatusVacinacao.find(
                    (opcao) => opcao.value === dadosEditados.statusVacinacao
                  )}
                  onChange={(opcaoSelecionada) => {
                    // Validação especial para vacinação
                    const hoje = new Date();
                    const umAnoAtras = new Date(hoje);
                    umAnoAtras.setFullYear(hoje.getFullYear() - 1);

                    if (opcaoSelecionada.value === "vacinado") {
                      if (!dadosEditados.dataVacinacao) {
                        setErroVacinacao(
                          "Informe a data de vacinação primeiro"
                        );
                        return;
                      } else if (
                        new Date(dadosEditados.dataVacinacao) < umAnoAtras
                      ) {
                        setErroVacinacao(
                          "Data de vacinação expirada (deve ser nos últimos 12 meses)"
                        );
                        return;
                      }
                    }

                    setErroVacinacao("");
                    capturarMudancaSelecao("statusVacinacao", opcaoSelecionada);
                  }}
                  className={styles.selectInserirAnimal}
                  isDisabled={
                    !modoEdicao ||
                    (dadosEditados.statusVacinacao === "naoVacinado" &&
                      (!dadosEditados.dataVacinacao ||
                        new Date(dadosEditados.dataVacinacao) <
                          new Date(
                            new Date().setFullYear(new Date().getFullYear() - 1)
                          )))
                  }
                />
                {erroVacinacao && (
                  <p className={styles.errorMessage}>{erroVacinacao}</p>
                )}
                <Tooltip id="idSelectNome" place="top">
                  Clique na caixa abaixo e selecione o nome de algum animal para
                  que suas informações apareçam no slide.
                </Tooltip>
              </div>
              <div className={styles.alinharDados}>
                <label className={styles.labelDadosSaude}>
                  Data da última vacinação
                </label>
                <input
                  className={styles.inputDadosIdentificacao}
                  type="date"
                  name="dataVacinacao"
                  value={
                    dadosEditados.dataVacinacao
                      ? dadosEditados.dataVacinacao.split("T")[0]
                      : ""
                  }
                  onChange={capturarMudancaData}
                  max={new Date().toISOString().split("T")[0]}
                  disabled={!modoEdicao}
                />
              </div>
              <div className={styles.alinharDados}>
                <label className={styles.labelDadosSaude}>
                  Status de castração:
                </label>
                <Select
                  options={opcoes.StatusCastracao}
                  value={opcoes.StatusCastracao.find(
                    (opcao) => opcao.value === dadosEditados.statusCastracao
                  )}
                  onChange={(opcaoSelecionada) =>
                    capturarMudancaSelecao("statusCastracao", opcaoSelecionada)
                  }
                  className={styles.selectInserirAnimal}
                  isDisabled={!modoEdicao}
                />
              </div>
              <div className={styles.alinharDados}>
                <label className={styles.labelDadosSaude}>
                  Status de adoção:
                </label>
                <Select
                  options={opcoes.StatusAdocao}
                  value={opcoes.StatusAdocao.find(
                    (opcao) => opcao.value === dadosEditados.statusAdocao
                  )}
                  onChange={(opcaoSelecionada) =>
                    capturarMudancaSelecao("statusAdocao", opcaoSelecionada)
                  }
                  className={styles.selectInserirAnimal}
                  isDisabled={!modoEdicao}
                />
              </div>
              <div className={styles.alinharDados}>
                <label className={styles.labelDadosSaude}>
                  Status de vermifugação:
                </label>
                <Select
                  options={opcoes.StatusVermifugacao}
                  value={opcoes.StatusVermifugacao.find(
                    (opcao) => opcao.value === dadosEditados.statusVermifugacao
                  )}
                  onChange={(opcaoSelecionada) =>
                    capturarMudancaSelecao(
                      "statusVermifugacao",
                      opcaoSelecionada
                    )
                  }
                  className={styles.selectInserirAnimal}
                  isDisabled={!modoEdicao}
                />
              </div>
            </div>
          </div>

          {/* BOTÕES DE CONTROLE */}
          <div className={styles.botaoSalvarContainer}>
            {!modoEdicao ? (
              // Botão para ativar modo de edição
              <button
                className={styles.botaoEditar}
                onClick={ativarModoEdicao}
                disabled={salvandoDados}
              >
                {salvandoDados ? "Carregando..." : "Editar Dados"}
              </button>
            ) : (
              // Botões quando está em modo de edição
              <div className={styles.botoesEdicao}>
                <button
                  className={styles.botaoCancelar}
                  onClick={cancelarEdicao}
                  disabled={salvandoDados}
                >
                  Cancelar
                </button>
                <button
                  className={`${styles.botaoSalvar} ${
                    !existemAlteracoes || salvandoDados ? styles.desativado : ""
                  }`}
                  onClick={() => {
                    // Verificação final antes de salvar
                    if (
                      !verificarSeExistemAlteracoes(
                        dadosOriginais,
                        dadosEditados
                      )
                    ) {
                      alert("Nenhuma alteração foi feita");
                      return;
                    }
                    salvarTodasAlteracoes();
                  }}
                  disabled={!existemAlteracoes || salvandoDados}
                >
                  {salvandoDados ? "Salvando..." : "Salvar Alterações"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
