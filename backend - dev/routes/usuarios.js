const { Router } = require('express');
const { getUsuarios, createUsuario, getUsuario, deleteUsuario, updateUsuario, updatePasswordUsuario} = require('../controllers/usuarios');
const { validarUsuario, validarPasswordUsuario } = require('../validators/usuarios');



const router = Router();


// Listar usuarios creados
router.get( '/', getUsuarios);

// Crear un nuevo usuario
router.post( '/new', validarUsuario, createUsuario);

// Ver usuario seleccionado
router.get( '/:id', getUsuario );

// Eliminar usuario seleccionado
router.delete( '/eliminar/:id', deleteUsuario );

// Editar usuario seleccionado
router.put( '/editar/:id', updateUsuario );

// Editar contraseña de usuario seleccionado
router.put( '/editarPassword/:id', validarPasswordUsuario , updatePasswordUsuario );


module.exports = router;  