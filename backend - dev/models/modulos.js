const { DataTypes } = require("sequelize");
const sequelize = require("../config/mysql");

const Modulo = sequelize.define(
  "Modulo",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    slug: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      comment: "Identificador único para el código (ej: caja, ventas, compras)",
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    icono: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: "Clase del icono (ej: bi-cash-stack)",
    },
    ruta: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "Ruta en el frontend (ej: /caja)",
    },
    orden: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    estado: {
      type: DataTypes.ENUM("activo", "inactivo"),
      allowNull: false,
      defaultValue: "activo",
    },
  },
  {
    tableName: "modulos",
    timestamps: true,
  }
);

module.exports = Modulo;
