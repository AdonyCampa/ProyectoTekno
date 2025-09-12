const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/mysql');


const Marcas = sequelize.define(
    "marcas",
    {
        marca: {
            type: DataTypes.STRING,
        },
        descripcion: {
            type: DataTypes.STRING,
        }
    },
    {
        timestamps: true,
    }
);

module.exports = Marcas;