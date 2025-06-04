const express = require("express");
const cors = require("cors");
const path = require("path");
const { sequelize } = require("./config/connection"); // Importa o sequelize
const routes = require("./routers/routes");

const app = express();
const port = process.env.PORT || 3003;

// Middlewares
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3003'], 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Rotas
app.use(routes);

// Rota raiz
app.get("/", (req, res) => {
  const filePath = path.join(__dirname, "views", "index.html");
  res.sendFile(filePath);
});

// Configuração para servir arquivos estáticos da pasta "uploads"
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Sincroniza o banco de dados
sequelize.sync({ force: true }) // Use { force: true } apenas em desenvolvimento
  .then(() => {
    console.log("Banco de dados sincronizado com sucesso.");
    // Inicia o servidor após a sincronização
    app.listen(port, () => {
      console.log(`Servidor rodando na porta ${port}`);
    });
  })
  .catch((err) => {
    console.error("Erro ao sincronizar o banco de dados:", err);
  });