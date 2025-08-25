const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/mysql');


const Departamento = sequelize.define(
    "departamentos",
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


module.exports = Departamento;