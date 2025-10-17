const { DataTypes } = require("sequelize");
const sequelize = require("../config/mysql");

const Medida = sequelize.define(
  "Medida",
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
    abreviatura: {
      type: DataTypes.STRING(10),
      allowNull: false,
      unique: true,
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    estado: {
      type: DataTypes.ENUM("activo", "inactivo"),
      allowNull: false,
      defaultValue: "activo",
    },
  },
  {
    tableName: "medidas",
    timestamps: true,
  }
);

module.exports = Medida;
