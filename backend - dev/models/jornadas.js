const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/mysql');


const Jornada = sequelize.define(
    "jornadas",
    {
        nombre: {
            type: DataTypes.STRING,
        },
        hora_inicio: {
            type: DataTypes.TIME,
        },
        hora_fin: {
            type: DataTypes.TIME,
        },
        descripcion: {
            type: DataTypes.STRING,
        }
    },
    {
        timestamps: true,
    }
);


module.exports = Jornada;