const { Router } = require('express');
const { getRol, createRol, deleteRol, updateRol } = require('../controllers/roles');



const router = Router();


// Listar roles creados
router.get('/', getRol);

// Crear un nuevo rol
router.post('/new', createRol);

// Ver Rol seleccionado
router.get('/:id', getRol);

// Eliminar Rol seleccionado
router.delete('/eliminar/:id', deleteRol);

// Editar Rol seleccionado
router.put('/editar/:id', updateRol);


module.exports = router;  