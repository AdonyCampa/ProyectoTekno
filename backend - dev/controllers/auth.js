const { response } = require("express");
const { Usuario, Rol, Permiso, Modulo } = require("../models");
const { compare } = require("../helpers/handleJwt");
const { generarJWT } = require("../helpers/jwt");
const {
  handleHttpError,
  handleErrorResponse,
} = require("../helpers/handleError");

/**
 * Login de usuario
 */
const loginUsuario = async (req, res = response) => {
  const { usuario, password } = req.body;
  try {
    // Buscar usuario con rol y permisos
    const usuario = await Usuario.findOne({
      where: { email },
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
    if (!usuario) {
      handleErrorResponse(res, "El usuario no existe", 404);
      return;
    }
    // Verificar contraseña
    const validPassword = await usuario.compararPassword(password);
    if (!validPassword) {
      handleErrorResponse(res, "Contraseña incorrecta", 401);
      return;
    }
    // Verificar estado del usuario
    if (!usuario.estado) {
      handleErrorResponse(res, "Usuario inactivo", 402);
      return;
    }

    // Actualizar último acceso
    await usuario.update({ ultimo_acceso: new Date() });

    // Generar el JWT
    const token = await generarJWT(usuario.id, usuario.usuario, usuario.rol_id);
    // Respuesta del servicio
    const data = {
      succes: true,
      message: "Login exitoso",
      data: {
        token: token,
        usuario: usuario,
      },
    };
    res.send(data);
  } catch (error) {
    console.error("Error en login:", error);
    handleHttpError(res, error);
  }
};

const revalidarToken = async (req, res = response) => {
  const { id, usuario, rol_id } = req;
  // Buscar usuario en la base de datos
  const dbUser = await Usuario.findByPk(id);
  // Generar el JWT
  const token = await generarJWT(id, usuario, rol_id);
  // Respuesta del servidor
  const data = {
    succes: true,
    message: "Renovacion de token exitoso",
    data: {
      token: token,
      usuario: dbUser,
    },
  };
  res.send(data);
};

module.exports = {
  loginUsuario,
  revalidarToken,
};
