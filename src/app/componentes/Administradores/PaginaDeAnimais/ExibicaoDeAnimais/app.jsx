import styles from "./exibicaoDeAnimais.module.css";
import { Link } from "react-router-dom";
export default function ExibicaoDeAnimais({ animais, filtrosAplicados }) {
  return (
    <>
      {animais.length === 0 ? (
        <div className={styles.mensagemNenhumAnimal}>
          <img
            className={styles.imagemPreCadastro}
            src="/pagFichasDAnimais/animaisConfusos.png"
          ></img>
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
                Idade: {animal.idade} ano(s)
              </p>
              <p className={styles.dadosAnimais}>Sexo: {animal.sexo}</p>
              <p className={styles.dadosAnimais}>
                Status de vacinação: {animal.statusVacinacao}
              </p>
              <p className={styles.dadosAnimais}>
                Status de castração: {animal.statusCastracao}
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
