const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/mysql');



const Empleados = sequelize.define(
    "vista_listar_empleados",
    {

        id_plaza: {
            type: DataTypes.INTEGER,
        },
        plaza: {
            type: DataTypes.STRING,
        },
        fecha_inicio: {
            type: DataTypes.DATE,
        },
        fecha_fin: {
            type: DataTypes.DATE,
        },
        sueldo: {
            type: DataTypes.NUMBER,
        },
        nombres: {
            type: DataTypes.STRING,
        },
        apellidos: {
            type: DataTypes.STRING,
        },
        dpi: {
            type: DataTypes.INTEGER,
        },
        nit: {
            type: DataTypes.INTEGER,
        },
        renglon: {
            type: DataTypes.STRING,
        },
        departamento: {
            type: DataTypes.STRING,
        },
        estado: {
            type: DataTypes.STRING,
        },
    },
    {
        timestamps: true,
    }
);


module.exports = { Empleados };