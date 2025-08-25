const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/mysql');


const Usuario = sequelize.define(
    "usuarios",
    {
        usuario: {
            type: DataTypes.STRING,
        },
        nombres: {
            type: DataTypes.STRING,
        },
        password: {
            type: DataTypes.STRING,
        },
        estado: {
            type: DataTypes.BOOLEAN
        },
        imagen: {
            type: DataTypes.STRING,
        },
        rol: {
            type: DataTypes.STRING,
        }
    },
    {
        timestamps: true,
    }
);


module.exports = Usuario;