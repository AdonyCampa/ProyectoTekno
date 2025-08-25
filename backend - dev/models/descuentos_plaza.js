const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/mysql');


const DescuentoPlaza = sequelize.define(
    "descuentos_plazas",
    {
        id_descuento: {
            type: DataTypes.INTEGER,
        },
        id_plaza: {
            type: DataTypes.INTEGER,
        }
    },
    {
        timestamps: true,
    }
);


const DescuentosPlazasView = sequelize.define(
    "vista_listar_descuentos_plazas",
    {

        id_descuento: {
            type: DataTypes.INTEGER,
        },
        nombre: {
            type: DataTypes.STRING,
        },
        descuento: {
            type: DataTypes.DECIMAL,
        },
        id_plaza: {
            type: DataTypes.INTEGER,
        }
    },
    {
        timestamps: true,
    }
);


module.exports = { DescuentoPlaza, DescuentosPlazasView };