const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/mysql');


const RequisitoExpediente = sequelize.define(
    "requisitos_expedientes",
    {
        estado: {
            type: DataTypes.STRING,
        },
        fecha_vencimiento: {
            type: DataTypes.DATE,
        },
        id_expediente: {
            type: DataTypes.INTEGER,
        },
        id_requisito: {
            type: DataTypes.INTEGER,
        },
    },
    {
        timestamps: true,
    }
);


module.exports = RequisitoExpediente;