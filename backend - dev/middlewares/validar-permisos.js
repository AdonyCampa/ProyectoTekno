const { response } = require("express");
const { Permiso, Modulo } = require("../models");

/**
 * Middleware para validar permisos del usuario
 * @param {string} moduloSlug - Slug del módulo (ej: 'caja', 'ventas')
 * @param {string} accion - Acción a validar ('crear', 'leer', 'actualizar', 'eliminar')
 */
const validarPermisos = (moduloSlug, accion) => {
  return async (req, res = response, next) => {
    try {
      // Verificar que el usuario esté autenticado
      if (!req.usuario || !req.usuario.rol_id) {
        return res.status(401).json({
          success: false,
          message: "No autenticado",
        });
      }

      const { rol_id } = req.usuario;

      // Buscar el módulo por slug
      const modulo = await Modulo.findOne({
        where: { slug: moduloSlug, estado: "activo" },
      });

      if (!modulo) {
        return res.status(404).json({
          success: false,
          message: "Módulo no encontrado",
        });
      }

      // Buscar permisos del rol para ese módulo
      const permiso = await Permiso.findOne({
        where: {
          rol_id,
          modulo_id: modulo.id,
        },
      });

      // Si no hay permisos definidos para este módulo, denegar acceso
      if (!permiso) {
        return res.status(403).json({
          success: false,
          message: "No tienes permisos para acceder a este módulo",
        });
      }

      // Verificar la acción específica
      const tienePermiso = permiso[accion];

      if (!tienePermiso) {
        return res.status(403).json({
          success: false,
          message: `No tienes permiso para ${getAccionTexto(
            accion
          )} en este módulo`,
        });
      }

      // Si tiene permiso, continuar
      next();
    } catch (error) {
      console.error("Error al validar permisos:", error);
      return res.status(500).json({
        success: false,
        message: "Error al validar permisos",
        error: error.message,
      });
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
      return res.status(401).json({
        success: false,
        message: "No autenticado",
      });
    }

    const { Rol } = require("../models");
    const rol = await Rol.findByPk(req.usuario.rol_id);

    if (!rol || rol.nombre.toLowerCase() !== "administrador") {
      return res.status(403).json({
        success: false,
        message:
          "Acceso denegado. Solo administradores pueden realizar esta acción",
      });
    }

    next();
  } catch (error) {
    console.error("Error al verificar rol de administrador:", error);
    return res.status(500).json({
      success: false,
      message: "Error al verificar permisos",
      error: error.message,
    });
  }
};

/**
 * Obtener todos los permisos del usuario autenticado
 */
const obtenerPermisosUsuario = async (req, res = response) => {
  try {
    if (!req.usuario || !req.usuario.rol_id) {
      return res.status(401).json({
        success: false,
        message: "No autenticado",
      });
    }

    const permisos = await Permiso.findAll({
      where: { rol_id: req.usuario.rol_id },
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

    res.status(200).json({
      success: true,
      data: permisos,
    });
  } catch (error) {
    console.error("Error al obtener permisos del usuario:", error);
    return res.status(500).json({
      success: false,
      message: "Error al obtener permisos",
      error: error.message,
    });
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
