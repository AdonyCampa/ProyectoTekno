const { check } = require('express-validator');
const { validateResults } = require("../middlewares/validar-campos");

const validarExpediente = [
    check("datos.nombres").exists().notEmpty(),
    check("datos.apellidos").exists().notEmpty(),
    check("datos.dpi").exists().notEmpty(),
    check("datos.nit").optional(),
    check("datos.igss").optional(),
    check("datos.correo").optional(),
    check("datos.direccion").optional(),
    check("datos.fecha_nacimiento").optional(),
    check("datos.estado_civil").optional(),
    check("datos.genero").optional(),
    check("datos.hijos").optional(),
    check("datos.licencia").optional(),
    check("datos.telefono").optional(),
    check("historialAcademico.*.id_nivel").exists().notEmpty(),
    check("historialAcademico.*.establecimiento").exists().notEmpty(),
    check("historialAcademico.*.titulo").exists().notEmpty(),
    check("historialAcademico.*.fecha").exists().notEmpty(),
    check("historialLaboral.*.empresa").exists().notEmpty(),
    check("historialLaboral.*.puesto").exists().notEmpty(),
    check("historialLaboral.*.direccion").exists().notEmpty(),
    check("historialLaboral.*.telefono").exists().notEmpty(),
    check("historialLaboral.*.fecha_inicio").exists().notEmpty(),
    check("historialLaboral.*.fecha_fin").exists().notEmpty(),
    check("referencias.*.nombres").exists().notEmpty(),
    check("referencias.*.ocupacion").exists().notEmpty(),
    check("referencias.*.telefono").exists().notEmpty(),
    check("requisitos.*.estado").exists().notEmpty(),
    check("requisitos.*.fecha_vencimiento").exists().notEmpty(),
    check("requisitos.*.id_requisito").exists().notEmpty(),
    (req, res, next) => {
        return validateResults(req, res, next)
    }
];

const validarExpedienteUpdate = [

    //Validaciones Datos Personales
    check("datos.nombres").optional(),
    check("datos.apellidos").optional(),
    check("datos.dpi").optional(),
    check("datos.nit").optional(),
    check("datos.igss").optional(),
    check("datos.correo").optional(),
    check("datos.direccion").optional(),
    check("datos.fecha_nacimiento").optional(),
    check("datos.estado_civil").optional(),
    check("datos.genero").optional(),
    check("datos.hijos").optional(),
    check("datos.licencia").optional(),
    check("datos.telefono").optional(),

    //Validaciones Historial Laboral
    check("historialAcademico.*.id").optional(),
    check("historialAcademico.*.id_nivel").optional(),
    check("historialAcademico.*.establecimiento").optional(),
    check("historialAcademico.*.titulo").optional(),
    check("historialAcademico.*.fecha").optional(),
    check("historialAcademico.*.id_expediente").optional(),
    check("historialAcademico.*.action").optional(),
    
    // Validaciones Historial Laboral
    check("historialLaboral.*.id").optional(),
    check("historialLaboral.*.empresa").optional(),
    check("historialLaboral.*.puesto").optional(),
    check("historialLaboral.*.direccion").optional(),
    check("historialLaboral.*.telefono").optional(),
    check("historialLaboral.*.fecha_inicio").optional(),
    check("historialLaboral.*.fecha_fin").optional(),
    check("historialLaboral.*.id_expediente").optional(),
    check("historialLaboral.*.action").optional(),

    //Validaciones Referencias
    check("referencias.*.id").optional(),
    check("referencias.*.nombres").optional(),
    check("referencias.*.ocupacion").optional(),
    check("referencias.*.telefono").optional(),
    check("referencias.*.id_expediente").optional(),
    check("referencias.*.action").optional(),

    //Validaciones Requisitos
    check("requisitos.*.id").optional(),
    check("requisitos.*.estado").optional(),
    check("requisitos.*.fecha_vencimiento").optional(),
    check("requisitos.*.id_requisito").optional(),
    check("requisitos.*.id_expediente").optional(),
    check("requisitos.*.action").optional(),
    (req, res, next) => {
        return validateResults(req, res, next)
    }
];


module.exports = { validarExpediente, validarExpedienteUpdate }