const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/mysql');


const Productos = sequelize.define(
    "productos",
    {
        producto: {
            type: DataTypes.STRING,
        },
        descripcion: {
            type: DataTypes.STRING,
        },
        stockmin: {
            type: DataTypes.INTEGER,
        },
        stockmax: {
            type: DataTypes.INTEGER,
        },
        categoria: {
            type: DataTypes.INTEGER,
        },
        marca: {
            type: DataTypes.INTEGER,
        }
    },
    {
        timestamps: true,
    }
);

module.exports = Productos;