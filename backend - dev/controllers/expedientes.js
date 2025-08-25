const { response } = require('express');
const {Expediente} = require('../models/expedientes');
const { handleHttpError, handleErrorResponse } = require('../helpers/handleError');
const { matchedData } = require('express-validator');
const HistorialAcademico = require('../models/historial_academico');
const HistorialLaboral = require('../models/historial_laboral');
const ReferenciasPersonales = require('../models/referencias_personales')
const RequisitoExpediente = require('../models/requisitos_expediente')


// Ver expediente
const getExpediente = async(req, res = response) => {

    try {
        // Ver expediente seleccionado
        const { id } = req.params;
        const datos = await Expediente.findByPk(id);
        // Comprobar si existe el id ingresado
        if( !datos ){
            // Mostrar mensaje de error
            handleErrorResponse(res, "ID_NO_EXISTS", 404);
            return;           
        }

        const historialAcademico = await HistorialAcademico.findAll({ where : {id_expediente: id}});
        const historialLaboral = await HistorialLaboral.findAll({ where : {id_expediente: id}});
        const referencias = await ReferenciasPersonales.findAll({ where : {id_expediente: id}});
        const requisitos = await RequisitoExpediente.findAll({ where : {id_expediente: id}});
        const expediente = { datos, historialAcademico, historialLaboral, referencias, requisitos };
        // Generar respuesta exitosa
        res.send(expediente);
    } catch (error) {
        handleHttpError(res, "ERROR GET expediente");
    }
}

// Ver expedientes
const getExpedientes = async(req, res = response) => {

    try {
        // Obtener datos
        const datos = await Expediente.findAll();

        const expedientes = await Promise.all(datos.map( async personal =>{
            const {id, nombres, apellidos, dpi, nit, igss, fecha_nacimiento,direccion,telefono,correo,genero,estado_civil, hijos, licencia } = personal;
            const datos = {id, nombres, apellidos, dpi, nit, igss, fecha_nacimiento,direccion,telefono,correo,genero,estado_civil, hijos, licencia }
            const historialAcademico = await HistorialAcademico.findAll({ where : {id_expediente: id}});
            const historialLaboral = await HistorialLaboral.findAll({ where : {id_expediente: id}});
            const referencias = await ReferenciasPersonales.findAll({ where : {id_expediente: id}});
            const requisitos = await RequisitoExpediente.findAll({ where : {id_expediente: id}});
            return {datos, historialAcademico, historialLaboral,referencias, requisitos };

        }));
        
        // Mostrar datos
        res.send( expedientes );
    } catch (error) {
        console.log(error);
        // Mostrar mensaje de error en la peticion
        handleHttpError(res, "ERROR GET expedientes");
    }
}

// Agregar un expediente nuevo
const createExpediente = async(req, res = response) => {

    try {

        // Limpiar Datos
        const body = matchedData(req);

        // Verificar si el DPI ya existe
        const checkIsExist = await Expediente.findOne({ where : {dpi: body.datos.dpi} });
        if (checkIsExist) {
            handleErrorResponse(res, "DPI_EXISTS", 401);
            return;
        }

        // Crear un nuevo expediente
        const expediente = await Expediente.create(body.datos);

        console.log(body.datos);

        // Crear los demas registros que vienen con el expediente
        if(body.historialAcademico){

            const datos = body.historialAcademico.map(element => {
                return {'id_nivel': element.id_nivel, 'establecimiento': element.establecimiento,'titulo': element.titulo, 'fecha': element.fecha,'id_expediente': expediente.id};
            });
            console.log(datos);
            const historial = await HistorialAcademico.bulkCreate(datos);
            console.log(historial);
        }
        if(body.historialLaboral){
            const datos = body.historialLaboral.map(element => {

                return { 'empresa': element.empresa,'direccion': element.direccion, 'telefono': element.telefono, 'puesto': element.puesto, 'fecha_inicio': element.fecha_inicio, 'fecha_fin': element.fecha_fin, 'id_expediente': expediente.id };
                
            });
            console.log(datos);
            const historial = await HistorialLaboral.bulkCreate(datos);
            console.log(historial);
        }
        if(body.referencias){
            const datos = body.referencias.map(element => {

                return {'nombres': element.nombres, 'ocupacion': element.ocupacion, 'telefono': element.telefono, 'id_expediente':expediente.id};
                
            });
            console.log(datos);
            const referencias = await ReferenciasPersonales.bulkCreate(datos);
            console.log(referencias);
        }
        if(body.requisitos){
            const datos = body.requisitos.map(element => {

                return {'estado': element.estado, 'fecha_vencimiento': element.fecha_vencimiento, 'id_requisito' : element.id_requisito, 'id_expediente':expediente.id};
                
            });
            console.log(datos);
            const requisitos = await RequisitoExpediente.bulkCreate(datos);
            console.log(requisitos);
        }

        const data = {
            ok: true,
            msg: 'expediente creado exitosamente',
        };
        // Generar respuesta exitosa
        res.send(data);   
    } catch (error) {
        console.log(error);
        handleHttpError(res, "ERROR CREATE expediente")
    }
}

// Editar expediente seleccionado
const updateExpediente = async(req, res = response) => {

    try {
        // Editar expediente seleccionado
        const { id } = req.params;


        
        // Limpiar Datos
        const body = matchedData(req);
        const expediente = await Expediente.findByPk(id);
        // Checkear si el Requisito existe
        if(!expediente) {
            handleErrorResponse(res, "EXPEDIENTE_NOT_EXISTS", 404);
            return;
        }

         // Crear un nuevo expediente
        await expediente.update(body.datos);

        console.log(body.datos);

        // Crear los demas registros que vienen con el expediente
        if(body.historialAcademico){
            const updateAcademicos = await Promise.all(body.historialAcademico.map( async academico =>{
                const {id, action, ...body} = academico;
                if(id){
                    const findAcademico = await HistorialAcademico.findByPk(id)

                    if (!findAcademico){
                        return "HISTORIAL_NOT_EXISTS" ;
                        }

                    if(!action){
                        await findAcademico.update(body);
                        return 'update'
                    }
                    if(action === 'delete'){
                        await findAcademico.destroy();
                        return 'delete'
                    }

                }else {
                    if(action === 'create'){
                        await HistorialAcademico.create(body);
                        return 'create'
                    }
                }
            }));
            console.log(updateAcademicos);
        }
        if(body.historialLaboral){
            const updateLaborales = await Promise.all(body.historialLaboral.map( async laboral =>{
                const {id, action, ...body} = laboral;
                if(id){
                    const findLaboral = await HistorialLaboral.findByPk(id)

                    if (!findLaboral){
                        return "HISTORIAL_NOT_EXISTS" ;
                        }

                    if(!action ){
                        await findLaboral.update(body);
                        return 'update'
                    }
                    if(action === 'delete'){
                        await findLaboral.destroy();
                        return 'delete'
                    }

                }else {
                    if(action === 'create'){
                        await HistorialLaboral.create(body);
                        return 'create'
                    }
                }
            }));
            console.log(updateLaborales);
        }
        if(body.referencias){
            const updateReferencias = await Promise.all(body.referencias.map( async referencia =>{
                const {id, action, ...body} = referencia;
                if(id){
                    const findReferencia = await ReferenciasPersonales.findByPk(id)

                    if (!findReferencia){
                        return "HISTORIAL_NOT_EXISTS" ;
                        }

                    if(!action){
                        await findReferencia.update(body);
                        return 'update'
                    }
                    if(action === 'delete'){
                        await findReferencia.destroy();
                        return 'delete'
                    }

                }else {
                    if(action === 'create'){
                        await ReferenciasPersonales.create(body);
                        return 'create'
                    }
                }
            }));
            console.log(updateReferencias);
        }
        if(body.requisitos){
            const updateRequisitos = await Promise.all(body.requisitos.map( async requisito =>{
                const {id, action, ...body} = requisito;
                if(id){
                    const findRequisito = await RequisitoExpediente.findByPk(id)

                    if (!findRequisito){
                        return "HISTORIAL_NOT_EXISTS" ;
                        }

                    if(!action){
                        await findRequisito.update(body);
                        return 'update'
                    }
                    if(action === 'delete'){
                        await findRequisito.destroy();
                        return 'delete'
                    }

                }else {
                    if(action === 'create'){
                        await RequisitoExpediente.create(body);
                        return 'create'
                    }
                }
            }));
            console.log(updateRequisitos);
        }

        // Generar respuesta exitosa
        const data = {
            ok: true,
            msg: 'Expediente actualizado exitosamente',
            expediente
        }
        res.send(data);
    } catch (error) {
        console.log(error);
        handleHttpError(res, "ERROR UPDATE expediente")
    }
}

// Eliminar expediente
const deleteExpediente = async(req, res = response) => {

    try {
        // Eliminar expediente seleccionado
        const { id } = req.params;
        const { body } = req
        // Buscar si existe el registro
        const expediente = await Expediente.findByPk( id );
        if(!expediente) {
            handleErrorResponse(res, "expediente_NOT_EXISTS", 404);
            return;
        }

        // Comprobar que el expediente este inactivo

        // Eliminando datos
        await expediente.destroy(body);

        // Generar respuesta exitosa
        const data = {
            ok: true,
            msg: 'expediente eliminado exitosamente',
            expediente
        }
        res.send(data);

    } catch (error) {
        handleHttpError(res, "ERROR DELETE expediente")
    }
}

module.exports = {
    getExpediente,
    getExpedientes,
    createExpediente,
    updateExpediente,
    deleteExpediente
}