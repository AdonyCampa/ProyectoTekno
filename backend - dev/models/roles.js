const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/mysql');


const Roles = sequelize.define(
    "roles",
    {
        rol: {
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

module.exports = Roles;