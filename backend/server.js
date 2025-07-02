const express = require("express");
const cors = require("cors");
const path = require("path");
const { sequelize } = require("./config/connection");
const routes = require("./routers/routes");
const setupAssociations = require('./models/Associacoes');

const app = express();
const port = process.env.PORT || 3003;

// Middlewares
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204,
  })
);

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Configuração para servir arquivos estáticos
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Rotas
app.use(routes);

// Rota raiz
app.get("/", (req, res) => {
  const filePath = path.join(__dirname, "views", "index.html");
  res.sendFile(filePath);
});

// Middleware de erro (mantido no final)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Erro interno no servidor" });
});

// Inicialização do banco de dados e servidor
async function initialize() {
  try {
    // 1. Autenticar conexão com o banco
    await sequelize.authenticate();
    console.log("Conexão com o banco estabelecida.");

    // 2. Configurar associações
    setupAssociations();
    console.log("Associações configuradas.");

    // 3. Sincronizar modelos (force: true apenas em desenvolvimento)
    await sequelize.sync({ force: true });
    console.log("Banco de dados sincronizado.");

    // 4. Iniciar servidor
    app.listen(port, () => {
      console.log(`Servidor rodando na porta ${port}`);
    });
  } catch (error) {
    console.error("Falha na inicialização:", error);
    process.exit(1); // Encerra o processo com erro
  }
}

// Inicia a aplicação
initialize();