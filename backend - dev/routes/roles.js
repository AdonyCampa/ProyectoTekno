const { Router } = require('express');
const { getRol, createRol, deleteRol, updateRol, getRoles } = require('../controllers/roles');
const { validarRol } = require('../validators/roles');



const router = Router();

// Crear un nuevo rol
router.post('/new', validarRol, createRol);

// Listar roles creados
router.get('/', getRoles);

// Ver Rol seleccionado
router.get('/:id', getRol);

// Eliminar Rol seleccionado
router.delete('/eliminar/:id', deleteRol);

// Editar Rol seleccionado
router.put('/editar/:id', validarRol, updateRol);


module.exports = router;  