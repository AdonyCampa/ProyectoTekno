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
const getUsuarioById = async (req, res = response) => {
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
      handleErrorResponse(res, "Usuario no encontrado", 404);
      return;
    }

    const data = {
      success: true,
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
        { nombres: { [Op.like]: `%${search}%` } },
        { apellidos: { [Op.like]: `%${search}%` } },
        { usuario: { [Op.like]: `%${search}%` } },
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
      order: [["createdAt", "DESC"]],
      limit: parseInt(limit),
      offset,
    });

    const data = {
      success: true,
      data: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / parseInt(limit)),
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
      handleErrorResponse(res, "El usuario ya está registrado", 400);
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
      success: true,
      message: "Usuario creado exitosamente",
      data: usuarioCreado,
    };
    // Generar respuesta exitosa
    res.send(data);
  } catch (error) {
    console.error("Error al crear usuario:", error);
    handleHttpError(res, "Error al crear usuario");
  }
};
// Editar usuario seleccionado
const updateUsuario = async (req, res = response) => {
  try {
    // Editar usuario seleccionado
    const { id } = req.params;
    const body = matchedData(req);

    const usuario = await Usuario.findByPk(id);
    // Checkear si el usuario existe
    if (!usuario) {
      handleErrorResponse(res, "Usuario no encontrado", 404);
      return;
    }

    // Verificar email único si cambió
    if (body.usuario && body.usuario !== usuario.usuario) {
      const userExistente = await Usuario.findOne({
        where: { usuario: body.usuario },
      });
      if (userExistente) {
        handleErrorResponse(res, "El usuario ya esta registrado", 401);
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
      nombres: body.nombres || usuario.nombres,
      apellidos: body.apellidos || usuario.apellidos,
      email: body.email || usuario.email,
      telefono: body.telefono !== undefined ? telefono : usuario.telefono,
      direccion: body.direccion !== undefined ? direccion : usuario.direccion,
      rol_id: body.rol_id || usuario.rol_id,
      estado: body.estado || usuario.estado,
    };

    // Solo actualizar password si se proporciona
    if (body.password) {
      datosActualizar.password = body.password;
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
      success: true,
      message: "Usuario actualizado exitosamente",
      data: usuarioActualizado,
    };
    res.send(data);
  } catch (error) {
    console.error("Error al actualizado usuario:", error);
    handleHttpError(res, "Error al actualizado usuario");
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
      handleErrorResponse(res, "Usuario no encontrado", 404);
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
      success: true,
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
    // Buscar si existe el registro
    const usuario = await Usuario.findByPk(id);
    if (!usuario) {
      handleErrorResponse(res, "Usuario no encontrado", 404);
      return;
    }
    // Comprobar que el usuario este inactivo
    if (!usuario.estado === false) {
      handleErrorResponse(res, "Estado de usuario activo", 404);
      return;
    }
    // No permitir eliminar el propio usuario
    if (parseInt(id) === req.usuario.id) {
      handleErrorResponse(res, "No puedes eliminar tu propio usuario", 404);
      return;
    }
    // Eliminando datos
    await usuario.destroy();
    // Generar respuesta exitosa
    const data = {
      succes: true,
      messge: "Usuario eliminado exitosamente",
      data: usuario,
    };
    res.send(data);
  } catch (error) {
    console.error("Error al eliminar usuario:", error);
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
      handleErrorResponse(res, "Usuario no encontrado", 404);
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
    handleHttpError(res, "Error al eliminar usuario");
  }
};

/**
 * Subir imagen de usuario
 */
const subirImagenUsuario = async (req, res) => {
  try {
    const { id } = req.params;

    const usuario = await Usuario.findByPk(id);
    if (!usuario) {
      // Eliminar archivo subido si el usuario no existe
      if (req.file) {
        await fs.unlink(req.file.path);
      }
      handleErrorResponse(res, "Usuario no encontrado", 404);
      return;
    }

    // Verificar que se subió un archivo
    if (!req.file) {
      handleErrorResponse(res, "No se ha proporcionado ninguna imagen", 404);
      return;
    }

    // Procesar y mover la imagen
    const { procesarImagen } = require("../helpers/imageHelper");
    const rutaImagen = await procesarImagen(
      req.file,
      "usuario",
      usuario.imagen
    );

    // Actualizar usuario con la nueva ruta de imagen
    await usuario.update({ imagen: rutaImagen });

    const data = {
      success: true,
      message: "Imagen subida exitosamente",
      data: {
        id: usuario.id,
        nombre: usuario.nombre,
        imagen: rutaImagen,
      },
    };
    res.send(data);
  } catch (error) {
    console.error("Error al subir imagen de usuario:", error);

    // Limpiar archivo temporal en caso de error
    if (req.file) {
      try {
        await fs.unlink(req.file.path);
      } catch (unlinkError) {
        console.error("Error al eliminar archivo temporal:", unlinkError);
      }
    }
    handleHttpError(res, "Error al subir la imagen");
  }
};

/**
 * Eliminar imagen de usuario
 */
const eliminarImagenUsuario = async (req, res) => {
  try {
    const { id } = req.params;

    const usuario = await Usuario.findByPk(id);
    if (!usuario) {
      handleErrorResponse(res, "Usuario no encontrado", 404);
      return;
    }

    if (!usuario.imagen) {
      handleErrorResponse(res, "El usuario no tiene imagen para eliminar", 404);
      return;
    }

    // Eliminar imagen del servidor
    const { eliminarImagen } = require("../helpers/imageHelper");
    await eliminarImagen(usuario.imagen);

    // Actualizar usuario
    await usuario.update({ imagen: null });

    const data = {
      success: true,
      message: "Imagen eliminada exitosamente",
    };
    res.send(data);
  } catch (error) {
    console.error("Error al eliminar imagen de usuario:", error);
    handleHttpError(res, "Error al eliminar la imagen");
  }
};

module.exports = {
  getUsuarioById,
  getUsuarios,
  createUsuario,
  updateUsuario,
  updatePasswordUsuario,
  deleteUsuario,
  eliminarUsuario,
  subirImagenUsuario,
  eliminarImagenUsuario,
};
