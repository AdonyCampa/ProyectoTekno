const { response } = require('express');
const { Plaza } = require('../models/plazas')
const { handleHttpError, handleErrorResponse } = require('../helpers/handleError');
const { matchedData } = require('express-validator');
const { Empleados } = require('../models/empleados');
const { DescuentosPlazasView } = require('../models/descuentos_plaza');



// Ver Empleados
const getEmpleados = async(req, res = response) => {

    try {
        // Obtener datos
        const empelados = await Empleados.findAll({ where : {estado: 'contratado'} });

        const datos = await Promise.all(empelados.map( async puestos =>{
            const {id,id_plaza, nombres, apellidos, plaza, dpi, nit, renglon, departamento, sueldo, fecha_inicio, fecha_fin, estado  } = puestos;

            let descuentos = await DescuentosPlazasView.sum(('descuento'),{ where : {id_plaza: id_plaza}});
            const bonificacion = 250;

            let descuentoTotal = sueldo * descuentos;

            let sueldoLiquido = (sueldo - descuentoTotal) + bonificacion;

            return {id, nombres, apellidos, plaza, dpi, nit, renglon, departamento, sueldo,bonificacion, fecha_inicio, fecha_fin, estado, descuentoTotal ,sueldoLiquido};

        }));

        // Mostrar datos
        res.send( datos );
    } catch (error) {
        console.log(error);
        // Mostrar mensaje de error en la peticion
        handleHttpError(res, "ERROR GET Empleados");
    }
}

module.exports = {
    getEmpleados
}