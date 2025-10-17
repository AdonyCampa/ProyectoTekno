const { DataTypes } = require("sequelize");
const sequelize = require("../config/mysql");

const Venta = sequelize.define(
  "Venta",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    numero_venta: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    fecha: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    cliente_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "clientes",
        key: "id",
      },
    },

    total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.0,
    },
    tipo_pago: {
      type: DataTypes.ENUM("efectivo", "tarjeta", "credito", "transferencia"),
      allowNull: false,
      defaultValue: "efectivo",
    },
    estado: {
      type: DataTypes.ENUM("pendiente", "completada", "cancelada"),
      allowNull: false,
      defaultValue: "completada",
    },
    observaciones: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    usuario_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "usuarios",
        key: "id",
      },
    },
  },
  {
    tableName: "ventas",
    timestamps: true,
  }
);

module.exports = Venta;
