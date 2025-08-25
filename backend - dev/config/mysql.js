const { Sequelize } = require("sequelize");
require('dotenv').config();

const database = process.env.DB_DATABASE;
const username = process.env.DB_USER;
const password = process.env.DB_PASSWORD;
const host = process.env.DB_HOST;
const sequelize = new Sequelize(database, username, password, {
    host: host,
    dialect: "mysql",
});

const dbConnect = async () => {
    try {
        await sequelize.authenticate();
        console.log("Base de Datos Conectada");
    } catch (e) {
        console.log("Error en la Conexion de la Base de Datos", e);
    }
};

module.exports = { sequelize, dbConnect };
