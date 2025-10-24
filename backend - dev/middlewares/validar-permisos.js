const { response } = require("express");
const { Permiso, Modulo } = require("../models");
const {
  handleHttpError,
  handleErrorResponse,
} = require("../helpers/handleError");

/**
 * Middleware para validar permisos del usuario
 * @param {string} moduloSlug - Slug del módulo (ej: 'caja', 'ventas')
 * @param {string} accion - Acción a validar ('crear', 'leer', 'actualizar', 'eliminar')
 */
const validarPermisos = (moduloSlug, accion) => {
  return async (req, res = response, next) => {
    try {
      // Verificar que el usuario esté autenticado
      if (!req.usuario || !req.rol_id) {
        handleErrorResponse(res, "No autenticado", 404);
        return;
      }

      // Buscar el módulo por slug
      const modulo = await Modulo.findOne({
        where: { slug: moduloSlug, estado: "activo" },
      });

      if (!modulo) {
        handleErrorResponse(res, "Módulo no encontrado", 404);
        return;
      }

      // Buscar permisos del rol para ese módulo
      const permiso = await Permiso.findOne({
        where: { rol_id: req.rol_id, modulo_id: modulo.id },
      });

      // Si no hay permisos definidos para este módulo, denegar acceso
      if (!permiso) {
        handleErrorResponse(
          res,
          "No tienes permisos para acceder a este módulo",
          404
        );
        return;
      }

      // Verificar la acción específica
      const tienePermiso = permiso[accion];

      if (!tienePermiso) {
        handleErrorResponse(
          res,
          `No tienes permiso para ${getAccionTexto(accion)} en este módulo`,
          404
        );
        return;
      }

      // Si tiene permiso, continuar
      next();
    } catch (error) {
      console.error("Error al validar permisos:", error);
      handleHttpError(res, "Error al validar permisos");
    }
  };
};

/**
 * Obtener texto descriptivo de la acción
 */
const getAccionTexto = (accion) => {
  const acciones = {
    crear: "crear registros",
    leer: "ver registros",
    actualizar: "actualizar registros",
    eliminar: "eliminar registros",
  };
  return acciones[accion] || accion;
};

/**
 * Middleware para verificar si es administrador
 */
const esAdministrador = async (req, res = response, next) => {
  try {
    if (!req.usuario || !req.usuario.rol_id) {
      handleErrorResponse(res, "No autenticado", 404);
      return;
    }

    const { Rol } = require("../models");
    const rol = await Rol.findByPk(req.usuario.rol_id);

    if (!rol || rol.nombre.toLowerCase() !== "administrador") {
      handleErrorResponse(
        res,
        "Acceso denegado. Solo administradores pueden realizar esta acción",
        404
      );
      return;
    }

    next();
  } catch (error) {
    console.error("Error al verificar rol de administrador:", error);
    handleHttpError(res, "Error al verificar rol de administrador");
  }
};

/**
 * Obtener todos los permisos del usuario autenticado
 */
const obtenerPermisosUsuario = async (req, res = response) => {
  try {
    if (!req.usuario || !req.rol_id) {
      handleErrorResponse(res, "No autenticado", 401);
      return;
    }

    const permisos = await Permiso.findAll({
      where: { rol_id: req.rol_id },
      include: [
        {
          model: Modulo,
          as: "modulo",
          where: { estado: "activo" },
          attributes: [
            "id",
            "nombre",
            "slug",
            "descripcion",
            "icono",
            "ruta",
            "orden",
          ],
        },
      ],
      order: [[{ model: Modulo, as: "modulo" }, "orden", "ASC"]],
    });

    const data = {
      success: true,
      data: permisos,
    };
    res.send(data);
  } catch (error) {
    console.error("Error al obtener permisos del usuario:", error);
    handleHttpError(res, "Error al obtener permisos del usuario");
  }
};

/**
 * Verificar si el usuario tiene un permiso específico
 */
const tienePermiso = async (usuario_id, moduloSlug, accion) => {
  try {
    const { Usuario } = require("../models");

    const usuario = await Usuario.findByPk(usuario_id);
    if (!usuario) return false;

    const modulo = await Modulo.findOne({
      where: { slug: moduloSlug, estado: "activo" },
    });
    if (!modulo) return false;

    const permiso = await Permiso.findOne({
      where: {
        rol_id: usuario.rol_id,
        modulo_id: modulo.id,
      },
    });

    return permiso ? permiso[accion] : false;
  } catch (error) {
    console.error("Error al verificar permiso:", error);
    return false;
  }
};

module.exports = {
  validarPermisos,
  esAdministrador,
  obtenerPermisosUsuario,
  tienePermiso,
};
