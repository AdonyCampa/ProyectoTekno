const { response } = require('express');
const {Plaza, PlazaView} = require('../models/plazas');
const { handleHttpError, handleErrorResponse } = require('../helpers/handleError');
const { matchedData } = require('express-validator');
const DescuentoExpediente = require('../models/descuentos_plaza');
const { DescuentoPlaza, DescuentosPlazasView } = require('../models/descuentos_plaza');


// Ver Plaza
const getPlaza = async(req, res = response) => {

    try {
        // Ver Plaza seleccionado
        const { id } = req.params;
        const datos = await Plaza.findByPk(id);
        // Comprobar si existe el id ingresado
        if( !datos ){
            // Mostrar mensaje de error
            handleErrorResponse(res, "ID_NO_EXISTS", 404);
            return;           
        }

        const descuentos = await DescuentoExpediente.findAll({ where : {id_expediente: id}});
        const plaza = { datos, descuentos };
        // Generar respuesta exitosa
        res.send(plaza);
    } catch (error) {
        handleHttpError(res, "ERROR GET Plaza");
    }
}

// Ver Plazas
const getPlazas = async(req, res = response) => {

    try {
        // Obtener datos
        const datos = await PlazaView.findAll();

        const plazas = await Promise.all(datos.map( async puestos =>{
            const {id, id_plaza, plaza, descripcion, id_renglon, renglon, id_departamento, departamento, id_jornada, jornada, hora_inicio, hora_fin } = puestos;

            const descuentos = await DescuentosPlazasView.findAll({ where : {id_plaza: id}});
            return {id, id_plaza, plaza, descripcion, id_renglon, renglon, id_departamento, departamento, id_jornada, jornada, hora_inicio, hora_fin, descuentos};

        }));
        
        // Mostrar datos
        res.send( plazas );
    } catch (error) {
        // Mostrar mensaje de error en la peticion
        console.log(error);
        handleHttpError(res, "ERROR GET Plazas");
    }
}

// Agregar un Plaza nuevo
const createPlaza = async(req, res = response) => {

    try {

        // Limpiar Datos
        const body = matchedData(req);
        const {descuentos, ...plaza} = body

        // Crear un nuevo Plaza
        const plazaRes = await Plaza.create(plaza);

        // Crear los demas registros que vienen con el Plaza
        if(descuentos){

            const datos = descuentos.map(element => {
                return {'id_descuento': element.id,'id_plaza': plazaRes.id};
            });
            await DescuentoPlaza.bulkCreate(datos);
        }

        const data = {
            ok: true,
            msg: 'Plaza creada exitosamente'
        };
        // Generar respuesta exitosa
        res.send(data);   
    } catch (error) {
        console.log(error);
        handleHttpError(res, "ERROR CREATE Plaza")
    }
}

// Editar Plaza seleccionado
const updatePlaza = async(req, res = response) => {

    try {
        // Editar Plaza seleccionado
        const { id } = req.params;

        // Limpiar Datos
        const body = matchedData(req);

        console.log(body);
        const plaza = await Plaza.findByPk(id);
        // Checkear si el Requisito existe
        if(!plaza) {
            handleErrorResponse(res, "Plaza_NOT_EXISTS", 404);
            return;
        }

         // Crear un nuevo Plaza
        await plaza.update(body.plaza);

        console.log(body.plaza);

        // Crear los demas registros que vienen con el Plaza
        if(body.descuentos){

            await DescuentoPlaza.destroy({ where : {id_plaza: id} });

            const datos = body.descuentos.map(element => {
                return {'id_descuento': element.id,'id_plaza': id};
            });
            await DescuentoPlaza.bulkCreate(datos);
        }

        // Generar respuesta exitosa
        const data = {
            ok: true,
            msg: 'Plaza actualizado exitosamente',
            plaza
        }
        res.send(data);
    } catch (error) {
        console.log(error);
        handleHttpError(res, "ERROR UPDATE Plaza")
    }
}

// Eliminar Plaza
const deletePlaza = async(req, res = response) => {

    try {
        // Eliminar Plaza seleccionado
        const { id } = req.params;
        const { body } = req
        // Buscar si existe el registro
        const plaza = await Plaza.findByPk( id );
        if(!plaza) {
            handleErrorResponse(res, "Plaza_NOT_EXISTS", 404);
            return;
        }
        await DescuentoPlaza.destroy({ where : {id_plaza: id} });
        // Comprobar que el Plaza este inactivo

        // Eliminando datos
        await plaza.destroy();

        // Generar respuesta exitosa
        const data = {
            ok: true,
            msg: 'Plaza eliminado exitosamente',
            plaza
        }
        res.send(data);

    } catch (error) {
        console.log(error);
        handleHttpError(res, "ERROR DELETE Plaza")
    }
}

module.exports = {
    getPlaza,
    getPlazas,
    createPlaza,
    updatePlaza,
    deletePlaza
}