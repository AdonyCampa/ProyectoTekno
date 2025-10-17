const { DataTypes } = require("sequelize");
const sequelize = require("../config/mysql");

const MovimientoCaja = sequelize.define(
  "MovimientoCaja",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    caja_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "cajas",
        key: "id",
      },
    },
    tipo: {
      type: DataTypes.ENUM("apertura", "ingreso", "egreso", "cierre"),
      allowNull: false,
    },
    concepto: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    monto: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    referencia: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    venta_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "ventas",
        key: "id",
      },
    },
    compra_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "compras",
        key: "id",
      },
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
    tableName: "movimientos_caja",
    timestamps: true,
  }
);

module.exports = MovimientoCaja;
