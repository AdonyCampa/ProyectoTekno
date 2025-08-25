const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/mysql');


const HistorialAcademico = sequelize.define(
    "historiales_academicos",
    {
        id_nivel: {
            type: DataTypes.INTEGER,
        },
        establecimiento: {
            type: DataTypes.STRING,
        },
        titulo: {
            type: DataTypes.STRING,
        },
        fecha: {
            type: DataTypes.DATE,
        },
        id_expediente: {
            type: DataTypes.INTEGER,
        },
    },
    {
        timestamps: true,
    }
);


module.exports = HistorialAcademico;