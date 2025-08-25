const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/mysql');


const CatPlaza = sequelize.define(
    "catplazas",
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


module.exports = CatPlaza;