import Header from "../HeaderVisitantes/app";
import Footer from "../Footer/app";
import styles from "./adote.module.css";
import Select from "react-select";
import { useState } from "react";

const delegaciasVirtuaisDeEstadosBrasileiros = [
  { value: "ac", label: "Acre", link: "https://www.ac.gov.br" }, // Link exemplo - substitua pelo real
  {
    value: "al",
    label: "Alagoas",
    link: "http://www.delegaciavirtual.al.gov.br",
  },
  { value: "ap", label: "Amapá", link: "https://www.ap.gov.br" }, // Link exemplo
  { value: "am", label: "Amazonas", link: "https://www.am.gov.br" }, // Link exemplo
  {
    value: "ba",
    label: "Bahia",
    link: "http://www.ssp.ba.gov.br/delegaciavirtual",
  },
  {
    value: "ce",
    label: "Ceará",
    link: "https://www.delegaciavirtual.ce.gov.br",
  },
  {
    value: "df",
    label: "Distrito Federal",
    link: "http://www.delegaciavirtual.pcdf.df.gov.br",
  },
  { value: "es", label: "Espírito Santo", link: "https://www.es.gov.br" }, // Link exemplo
  {
    value: "go",
    label: "Goiás",
    link: "https://www.delegaciavirtual.seds.go.gov.br",
  },
  { value: "ma", label: "Maranhão", link: "https://www.ma.gov.br" }, // Link exemplo
  {
    value: "mt",
    label: "Mato Grosso",
    link: "https://www.delegaciavirtual.pmt.mt.gov.br",
  },
  {
    value: "ms",
    label: "Mato Grosso do Sul",
    link: "http://devir.pc.ms.gov.br/#/",
  },
  { value: "mg", label: "Minas Gerais", link: "https://www.mg.gov.br" }, // Link exemplo
  { value: "pa", label: "Pará", link: "https://www.pa.gov.br" }, // Link exemplo
  { value: "pb", label: "Paraíba", link: "https://www.pb.gov.br" }, // Link exemplo
  {
    value: "pr",
    label: "Paraná",
    link: "https://www.delegaciavirtual.pr.gov.br",
  },
  {
    value: "pe",
    label: "Pernambuco",
    link: "https://www.delegaciavirtual.pe.gov.br",
  },
  { value: "pi", label: "Piauí", link: "https://www.pi.gov.br" }, // Link exemplo
  {
    value: "rj",
    label: "Rio de Janeiro",
    link: "http://www.delegaciaonline.policiacivil.rj.gov.br",
  },
  { value: "rn", label: "Rio Grande do Norte", link: "https://www.rn.gov.br" }, // Link exemplo
  {
    value: "rs",
    label: "Rio Grande do Sul",
    link: "https://www.delegaciavirtual.rs.gov.br",
  },
  { value: "ro", label: "Rondônia", link: "https://www.ro.gov.br" }, // Link exemplo
  { value: "rr", label: "Roraima", link: "https://www.rr.gov.br" }, // Link exemplo
  {
    value: "sc",
    label: "Santa Catarina",
    link: "https://www.delegaciavirtual.sc.gov.br",
  },
  {
    value: "sp",
    label: "São Paulo",
    link: "https://www.delegaciaeletronica.policiacivil.sp.gov.br",
  },
  { value: "se", label: "Sergipe", link: "https://www.se.gov.br" }, // Link exemplo
  { value: "to", label: "Tocantins", link: "https://www.to.gov.br" }, // Link exemplo
];

export default function QueroAdotar() {
  const [estadoSelecionado, setEstadoSelecionado] = useState(null);

  const handleChange = (selectedOption) => {
    setEstadoSelecionado(selectedOption);
  };
  return (
    <>
      <div className={styles.ajusteHeader}>
        <Header />
      </div>
      <div className={styles.ajusteElementosDaPagina}>
        <div className={styles.seccao}>
          <h1>
            Presenciou alguma situação e quer denunciá-la para as autoridades
            locais? Saiba como:
          </h1>
          <p>
            <strong className={styles.strong}>Dica 1: </strong>É importante
            manter a calma nesses momentos e não fazer nada com as próprias
            mãos, a não ser que seja estritamente necessário, pois do contrário,
            em alguns casos, pode acabar resultando em agressões físicas ou até
            a morte, tanto para o animal quanto para você!
          </p>
          <div className={styles.topicosFuncionais}>
            <p>
              <strong className={styles.strong}>Dica 2: </strong>Todo estado
              possui uma delegacia virtual no qual você possa acessar para
              denunciar, no anonimato ou não, diferentes tipos de situações,
              incluindo situações referentes a causa animal. Se você não souber
              o link da delegacia de seu estado, selecione seu estado na caixa
              abaixo:
            </p>
            <Select
              options={delegaciasVirtuaisDeEstadosBrasileiros}
              onChange={handleChange}
              placeholder="Selecione seu estado"
              className={styles.selectEstados}
            />
            {/* Mostra o link se um estado foi selecionado */}
            {estadoSelecionado && (
              <p>
                Para acessar a delegacia virtual de {estadoSelecionado.label}, clique aqui:{" "}
                <a
                  href={estadoSelecionado.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.link}
                >
                   {estadoSelecionado.link}
                </a>
                
              </p>
            )}
          </div>
          <p>
            <strong className={styles.strong}>Dica 3: </strong> Você pode ligar
            para a polícia ambiental ou militar para essas situações também,
            especialmente se a ocorrência envolver animais silvestres &#40;
            animais que não são domesticos, que vivem na natureza &#41;.
          </p>
        </div>

        <div className={styles.seccao}>
          <h1>Quais situações são válidas para realizar uma denúncia?</h1>
          <p>
            <strong className={styles.strong}>1 - Cativeiro: </strong> nenhum
            animal deve ficar o tempo inteiro preso, seja em correntes ou
            gaiolas. Os animais devem ser soltos por ao menos 3 horas todos os
            dias e é recomendado o passeio com cães e gatos pelo menos 2 vezes
            na semana, com fins de reduzir o estresse do animal. Além disso,
            enquanto o animal estiver preso ele precisa ficar em um local com
            sombra, água e comida ao alcance, corrente com pelo menos 2 metros
            de comprimento para o animal se poder se mover e uma coleira frouxa,
            que permita você colocar dois dedos entre a mesma o pescoço do
            animal.
          </p>
          <p>
            <strong className={styles.strong}>2- Negligência: </strong>
            animais precisam de cuidados constantes, ainda mais se ficarem
            dentro de casa, pois não podem ou não tem habilidade para procurar
            água e comida sozinhos. É preciso fornecer a quantidade recomendada
            de ração de acordo com o porte do animal, água o tempo todo, um
            lugar coberto para não pegarem chuva ou sol, visitas ao veterinário
            &#40; quando necessário &#41; e passeios e banhos semanais.
          </p>
          <p>
            <strong className={styles.strong}>3- Agressões: </strong> apesar de
            ser normalizado por algumas pessoas, bater, espancar ou agredir o
            animal de qualquer forma, causando lesões ou dor, é sim um motivo
            para denúncia e pode fazer com que o dono perca a tutela do animal.
          </p>
          <p>
            <strong className={styles.strong}>4- Exploração: </strong> quaisquer
            tipos de exploração animal é motivo de denúncia. Neste caso, o termo
            &quot;exploração&quot; pode se encaixar em: explorar para fins
            lucrativos, não cuidando da saúde do animal e fazendo-o ir além de
            seus limites &#40; um exemplo é o que acontece com animais que são
            resgatados de círcos clandestinos &#41;. E explorar para fins
            próprios, como realizar tarefas pesadas ou atos sexuais.
          </p>
          <p>
            <strong className={styles.strong}>5- Envenenamento: </strong> dar de
            propósito substâncias tóxicas, álcool, drogas, cigarro e outros é
            mais do que um bom motivo para realizar uma denúncia, pois podem
            causar convunções, falha nos órgãos e até a morte de animais.
          </p>
          <p>
            <strong className={styles.strong}>6- Crueldade: </strong>{" "}
            comportamentos cruéis, como machucar, afogar, ou até mesmo forçar
            situações em que deixam o animal com medo, apenas por diversão,
            também é passível de denúncia.
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
}
