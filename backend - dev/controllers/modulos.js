const { response } = require("express");
const { Modulo, Permiso } = require("../models");

const {
  handleHttpError,
  handleErrorResponse,
} = require("../helpers/handleError");
const { matchedData } = require("express-validator");
const { Op } = require("sequelize");
const sequelize = require("../config/mysql");

/**
 * Obtener todos los módulos
 */
const getModulos = async (req, res = response) => {
  try {
    const { estado } = req.query;

    const whereClause = {};
    if (estado) whereClause.estado = estado;

    const modulos = await Modulo.findAll({
      where: whereClause,
      order: [
        ["orden", "ASC"],
        ["nombre", "ASC"],
      ],
    });

    const data = {
      success: true,
      data: modulos,
    };
    res.send(data);
  } catch (error) {
    console.error("Error al obtener módulos:", error);
    handleHttpError(res, "Error al obtener módulos");
  }
};

/**
 * Obtener módulo por ID
 */
const getModuloById = async (req, res = response) => {
  try {
    const { id } = req.params;

    const modulo = await Modulo.findByPk(id);

    if (!modulo) {
      handleErrorResponse(res, "Módulo no encontrado", 404);
      return;
    }

    const data = {
      success: true,
      data: modulo,
    };

    res.send(data);
  } catch (error) {
    console.error("Error al obtener módulo:", error);
    handleHttpError(res, "Error al obtener módulo");
  }
};

/**
 * Crear nuevo módulo
 */
const createModulo = async (req, res = response) => {
  try {
    // Limpiar los datos
    const body = matchedData(req);

    // Verificar la existencia del rol
    const checkIsExist = await Modulo.findOne({
      where: { nombre: body.nombre },
    });
    if (checkIsExist) {
      handleErrorResponse(res, "El nombre del modulo ya existe", 400);
      return;
    }

    // Verificar si el slug ya existe
    const slugExistente = await Modulo.findOne({ where: { slug: body.slug } });
    if (slugExistente) {
      handleErrorResponse(res, "El slug del módulo ya existe", 404);
      return;
    }

    const modulo = await Modulo.create({
      nombre: body.nombre,
      slug: body.slug,
      descripcion: body.descripcion,
      icono: body.icono,
      ruta: body.ruta,
      estado: body.estado,
      orden: body.orden || 0,
    });

    const data = {
      success: true,
      message: "Módulo creado exitosamente",
      data: modulo,
    };

    res.send(data);
  } catch (error) {
    console.error("Error al crear módulo:", error);
    handleHttpError(res, "Error al crear módulo");
  }
};

/**
 * Actualizar módulo
 */
const updateModulo = async (req, res = response) => {
  try {
    const { id } = req.params;
    const body = matchedData(req);

    const modulo = await Modulo.findByPk(id);
    if (!modulo) {
      handleErrorResponse(res, "Módulo no encontrado", 404);
      return;
    }

    // Verificar nombre único si cambió
    if (body.nombre && body.nombre !== modulo.nombre) {
      const slugExistente = await Modulo.findOne({
        where: { nombre: body.nombre },
      });
      if (slugExistente) {
        handleErrorResponse(res, "El nombre del módulo ya existe", 404);
        return;
      }
    }

    // Verificar slug único si cambió
    if (body.slug && body.slug !== modulo.slug) {
      const slugExistente = await Modulo.findOne({
        where: { slug: body.slug },
      });
      if (slugExistente) {
        handleErrorResponse(res, "El slug del módulo ya existe", 404);
        return;
      }
    }

    await modulo.update({
      nombre: body.nombre || modulo.nombre,
      slug: body.slug || modulo.slug,
      descripcion:
        body.descripcion !== undefined ? body.descripcion : modulo.descripcion,
      icono: body.icono !== undefined ? body.icono : modulo.icono,
      ruta: body.ruta !== undefined ? body.ruta : modulo.ruta,
      orden: body.orden !== undefined ? body.orden : modulo.orden,
      estado: body.estado || modulo.estado,
    });

    const data = {
      success: true,
      message: "Módulo actualizado exitosamente",
      data: modulo,
    };
    res.send(data);
  } catch (error) {
    console.error("Error al actualizar módulo:", error);
    handleHttpError(res, "Error al actualizar módulo");
  }
};

/**
 * Eliminar módulo
 */
const deleteModulo = async (req, res = response) => {
  try {
    const { id } = req.params;

    const modulo = await Modulo.findByPk(id);
    if (!modulo) {
      handleErrorResponse(res, "Módulo no encontrado", 404);
      return;
    }

    // Verificar si hay permisos asociados
    const permisosAsociados = await Permiso.count({ where: { modulo_id: id } });
    if (permisosAsociados > 0) {
      handleErrorResponse(
        res,
        "No se puede eliminar el módulo porque tiene permisos asociados",
        400
      );
      return;
    }

    await modulo.destroy();

    res.status(200).json({
      success: true,
      message: "Módulo eliminado exitosamente",
    });
  } catch (error) {
    console.error("Error al eliminar módulo:", error);
    handleHttpError(res, "Error al eliminar módulo");
  }
};

/**
 * Inicializar módulos del sistema (seeder)
 */
const inicializarModulos = async (req, res = response) => {
  try {
    const modulosIniciales = [
      {
        nombre: "Caja",
        slug: "caja",
        descripcion: "Gestión de caja",
        icono: "bi-cash-stack",
        ruta: "/caja",
        orden: 1,
      },
      {
        nombre: "Ventas",
        slug: "ventas",
        descripcion: "Gestión de ventas",
        icono: "bi-cart",
        ruta: "/ventas",
        orden: 2,
      },
      {
        nombre: "Compras",
        slug: "compras",
        descripcion: "Gestión de compras",
        icono: "bi-bag",
        ruta: "/compras",
        orden: 3,
      },
      {
        nombre: "Inventario",
        slug: "inventario",
        descripcion: "Gestión de inventario",
        icono: "bi-box-seam",
        ruta: "/inventario",
        orden: 4,
      },
      {
        nombre: "Productos",
        slug: "productos",
        descripcion: "Gestión de productos",
        icono: "bi-clipboard",
        ruta: "/productos",
        orden: 5,
      },
      {
        nombre: "Proveedores",
        slug: "proveedores",
        descripcion: "Gestión de proveedores",
        icono: "bi-briefcase",
        ruta: "/proveedores",
        orden: 6,
      },
      {
        nombre: "Clientes",
        slug: "clientes",
        descripcion: "Gestión de clientes",
        icono: "bi-people",
        ruta: "/clientes",
        orden: 7,
      },
      {
        nombre: "Usuarios",
        slug: "usuarios",
        descripcion: "Gestión de usuarios",
        icono: "bi-person",
        ruta: "/usuarios",
        orden: 8,
      },
      {
        nombre: "Roles",
        slug: "roles",
        descripcion: "Gestión de roles y permisos",
        icono: "bi-shield-lock",
        ruta: "/roles",
        orden: 9,
      },
      {
        nombre: "Categorías",
        slug: "categorias",
        descripcion: "Gestión de categorías",
        icono: "bi-grid",
        ruta: "/categorias",
        orden: 10,
      },
      {
        nombre: "Marcas",
        slug: "marcas",
        descripcion: "Gestión de marcas",
        icono: "bi-award",
        ruta: "/marcas",
        orden: 11,
      },
      {
        nombre: "Medidas",
        slug: "medidas",
        descripcion: "Gestión de unidades de medida",
        icono: "bi-rulers",
        ruta: "/medidas",
        orden: 12,
      },
    ];

    const modulosCreados = [];

    for (const modulo of modulosIniciales) {
      const [moduloCreado, created] = await Modulo.findOrCreate({
        where: { slug: modulo.slug },
        defaults: modulo,
      });

      if (created) {
        modulosCreados.push(moduloCreado);
      }
    }

    const data = {
      success: true,
      message: `Módulos inicializados. ${modulosCreados.length} módulos nuevos creados.`,
      data: modulosCreados,
    };
    res.send(data);
  } catch (error) {
    console.error("Error al inicializar módulos:", error);
    handleHttpError(res, "Error al inicializar módulos");
  }
};

module.exports = {
  getModulos,
  getModuloById,
  createModulo,
  updateModulo,
  deleteModulo,
  inicializarModulos,
};
