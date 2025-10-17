const { DataTypes } = require("sequelize");
const sequelize = require("../config/mysql");

const DetalleCompra = sequelize.define(
  "DetalleCompra",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    compra_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "compras",
        key: "id",
      },
    },
    producto_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "productos",
        key: "id",
      },
    },
    cantidad: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    precio_unitario: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    subtotal: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
  },
  {
    tableName: "detalle_compras",
    timestamps: true,
  }
);

module.exports = DetalleCompra;
