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
        apellidos: {
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
            type: DataTypes.INTEGER,
        },
        correo: {
            type: DataTypes.STRING,
        },
        direccion: {
            type: DataTypes.STRING,
        },
        dpi: {
            type: DataTypes.STRING,
        }
    },
    {
        timestamps: true,
    }
);


module.exports = Usuario;