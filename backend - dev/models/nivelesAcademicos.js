const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/mysql');


const NivelAcademico = sequelize.define(
    "nivelesacademicos",
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


module.exports = NivelAcademico;