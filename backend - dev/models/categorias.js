const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/mysql');


const Categorias = sequelize.define(
    "categorias",
    {
        categoria: {
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

module.exports = Categorias;