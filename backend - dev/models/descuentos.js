const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/mysql');


const Descuento = sequelize.define(
    "descuentos",
    {
        nombre: {
            type: DataTypes.STRING,
        },
        descuento: {
            type: DataTypes.DECIMAL,
        },
        descripcion: {
            type: DataTypes.STRING,
        }
    },
    {
        timestamps: true,
    }
);


module.exports = Descuento;