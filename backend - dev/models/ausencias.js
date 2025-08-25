const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/mysql');


const Ausencia = sequelize.define(
    "ausencias",
    {
        id_empleado: {
            type: DataTypes.INTEGER,
        },
        justificacion: {
            type: DataTypes.STRING,
        },
        fecha: {
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


module.exports = Ausencia;