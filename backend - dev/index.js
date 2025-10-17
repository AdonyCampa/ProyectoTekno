const express = require("express");
const cors = require("cors");
const { dbConnect } = require("./config/mysql");
require("dotenv").config();

// Crear el servidor/aplicación de express
const app = express();

// Directorio Público
app.use(express.static("public"));

// CORS
app.use(cors());

// Lectura y parseo del body
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

// Middleware de logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Rutas públicas
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "API del Sistema de Gestión",
    version: "1.0.0",
    modulos: [
      "caja",
      "ventas",
      "compras",
      "inventario",
      "productos",
      "proveedores",
      "clientes",
      "usuarios",
      "roles",
      "categorias",
      "marcas",
      "medidas",
    ],
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "API funcionando correctamente",
    timestamp: new Date().toISOString(),
  });
});

// Rutas
app.use("/api", require("./routes"));

// Iniciar servidor
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`
  ╔═══════════════════════════════════════╗
  ║   🚀 Servidor iniciado exitosamente  ║
  ╠═══════════════════════════════════════╣
  ║   Puerto: ${PORT}                        ║
  ║   Entorno: ${process.env.NODE_ENV || "development"}            ║
  ║   API: http://localhost:${PORT}/api      ║
  ╚═══════════════════════════════════════╝}`);
});

// Manejo de señales de terminación
process.on("SIGTERM", () => {
  console.log("SIGTERM recibido. Cerrando servidor...");
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("\nSIGINT recibido. Cerrando servidor...");
  process.exit(0);
});
