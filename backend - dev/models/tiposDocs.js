const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/mysql');


const TipoDoc = sequelize.define(
    "tiposdocs",
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


module.exports = TipoDoc;