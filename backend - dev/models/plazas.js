const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/mysql');


const Plaza = sequelize.define(
    "plazas",
    {
        id_plaza: {
            type: DataTypes.NUMBER,
        },
        descripcion: {
            type: DataTypes.STRING,
        },
        id_renglon: {
            type: DataTypes.NUMBER,
        },
        id_departamento: {
            type: DataTypes.NUMBER,
        },
        id_jornada: {
            type: DataTypes.NUMBER,
        },
    },
    {
        timestamps: true,
    }
);

const PlazaView = sequelize.define(
    "vista_listar_plazas",
    {
        id_plaza: {
            type: DataTypes.NUMBER,
        },
        plaza: {
            type: DataTypes.STRING,
        },
        descripcion: {
            type: DataTypes.STRING,
        },
        id_renglon: {
            type: DataTypes.NUMBER,
        },
        renglon: {
            type: DataTypes.STRING,
        },
        id_departamento: {
            type: DataTypes.NUMBER,
        },
        departamento: {
            type: DataTypes.STRING,
        },
        id_jornada: {
            type: DataTypes.NUMBER,
        },
        jornada: {
            type: DataTypes.STRING,
        },
        hora_inicio: {
            type: DataTypes.TIME,
        },
        hora_fin: {
            type: DataTypes.TIME,
        },
    },
    {
        timestamps: true,
    }
);


module.exports = { Plaza, PlazaView };