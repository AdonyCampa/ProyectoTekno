const { response } = require('express');
const {Archivo, ArchivoView} = require('../models/archivos');
const { handleHttpError, handleErrorResponse } = require('../helpers/handleError');
const TipoDoc = require('../models/tiposDocs');


// Ver archivo
const getArchivo = async(req, res = response) => {

    try {
        // Ver archivo seleccionado
        const { id } = req.params;
        const archivo = await Archivo.findByPk(id);
        // Comprobar si existe el id ingresado
        if( !archivo ){
            // Mostrar mensaje de error
            handleErrorResponse(res, "ID_NO_EXISTS", 404);
            return;           
        }
        // Generar respuesta exitosa
        res.send({ archivo });
    } catch (error) {
        handleHttpError(res, "ERROR GET archivo");
    }
}

// Ver archivos
const getArchivos = async(req, res = response) => {

    try {
        // Obtener datos
        const archivos = await ArchivoView.findAll();
        // Mostrar datos
        res.send( archivos );
    } catch (error) {
        console.log(error);
        // Mostrar mensaje de error en la peticion
        handleHttpError(res, "ERROR GET archivos");
    }
}

// Agregar un archivo nuevo
const createArchivo = async(req, res = response) => {

    try {
        // Limpiar los datos
        const { asunto, descripcion, estado, cod_ref, fecha, fecha_recepcion, id_tipo } = req.body;
        const body = { asunto, descripcion, estado, cod_ref, fecha, fecha_recepcion, id_tipo };
        // Verificar la existencia del archivo

        console.log(body);
        const checkIsExist = await Archivo.findOne({ where : {cod_ref: body.cod_ref} });
        if (checkIsExist) {
            handleErrorResponse(res, "COD_REF_EXISTS", 401);
            return;
        }
        // Verificar si id tipo existe
        const checkIdTipo = await TipoDoc.findOne({ where : {id: body.id_tipo} });
        if (!checkIdTipo) {
            handleErrorResponse(res, "TIPO_NOT_EXISTS", 401);
            return;
        }

        // Crear archivo de DB
        const archivo = await Archivo.create(body);
        const data = {
            ok: true,
            msg: 'Archivo creado exitosamente',
            archivo
        };
        // Generar respuesta exitosa
        res.send(data);   
    } catch (error) {
        handleHttpError(res, "ERROR CREATE ARCHIVO")
    }
}

// Editar archivo seleccionado
const updateArchivo = async(req, res = response) => {

    try {
        // Editar archivo seleccionado
        const { id } = req.params;
        const { asunto, descripcion, estado, cod_ref, fecha, fecha_recepcion, id_tipo } = req.body;
        const body = { asunto, descripcion, estado, cod_ref, fecha, fecha_recepcion, id_tipo };
        const archivo = await Archivo.findByPk( id );
        // Checkear si el archivo existe
        if(!archivo) {
            handleErrorResponse(res, "PLAZA_NOT_EXISTS", 404);
            return;
        }
        // verificar si el nombre ya existe en la DB
        if(!body.cod_ref === archivo.cod_ref){
            const checkIsExist = await archivo.findOne({ where : {cod_ref: body.cod_ref} });
            if (checkIsExist) {
                handleErrorResponse(res, "archivo_EXISTS", 401);
                return;
            } 
        }
        await archivo.update(body);
        // Generar respuesta exitosa
        const data = {
            ok: true,
            msg: 'Archivo actualizado exitosamente',
            archivo
        }
        res.send(data);
    } catch (error) {
        handleHttpError(res, "ERROR UPDATE archivo")
    }
}

// Eliminar archivo
const deleteArchivo = async(req, res = response) => {

    try {
        // Eliminar archivo seleccionado
        const { id } = req.params;
        const { body } = req
        // Buscar si existe el registro
        const archivo = await Archivo.findByPk( id );
        if(!archivo) {
            handleErrorResponse(res, "ARCHIVO_NOT_EXISTS", 404);
            return;
        }

        // Comprobar que el archivo este inactivo

        // Eliminando datos
        await archivo.destroy(body);

        // Generar respuesta exitosa
        const data = {
            ok: true,
            msg: 'Archivo eliminado exitosamente',
            archivo
        }
        res.send(data);

    } catch (error) {
        handleHttpError(res, "ERROR DELETE archivo")
    }
}

module.exports = {
    getArchivo,
    getArchivos,
    createArchivo,
    updateArchivo,
    deleteArchivo
}