const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/mysql');


const ReferenciasPersonales = sequelize.define(
    "referencias_personales",
    {
        nombres: {
            type: DataTypes.STRING,
        },
        ocupacion: {
            type: DataTypes.STRING,
        },
        telefono: {
            type: DataTypes.STRING,
        },
        id_expediente: {
            type: DataTypes.INTEGER,
        },
    },
    {
        timestamps: true,
    }
);


module.exports = ReferenciasPersonales;