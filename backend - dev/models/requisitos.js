const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/mysql');


const Requisito = sequelize.define(
    "requisitos",
    {
        nombre: {
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


module.exports = Requisito;