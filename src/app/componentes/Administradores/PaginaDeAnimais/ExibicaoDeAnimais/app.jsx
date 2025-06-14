import styles from "./exibicaoDeAnimais.module.css";
import { Link } from "react-router-dom";
import opcoes from '/src/app/componentes/Administradores/OpcoesDeSelecao/opcoes';

export default function ExibicaoDeAnimais({ animais, filtrosAplicados }) {
  // Verificação de segurança para animais não definido ou não array
  if (!animais || !Array.isArray(animais)) {
    return (
      <div className={styles.mensagemNenhumAnimal}>
        <img
          className={styles.imagemPreCadastro}
          src="/pagFichasDAnimais/animaisConfusos.png"
          alt="Ícone de animais confusos"
        />
        <h2 className={styles.textoPreCadastro}>
          Carregando animais...
        </h2>
      </div>
    );
  }

  return (
    <>
      {animais.length === 0 ? (
        <div className={styles.mensagemNenhumAnimal}>
          <img
            className={styles.imagemPreCadastro}
            src="/pagFichasDAnimais/animaisConfusos.png"
            alt="Ícone de animais confusos"
          />
          <h2 className={styles.textoPreCadastro}>
            {filtrosAplicados
              ? "Nenhum animal encontrado com os filtros aplicados. Tente ajustar os filtros."
              : "Nenhum animal cadastrado. Cadastre um novo animal!"}
          </h2>
        </div>
      ) : (

        animais.map((animal) => (
          <div className={styles.cardAnimais} key={animal.id}>
            <div className={styles.divImagem}>
              <img
                className={styles.imagemAnimais}
                src={
                  animal.imagem
                    ? `http://localhost:3003/uploads/${animal.imagem}`
                    : "/pagFichasDAnimais/imagemTeste.jpg"
                }
                alt="Imagem do animal"
              />
            </div>
            <div className={styles.infoAnimais}>
              <h1 className={styles.nomeAnimal}>{animal.nome}</h1>
              <p className={styles.dadosAnimais}>
                Idade: {opcoes.vincularLabel(animal.idade?.toString(), 'idadeAnimais')}
              </p>
              <p className={styles.dadosAnimais}>Sexo: {opcoes.vincularLabel(animal.sexo, 'sexoDoAnimal')}</p>
              <p className={styles.dadosAnimais}>
                Status de vacinação: {opcoes.vincularLabel(animal.statusVacinacao, 'StatusVacinacao')}
              </p>
              <p className={styles.dadosAnimais}>
                Status de castração: {opcoes.vincularLabel(animal.statusCastracao, 'StatusCastracao')}
              </p>
              <Link
                to={`/ver_mais/${animal.id}`}
                className={styles.botaoVerMais}
              >
                Ver mais
              </Link>
            </div>
          </div>
        ))
      )}

    </>
  );
}