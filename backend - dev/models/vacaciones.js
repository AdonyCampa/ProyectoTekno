const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/mysql');


const ProgramacionV = sequelize.define(
    "vacaciones",
    {
        id_empleado: {
            type: DataTypes.INTEGER,
        },
        cant_dias: {
            type: DataTypes.INTEGER,
        },
        fecha_inicio: {
            type: DataTypes.DATE,
        },
        fecha_fin: {
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


module.exports = ProgramacionV;