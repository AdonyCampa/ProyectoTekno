const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/mysql');


const HistorialLaboral = sequelize.define(
    "historiales_laborales",
    {
        empresa: {
            type: DataTypes.STRING,
        },
        direccion: {
            type: DataTypes.STRING,
        },
        telefono: {
            type: DataTypes.STRING,
        },
        puesto: {
            type: DataTypes.STRING,
        },
        fecha_inicio: {
            type: DataTypes.DATE,
        },
        fecha_fin: {
            type: DataTypes.DATE,
        },
        id_expediente: {
            type: DataTypes.NUMBER,
        },
    },
    {
        timestamps: true,
    }
);


module.exports = HistorialLaboral;