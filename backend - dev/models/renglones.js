const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/mysql');


const Renglon = sequelize.define(
    "renglones",
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


module.exports = Renglon;