const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/mysql');


const Expediente = sequelize.define(
    "expedientes",
    {
        nombres: {
            type: DataTypes.STRING,
        },
        apellidos: {
            type: DataTypes.STRING,
        },
        dpi: {
            type: DataTypes.STRING,
        },
        nit: {
            type: DataTypes.STRING,
        },
        igss: {
            type: DataTypes.BOOLEAN,
        },
        fecha_nacimiento: {
            type: DataTypes.DATE,
        },
        direccion: {
            type: DataTypes.STRING,
        },
        telefono: {
            type: DataTypes.STRING,
        },
        correo: {
            type: DataTypes.STRING,
        },
        genero: {
            type: DataTypes.STRING,
        },
        estado_civil: {
            type: DataTypes.STRING,
        },
        hijos: {
            type: DataTypes.STRING,
        },
        licencia: {
            type: DataTypes.STRING,
        },
        foto: {
            type: DataTypes.STRING,
        },
    },
    {
        timestamps: true,
    }
);

const ExpedienteControl = sequelize.define(
    "vista_expediente_controles",
    {
        nombres: {
            type: DataTypes.STRING,
        },
        apellidos: {
            type: DataTypes.STRING,
        },
        plaza: {
            type: DataTypes.STRING,
        },
        departamento: {
            type: DataTypes.STRING,
        }
    },
    {
        timestamps: true,
    }
);


module.exports = { Expediente, ExpedienteControl };