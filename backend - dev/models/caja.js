const { DataTypes } = require("sequelize");
const sequelize = require("../config/mysql");

const Caja = sequelize.define(
  "Caja",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    fecha_apertura: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    fecha_cierre: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    monto_inicial: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.0,
    },
    monto_final: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    total_ingresos: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.0,
    },
    total_egresos: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.0,
    },
    saldo_esperado: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    diferencia: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      defaultValue: 0.0,
    },
    estado: {
      type: DataTypes.ENUM("abierta", "cerrada"),
      allowNull: false,
      defaultValue: "abierta",
    },
    observaciones_apertura: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    observaciones_cierre: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    usuario_apertura: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "usuarios",
        key: "id",
      },
    },
    usuario_cierre: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "usuarios",
        key: "id",
      },
    },
  },
  {
    tableName: "cajas",
    timestamps: true,
  }
);

module.exports = Caja;
