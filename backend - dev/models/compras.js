const { DataTypes } = require("sequelize");
const sequelize = require("../config/mysql");

const Compra = sequelize.define(
  "Compra",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    numero_compra: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    fecha: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    proveedor_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "proveedores",
        key: "id",
      },
    },
    total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.0,
    },
    tipo_pago: {
      type: DataTypes.ENUM("contado", "credito"),
      allowNull: false,
      defaultValue: "contado",
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
    tableName: "compras",
    timestamps: true,
  }
);

module.exports = Compra;
