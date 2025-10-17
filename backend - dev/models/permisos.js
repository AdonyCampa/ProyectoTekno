const { DataTypes } = require("sequelize");
const sequelize = require("../config/mysql");

const Permiso = sequelize.define(
  "Permiso",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    rol_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "roles",
        key: "id",
      },
    },
    modulo_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "modulos",
        key: "id",
      },
    },
    crear: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    leer: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    actualizar: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    eliminar: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    tableName: "permisos",
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["rol_id", "modulo_id"],
      },
    ],
  }
);

module.exports = Permiso;
