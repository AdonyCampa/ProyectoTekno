const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/mysql");

const Inventarios = sequelize.define(
  "inventarios",
  {
    producto: {
      type: DataTypes.INTEGER,
    },
    tipo: {
      type: DataTypes.BOOLEAN,
    },
    cantidad: {
      type: DataTypes.INTEGER,
    },
    referencia: {
      type: DataTypes.INTEGER,
    },
    fecha: {
      type: DataTypes.DATE,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = Inventarios;
