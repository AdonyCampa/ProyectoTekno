const { DataTypes } = require("sequelize");
const sequelize = require("../config/mysql");

const Proveedor = sequelize.define(
  "Proveedor",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    empresa: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    contacto: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    nit: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    telefono: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: true,
      validate: {
        isEmail: true,
      },
    },
    direccion: {
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
    tableName: "proveedores",
    timestamps: true,
  }
);

module.exports = Proveedor;
