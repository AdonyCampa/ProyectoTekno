const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/mysql");

const Compras = sequelize.define(
  "compras",
  {
    fecha: {
      type: DataTypes.DATE,
    },
    proveedor: {
      type: DataTypes.INTEGER,
    },
    usuario: {
      type: DataTypes.INTEGER,
    },
    apertura: {
      type: DataTypes.INTEGER,
    },
    total: {
      type: DataTypes.NUMBER,
    },
    estado: {
      type: DataTypes.BOOLEAN,
    },
  },
  {
    timestamps: true,
  }
);

const ComprasDetalle = sequelize.define(
  "compras_detalle",
  {
    compra: {
      type: DataTypes.INTEGER,
    },
    producto: {
      type: DataTypes.INTEGER,
    },
    cantidad: {
      type: DataTypes.INTEGER,
    },
    precio_unitario: {
      type: DataTypes.NUMBER,
    },
    subtotal: {
      type: DataTypes.NUMBER,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = { Compras, ComprasDetalle };
