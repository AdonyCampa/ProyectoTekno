const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/mysql");

const Clientes = sequelize.define(
  "clientes",
  {
    nombres: {
      type: DataTypes.STRING,
    },
    apellidos: {
      type: DataTypes.STRING,
    },
    dpi: {
      type: DataTypes.STRING,
    },
    nit: {
      type: DataTypes.STRING,
    },
    telefono: {
      type: DataTypes.STRING,
    },
    correo: {
      type: DataTypes.STRING,
    },
    direccion: {
      type: DataTypes.STRING,
    },
    estado: {
      type: DataTypes.BOOLEAN,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = Clientes;
