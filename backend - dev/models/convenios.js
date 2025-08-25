const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/mysql');


const Convenio = sequelize.define(
    "convenios",
    {
        motivo: {
            type: DataTypes.STRING,
        },
        total_pago: {
            type: DataTypes.NUMBER,
        },
        cant_pagos: {
            type: DataTypes.INTEGER,
        },
        fecha: {
            type: DataTypes.DATE,
        },
        finiquito: {
            type: DataTypes.BOOLEAN,
        },
        fecha_finiquito: {
            type: DataTypes.DATE,
        },
        descripcion: {
            type: DataTypes.STRING,
        }
    },
    {
        timestamps: true,
    }
);


module.exports = Convenio;