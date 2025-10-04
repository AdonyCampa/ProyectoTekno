const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/mysql");

const CajaMovimientos = sequelize.define(
  "caja_movimientos",
  {
    apertura: {
      type: DataTypes.INTEGER,
    },
    asunto: {
      type: DataTypes.BOOLEAN,
    },
    concepto: {
      type: DataTypes.STRING,
    },
    monto: {
      type: DataTypes.NUMBER,
    },
    fecha: {
      type: DataTypes.DATE,
    },
  },
  {
    timestamps: true,
  }
);

const CajaAperturas = sequelize.define(
  "caja_aperturas",
  {
    usuario: {
      type: DataTypes.INTEGER,
    },
    apertura: {
      type: DataTypes.DATE,
    },
    cierre: {
      type: DataTypes.DATE,
    },
    monto_inicial: {
      type: DataTypes.NUMBER,
    },
    monto_final: {
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

module.exports = { CajaMovimientos, CajaAperturas };
