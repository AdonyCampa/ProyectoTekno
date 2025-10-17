const { response } = require("express");
const { Rol, Permiso, Modulo, Usuario } = require("../models");

const {
  handleHttpError,
  handleErrorResponse,
} = require("../helpers/handleError");
const { matchedData } = require("express-validator");
const { Op } = require("sequelize");
const sequelize = require("../config/mysql");

// Ver rol
const getRolById = async (req, res = response) => {
  try {
    // Obtener datos desde el frontend
    const { id } = req.params;
    const rol = await Rol.findByPk(id, {
      include: [
        {
          model: Permiso,
          as: "permisos",
          include: [
            {
              model: Modulo,
              as: "modulo",
            },
          ],
        },
      ],
    });
    // Comprobar si existe el id ingresado
    if (!rol) {
      // Mostrar mensaje de error
      handleErrorResponse(res, "ID Rol no existe", 404);
      return;
    }

    const data = {
      succes: true,
      data: rol,
    };
    // Generar respuesta exitosa
    res.send(data);
  } catch (error) {
    console.error("Error al obtener rol:", error);
    handleHttpError(res, "Error al buscar rol");
  }
};
// Ver roles
const getRoles = async (req, res = response) => {
  try {
    const { estado, incluir_permisos } = req.query;

    const whereClause = {};
    if (estado) whereClause.estado = estado;

    const includeOptions = [];

    if (incluir_permisos === "true") {
      includeOptions.push({
        model: Permiso,
        as: "permisos",
        include: [
          {
            model: Modulo,
            as: "modulo",
            attributes: ["id", "nombre", "slug", "icono"],
          },
        ],
      });
    }
    const roles = await Rol.findAll({
      where: whereClause,
      include: includeOptions,
      order: [["created_at", "DESC"]],
    });

    const data = {
      succes: true,
      data: roles,
    };
    // Mostrar datos
    res.send(data);
  } catch (error) {
    console.error("Error al obtener roles:", error);
    // Mostrar mensaje de error en la peticion
    handleHttpError(res, "Error al obtener roles");
  }
};
// Agregar un rol nuevo
const createRol = async (req, res = response) => {
  try {
    // Limpiar los datos
    const body = matchedData(req);
    // Verificar la existencia del rol
    const checkIsExist = await Rol.findOne({ where: { nombre: body.nombre } });
    if (checkIsExist) {
      handleErrorResponse(res, "Rol Existente", 401);
      return;
    }
    // Crear nuevo rol
    const rol = await Rol.create(body);
    const data = {
      succes: true,
      messge: "Rol creado exitosamente",
      data: rol,
    };
    // Generar respuesta exitosa
    res.send(data);
  } catch (error) {
    console.error("Error al crear rol:", error);
    // Error al crear el rol
    handleHttpError(res, "Error al crear Rol!");
  }
};
// Editar rol seleccionado
const updateRol = async (req, res = response) => {
  try {
    // Limpiar los datos
    const { id } = req.params;
    const body = matchedData(req);
    // Checkear id rol existente
    const rol = await Rol.findByPk(id);
    if (!rol) {
      handleErrorResponse(res, "El rol no existe", 404);
      return;
    }
    // Verificar nombre único si cambió
    if (body.nombre && body.nombre !== rol.nombre) {
      const nombreExistente = await Rol.findOne({
        where: { nombre: body.nombre },
      });
      if (nombreExistente) {
        return res.status(400).json({
          success: false,
          message: "El nombre del rol ya existe",
        });
      }
    }

    // Actualizar datos de rol
    await rol.update({
      nombre: body.nombre || rol.nombre,
      descripcion:
        body.descripcion !== undefined ? body.descripcion : rol.descripcion,
      estado: body.estado || rol.estado,
    });
    // Generar respuesta exitosa
    const data = {
      succes: true,
      message: "Rol actualizado exitosamente",
      data: body,
    };
    res.send(data);
  } catch (error) {
    console.error("Error al actualizar rol:", error);
    // Error al editar el rol
    handleHttpError(res, "Error al actualizar Rol");
  }
};
// Eliminar rol
const deleteRol = async (req, res = response) => {
  try {
    // Eliminar usuario seleccionado
    const { id } = req.params;
    // Buscar si existe el registro
    const rol = await Rol.findByPk(id);
    if (!rol) {
      handleErrorResponse(res, "Rol no existente", 404);
      return;
    }

    // Verificar si hay usuarios con este rol
    const usuariosConRol = await Usuario.count({ where: { rol_id: id } });
    if (usuariosConRol > 0) {
      handleErrorResponse(
        res,
        `No se puede eliminar el rol porque hay ${usuariosConRol} usuario(s) asignado(s)`,
        404
      );
      return;
    }

    // Eliminar permisos asociados
    await Permiso.destroy({ where: { rol_id: id } });

    // Eliminar rol
    await rol.destroy();
    // Generar respuesta exitosa
    const data = {
      succes: true,
      message: "Rol eliminado exitosamente",
      data: rol,
    };
    res.send(data);
  } catch (error) {
    console.error("Error al eliminar rol:", error);
    handleHttpError(res, "Error al eliminar rol");
  }
};

/**
 * Asignar/Actualizar permisos a un rol
 */
const asignarPermisos = async (req, res = response) => {
  const transaction = await sequelize.transaction();

  try {
    const { rol_id } = req.params;
    const { permisos } = req.body; // Array de permisos

    // Verificar que el rol existe
    const rol = await Rol.findByPk(rol_id);
    if (!rol) {
      await transaction.rollback();
      handleErrorResponse(res, "Rol no existente", 404);
      return;
    }

    // Eliminar permisos anteriores
    await Permiso.destroy({
      where: { rol_id },
      transaction,
    });

    // Crear nuevos permisos
    const permisosCrear = permisos.map((permiso) => ({
      rol_id,
      modulo_id: permiso.modulo_id,
      crear: permiso.crear || false,
      leer: permiso.leer || false,
      actualizar: permiso.actualizar || false,
      eliminar: permiso.eliminar || false,
    }));

    await Permiso.bulkCreate(permisosCrear, { transaction });

    await transaction.commit();

    // Obtener rol actualizado con permisos
    const rolActualizado = await Rol.findByPk(rol_id, {
      include: [
        {
          model: Permiso,
          as: "permisos",
          include: [
            {
              model: Modulo,
              as: "modulo",
            },
          ],
        },
      ],
    });

    // Generar respuesta exitosa
    const data = {
      succes: true,
      message: "Permisos asignados exitosamente",
      data: rolActualizado,
    };
    res.send(data);
  } catch (error) {
    await transaction.rollback();
    console.error("Error al asignar permisos:", error);
    handleHttpError(res, "Error al asignar permisos");
  }
};

/**
 * Obtener permisos de un rol
 */
const getPermisosPorRol = async (req, res = response) => {
  try {
    const { rol_id } = req.params;

    const permisos = await Permiso.findAll({
      where: { rol_id },
      include: [
        {
          model: Modulo,
          as: "modulo",
        },
      ],
    });

    // Generar respuesta exitosa
    const data = {
      succes: true,
      data: permisos,
    };

    res.send(data);
  } catch (error) {
    console.error("Error al obtener permisos:", error);
    handleHttpError(res, "Error al obtener permisos");
  }
};

module.exports = {
  getRolById,
  getRoles,
  createRol,
  updateRol,
  deleteRol,
  asignarPermisos,
  getPermisosPorRol,
};
