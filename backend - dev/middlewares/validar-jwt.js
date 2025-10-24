const { response } = require("express");
const jwt = require("jsonwebtoken");

const { handleErrorResponse } = require("../helpers/handleError");

const validarJWT = (req, res = response, next) => {
  const token =
    req.header("x-token") ||
    req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    handleErrorResponse(res, "No hay token en la petición", 401);
    return;
  }

  try {
    const { id, usuario, rol_id } = jwt.verify(
      token,
      process.env.SECRET_JWT_SEED
    );
    req.id = id;
    req.usuario = usuario;
    req.rol_id = rol_id;
  } catch (error) {
    handleErrorResponse(res, "Token no válido", 401);
    return;
  }

  // TODO OK!
  next();
};

module.exports = {
  validarJWT,
};
