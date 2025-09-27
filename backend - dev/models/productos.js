const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/mysql");

const Productos = sequelize.define(
  "productos",
  {
    producto: {
      type: DataTypes.STRING,
    },
    stockmin: {
      type: DataTypes.INTEGER,
    },
    stockmax: {
      type: DataTypes.INTEGER,
    },
    categoria: {
      type: DataTypes.INTEGER,
    },
    marca: {
      type: DataTypes.INTEGER,
    },
    medida: {
      type: DataTypes.INTEGER,
    },
    precio_venta: {
      type: DataTypes.NUMBER,
    },
    precio_costo: {
      type: DataTypes.NUMBER,
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

module.exports = Productos;
