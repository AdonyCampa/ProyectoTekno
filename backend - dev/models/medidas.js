const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/mysql");

const Medidas = sequelize.define(
  "medidas",
  {
    medida: {
      type: DataTypes.STRING,
    },
    abreviatura: {
      type: DataTypes.STRING,
    },
    estado: {
      type: DataTypes.BOOLEAN,
    },
    descripcion: {
      type: DataTypes.STRING,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = Medidas;
