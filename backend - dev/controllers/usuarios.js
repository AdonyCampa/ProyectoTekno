const { response } = require("express");
const { Usuario, Rol, Permiso, Modulo } = require("../models");
const { encrypt, compare } = require("../helpers/handleJwt");
const {
  handleHttpError,
  handleErrorResponse,
} = require("../helpers/handleError");
const { matchedData } = require("express-validator");
const { Op } = require("sequelize");

// Ver usuario
const getUsuarioByID = async (req, res = response) => {
  try {
    // Ver usuario seleccionado
    const { id } = req.params;
    const usuario = await Usuario.findByPk(id, {
      include: [
        {
          model: Rol,
          as: "rol",
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
        },
      ],
    });
    // Comprobar si existe el id ingresado
    if (!usuario) {
      // Mostrar mensaje de error
      handleErrorResponse(res, "ID Usuario no existe", 404);
      return;
    }

    const data = {
      succes: true,
      data: usuario,
    };
    // Generar respuesta exitosa
    res.send(data);
  } catch (error) {
    console.error("Error al obtener usuario:", error);
    handleHttpError(res, "Error al obtener usuario");
  }
};
// Ver usuarios
const getUsuarios = async (req, res = response) => {
  try {
    const { estado, rol_id, search, page = 1, limit = 10 } = req.query;

    const whereClause = {};

    if (estado) whereClause.estado = estado;
    if (rol_id) whereClause.rol_id = rol_id;

    if (search) {
      whereClause[Op.or] = [
        { nombre: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
      ];
    }

    const offset = (parseInt(page) - 1) * parseInt(limit);

    // Obtener datos
    const { count, rows } = await Usuario.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: Rol,
          as: "rol",
          attributes: ["id", "nombre"],
        },
      ],
      order: [["created_at", "DESC"]],
      limit: parseInt(limit),
      offset,
    });

    const data = {
      succes: true,
      data: {
        usuarios: rows,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(count / parseInt(limit)),
        },
      },
    };

    // Mostrar datos
    res.send(data);
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    // Mostrar mensaje de error en la peticion
    handleHttpError(res, "Erroral obtener usuarios");
  }
};
// Agregar un usuario nuevo
const createUsuario = async (req, res = response) => {
  try {
    const { repeatpassword } = req.body;
    // Limpiar los datos
    const body = matchedData(req);
    // Verificar la existencia del usuario
    const checkIsExist = await Usuario.findOne({
      where: { usuario: body.usuario },
    });
    if (checkIsExist) {
      handleErrorResponse(res, "Usuario existente", 400);
      return;
    }

    // Verificar que el rol existe
    const rol = await Rol.findByPk(body.rol_id);
    if (!rol) {
      handleErrorResponse(res, "Rol no encontrado", 400);
      return;
    }
    // Verificar que las contraseñas coincidan
    if (!(body.password === repeatpassword)) {
      handleErrorResponse(res, "Las contraseñas no coinciden", 400);
      return;
    }

    // Crear usuario de DB
    const usuario = await Usuario.create(body);

    // Obtener usuario con rol
    const usuarioCreado = await Usuario.findByPk(usuario.id, {
      include: [
        {
          model: Rol,
          as: "rol",
          attributes: ["id", "nombre"],
        },
      ],
    });

    const data = {
      succes: true,
      message: "Usuario creado exitosamente",
      data: usuarioCreado,
    };
    // Generar respuesta exitosa
    res.send(data);
  } catch (error) {
    handleHttpError(res, "Error al crear Usuario");
  }
};
// Editar usuario seleccionado
const updateUsuario = async (req, res = response) => {
  try {
    // Editar usuario seleccionado
    const { id } = req.params;
    const { body } = req;

    const usuario = await Usuario.findByPk(id);
    // Checkear si el usuario existe
    if (!usuario) {
      handleErrorResponse(res, "El usuario no existe ", 404);
      return;
    }

    // Verificar email único si cambió
    if (body.usuario && body.usuario !== usuario.usuario) {
      const userExistente = await Usuario.findOne({
        where: { usuario: body.usuario },
      });
      if (userExistente) {
        handleErrorResponse(res, "El usuario ya existe", 401);
        return;
      }
    }

    // Verificar rol si cambió
    if (body.rol_id && body.rol_id !== usuario.rol_id) {
      const rol = await Rol.findByPk(body.rol_id);
      if (!rol) {
        handleErrorResponse(res, "Rol no encontrado", 404);
        return;
      }
    }

    // Actualizar usuario
    const datosActualizar = {
      usuario: body.usuario || usuario.usuario,
      nombres: body.nombre || usuario.nombre,
      apellidos: body.nombre || usuario.nombre,
      email: body.email || usuario.email,
      telefono: body.telefono !== undefined ? telefono : usuario.telefono,
      direccion: body.direccion !== undefined ? direccion : usuario.direccion,
      rol_id: body.rol_id || usuario.rol_id,
      estado: body.estado || usuario.estado,
    };

    // Solo actualizar password si se proporciona
    if (password) {
      datosActualizar.password = password;
    }

    await usuario.update(datosActualizar);

    // Obtener usuario actualizado
    const usuarioActualizado = await Usuario.findByPk(id, {
      include: [
        {
          model: Rol,
          as: "rol",
          attributes: ["id", "nombre"],
        },
      ],
    });

    // Generar respuesta exitosa
    const data = {
      succes: true,
      message: "Usuario actualizar exitosamente",
      data: usuarioActualizado,
    };
    res.send(data);
  } catch (error) {
    console.error("Error al actualizar usuario:", error);
    handleHttpError(res, "Error al actualizar usuario");
  }
};
// Editar contraseña de usuario
const updatePasswordUsuario = async (req, res = response) => {
  try {
    // Editar usuario seleccionado
    const { id } = req.params;
    const { newpassword, repeatpassword } = req.body;
    const usuario = await Usuario.findByPk(id);
    // Checkear si el usuario existe
    if (!usuario) {
      handleErrorResponse(res, "El usuario no existe", 404);
      return;
    }
    // Verificar que las contraseñas coincidan
    if (!(newpassword === repeatpassword)) {
      handleErrorResponse(res, "Las contraseñas no coinciden", 400);
      return;
    }
    // Verificar si la nueva contraseña no es igual a la antigua
    const oldpassword = await compare(newpassword, usuario.password);

    if (oldpassword) {
      handleErrorResponse(res, "La contraseña es igual a la anterior", 400);
      return;
    }
    // Actualizar contraseña
    const password = await encrypt(newpassword);
    await usuario.update({ password });
    //Generar respuesta exitosa
    const data = {
      succes: true,
      message: "Cambio de contraseña exitoso",
    };
    res.send(data);
  } catch (error) {
    console.error("Error al cambiar contraseña:", error);
    handleHttpError(res, "Error al cambiar contraseña");
  }
};
// Eliminar usuario
const deleteUsuario = async (req, res = response) => {
  try {
    // Eliminar usuario seleccionado
    const { id } = req.params;
    const { body } = req;
    console.log(req);
    // Buscar si existe el registro
    const usuario = await Usuario.findByPk(id);
    if (!usuario) {
      handleErrorResponse(res, "El usuario no existe", 404);
      return;
    }
    // Comprobar que el usuario este inactivo
    if (!usuario.estado === false) {
      handleErrorResponse(res, "Estado de usuario activo", 404);
      return;
    }
    // Eliminando datos
    await usuario.destroy(body);
    // Generar respuesta exitosa
    const data = {
      succes: true,
      messge: "Usuario eliminado exitosamente",
      data: usuario,
    };
    res.send(data);
  } catch (error) {
    handleHttpError(res, "Error al eliminar usuario");
  }
};

/**
 * Eliminar usuario (soft delete)
 */
const eliminarUsuario = async (req, res) => {
  try {
    const { id } = req.params;

    const usuario = await Usuario.findByPk(id);
    if (!usuario) {
      handleErrorResponse(res, "El usuario no existe", 404);
      return;
    }

    // No permitir eliminar el propio usuario
    if (parseInt(id) === req.usuario.id) {
      handleErrorResponse(res, "No puedes eliminar tu propio usuario", 404);
      return;
    }

    // Cambiar estado a inactivo en lugar de eliminar
    await usuario.update({ estado: "inactivo" });

    const data = {
      success: true,
      message: "Usuario desactivado exitosamente",
      data: usuario,
    };

    res.send(data);
  } catch (error) {
    console.error("Error al eliminar usuario:", error);
    res.status(500).json({
      success: false,
      message: "Error al eliminar usuario",
      error: error.message,
    });
  }
};

module.exports = {
  getUsuarioByID,
  getUsuarios,
  createUsuario,
  updateUsuario,
  updatePasswordUsuario,
  deleteUsuario,
  eliminarUsuario,
};
