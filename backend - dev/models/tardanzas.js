const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/mysql');


const Tardanza = sequelize.define(
    "tardanzas",
    {
        id_empleado: {
            type: DataTypes.INTEGER,
        },
        mes_a: {
            type: DataTypes.STRING,
        },
        tiempo_acumulado: {
            type: DataTypes.INTEGER,
        },
        descripcion: {
            type: DataTypes.STRING,
        }
    },
    {
        timestamps: true,
    }
);


module.exports = Tardanza;