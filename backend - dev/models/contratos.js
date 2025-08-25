const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/mysql');


const Contrato = sequelize.define(
    "contratos",
    {
        no_contrato: {
            type: DataTypes.STRING,
        },
        no_acuerdo: {
            type: DataTypes.STRING,
        },
        id_plaza: {
            type: DataTypes.INTEGER,
        },
        fecha_acuerdo: {
            type: DataTypes.DATE,
        },
        fecha_contrato: {
            type: DataTypes.DATE,
        },
        fecha_posesion: {
            type: DataTypes.DATE,
        },
        fecha_fin: {
            type: DataTypes.DATE,
        },
        sueldo: {
            type: DataTypes.NUMBER,
        },
        id_expediente: {
            type: DataTypes.INTEGER,
        },
        estado: {
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

const ContratosView = sequelize.define(
    "vista_listar_cantratos",
    {
        no_contrato: {
            type: DataTypes.STRING,
        },
        no_acuerdo: {
            type: DataTypes.STRING,
        },
        id_plaza: {
            type: DataTypes.INTEGER,
        },
        plaza: {
            type: DataTypes.STRING,
        },
        fecha_acuerdo: {
            type: DataTypes.DATE,
        },
        fecha_contrato: {
            type: DataTypes.DATE,
        },
        fecha_posesion: {
            type: DataTypes.DATE,
        },
        fecha_fin: {
            type: DataTypes.DATE,
        },
        sueldo: {
            type: DataTypes.NUMBER,
        },
        id_expediente: {
            type: DataTypes.INTEGER,
        },
        nombres: {
            type: DataTypes.STRING,
        },
        apellidos: {
            type: DataTypes.STRING,
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
        descripcion: {
            type: DataTypes.STRING,
        }
    },
    {
        timestamps: true,
    }
);


module.exports = { Contrato, ContratosView };