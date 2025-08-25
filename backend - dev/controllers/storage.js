const { response } = require('express');
const Storage = require('../models/storage');
const PUBLIC_URL = process.env.PUBLIC_URL;


// Agregar un usuario nuevo
const getStorage = async(req, res = response) => {

    try {
        // Listar usuarios creados
        const usuarios = await Usuario.find();

        // Generar respuesta exitosa
        return res.status(200).json(
            usuarios
        );

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        });
    }
}

// Ver usuario
const getStorages = async(req, res = response) => {

    try {
        // Ver usuario seleccionado
        const id = req.params.id;
        const storage = await Storage.findById(id);

        // Generar respuesta exitosa
        return res.status(200).json(
            storage
        );

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        });
    }
}

// Agregar un usuario nuevo
const createStorage = async(req, res = response) => {

    const { body, file } = req;

    try {
        
        console.log(file);

        const fileData = {
            filename: file.filename,
            url:`${PUBLIC_URL}/${file.filename}`
        }

        const data = await Storage.create(fileData);

        return res.status(200).json({
            ok: true,
            msg: 'Archivo guardado correctamente',
            data
        });

        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        });
    }
}

// Eliminar usuario
const deleteStorage = async(req, res = response) => {

    try {
        // Eliminar usuario seleccionado
        const id = req.params.id;
        const usuario = await Usuario.findByIdAndDelete(id);

        // Generar respuesta exitosa
        return res.status(200).json({
            msg: "Usuario eliminado correctamente",
            usuario
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        });
    }
}

// Editar usuario seleccionado
const updateStorage = async(req, res = response) => {

    try {
        // Editar usuario seleccionado
        const id = req.params.id;
        const data = req.body;
        const usuario = await Usuario.findByIdAndUpdate(id,data, { useFindAndModify: false });

        // Generar respuesta exitosa
        return res.status(200).json({
            msg: "Usuario editado correctamente",
            data
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        });
    }
}


module.exports = {
    createStorage,
    getStorages,
    getStorage,
    deleteStorage,
    updateStorage
}