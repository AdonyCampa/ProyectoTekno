const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/mysql");

const Proveedores = sequelize.define(
  "proveedores",
  {
    empresa: {
      type: DataTypes.STRING,
    },
    contacto: {
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

module.exports = Proveedores;
