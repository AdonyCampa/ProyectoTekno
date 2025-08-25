const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/mysql');


const Archivo = sequelize.define(
    "archivos",
    {
        asunto: {
            type: DataTypes.STRING,
        },
        descripcion: {
            type: DataTypes.STRING,
        },
        estado: {
            type: DataTypes.STRING,
        },
        cod_ref: {
            type: DataTypes.STRING,
        },
        fecha: {
            type: DataTypes.DATE,
        },
        fecha_recepcion: {
            type: DataTypes.DATE,
        },
        id_tipo: {
            type: DataTypes.NUMBER,
        },
        id_empleado: {
            type: DataTypes.NUMBER,
        }
    },
    {
        timestamps: true,
    }
);

const ArchivoView = sequelize.define(
    "vista_listar_archivos",
    {
        asunto: {
            type: DataTypes.STRING,
        },
        descripcion: {
            type: DataTypes.STRING,
        },
        estado: {
            type: DataTypes.STRING,
        },
        id_tipo: {
            type: DataTypes.INTEGER,
        },
        tipo: {
            type: DataTypes.STRING,
        },
        cod_ref: {
            type: DataTypes.STRING,
        },
        fecha: {
            type: DataTypes.DATE,
        },
        fecha_recepcion: {
            type: DataTypes.DATE,
        }   
    },
    {
        timestamps: true,
    }
);


module.exports = {ArchivoView, Archivo};