const { response } = require("express");
const {
  handleHttpError,
  handleErrorResponse,
} = require("../helpers/handleError");
const { matchedData } = require("express-validator");
const { Producto, Categoria, Marca, Medida } = require("../models");
const { Op } = require("sequelize");

// Ver Producto
const getProductoById = async (req, res = response) => {
  try {
    // Obtener datos desde el frontend
    const { id } = req.params;
    const producto = await Producto.findByPk(id, {
      include: [
        {
          model: Categoria,
          as: "categoria",
        },
        {
          model: Marca,
          as: "marca",
        },
        {
          model: Medida,
          as: "medida",
        },
      ],
    });

    // Comprobar si existe el id ingresado
    if (!producto) {
      handleErrorResponse(res, "Producto no encontrado", 404);
      return;
    }

    const data = {
      success: true,
      data: producto,
    };

    // Generar respuesta exitosa
    res.send(data);
  } catch (error) {
    console.error("Error al obtener producto:", error);
    handleHttpError(res, "Error al buscar Producto");
  }
};
// Ver Productos
const getProductos = async (req, res = response) => {
  try {
    // Obtener datos
    const {
      estado,
      categoria_id,
      marca_id,
      search,
      page = 1,
      limit = 10,
    } = req.query;
    const whereClause = {};

    if (estado) whereClause.estado = estado;
    if (categoria_id) whereClause.categoria_id = categoria_id;
    if (marca_id) whereClause.marca_id = marca_id;

    if (search) {
      whereClause[Op.or] = [
        { nombre: { [Op.like]: `%${search}%` } },
        { codigo: { [Op.like]: `%${search}%` } },
        { descripcion: { [Op.like]: `%${search}%` } },
      ];
    }

    const offset = (parseInt(page) - 1) * parseInt(limit);

    const { count, rows } = await Producto.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: Categoria,
          as: "categoria",
          attributes: ["id", "nombre"],
        },
        {
          model: Marca,
          as: "marca",
          attributes: ["id", "nombre"],
        },
        {
          model: Medida,
          as: "medida",
          attributes: ["id", "nombre", "abreviatura"],
        },
      ],
      order: [["nombre", "ASC"]],
      limit: parseInt(limit),
      offset,
    });

    const data = {
      success: true,
      data: {
        productos: rows,
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
    console.error("Error al obtener productos:", error);
    // Mostrar mensaje de error en la peticion
    handleHttpError(res, "Error al obtener Productos");
  }
};

// Agregar un Producto nuevo
const createProducto = async (req, res = response) => {
  try {
    // Limpiar los datos
    const body = matchedData(req);

    // Verificar código único
    const existeCodigo = await Producto.findOne({
      where: { codigo: body.codigo },
    });
    if (existeCodigo) {
      handleErrorResponse(res, "Ya existe un producto con ese código", 404);
      return;
    }

    // Verificar que existan categoria, marca y medida
    const categoria = await Categoria.findByPk(categoria_id);
    if (!categoria) {
      handleErrorResponse(res, "Categoría no encontrada", 404);
      return;
    }

    const marca = await Marca.findByPk(marca_id);
    if (!marca) {
      handleErrorResponse(res, "Marca no encontrada", 404);
      return;
    }

    const medida = await Medida.findByPk(medida_id);
    if (!medida) {
      handleErrorResponse(res, "Medida no encontrada", 404);
      return;
    }

    const producto = await Producto.create({
      codigo: body.codigo,
      nombre: body.nombre,
      descripcion: body.descripcion,
      precio_costo: body.precio_costo || 0,
      precio_venta: body.precio_venta || 0,
      stock_actual: body.stock_actual || 0,
      stock_minimo: body.stock_minimo || 0,
      stock_maximo: body.stock_maximo || 100,
      categoria_id: body.categoria_id,
      marca_id: body.marca_id,
      medida_id: body.medida_id,
      imagen: body.imagen,
    });

    // Obtener producto con relaciones
    const productoCreado = await Producto.findByPk(producto.id, {
      include: [
        { model: Categoria, as: "categoria", attributes: ["id", "nombre"] },
        { model: Marca, as: "marca", attributes: ["id", "nombre"] },
        {
          model: Medida,
          as: "medida",
          attributes: ["id", "nombre", "abreviatura"],
        },
      ],
    });

    // Crear nueva Producto
    const data = {
      succes: true,
      message: "Producto creado exitosamente",
      data: productoCreado,
    };
    // Generar respuesta exitosa
    res.send(data);
  } catch (error) {
    console.error("Error al crear producto:", error);
    // Error al crear Producto
    handleHttpError(res, "Error al crear producto");
  }
};

// Editar Producto seleccionado
const updateProducto = async (req, res = response) => {
  try {
    // Limpiar los datos
    const { id } = req.params;
    const body = matchedData(req);

    // Checkear id Producto existente
    const producto = await Producto.findByPk(id);
    if (!producto) {
      handleErrorResponse(res, "Producto no encontrado", 404);
      return;
    }

    // Verificar código único si cambió
    if (body.codigo && body.codigo !== producto.codigo) {
      const existeCodigo = await Producto.findOne({
        where: { codigo: body.codigo },
      });
      if (existeCodigo) {
        handleErrorResponse(res, "Ya existe un producto con ese código", 404);
        return;
      }
    }

    // Verificar categoría si cambió
    if (body.categoria_id && body.categoria_id !== producto.categoria_id) {
      const categoria = await Categoria.findByPk(body.categoria_id);
      if (!categoria) {
        handleErrorResponse(res, "Categoría no encontrada", 404);
        return;
      }
    }

    // Verificar marca si cambió
    if (body.marca_id && body.marca_id !== producto.marca_id) {
      const marca = await Marca.findByPk(body.marca_id);
      if (!marca) {
        handleErrorResponse(res, "Marca no encontrada", 404);
        return;
      }
    }

    // Verificar medida si cambió
    if (body.medida_id && body.medida_id !== producto.medida_id) {
      const medida = await Medida.findByPk(body.medida_id);
      if (!medida) {
        handleErrorResponse(res, "Medida no encontrada", 404);
        return;
      }
    }

    await producto.update({
      codigo: body.codigo || producto.codigo,
      nombre: body.nombre || producto.nombre,
      descripcion:
        body.descripcion !== undefined
          ? body.descripcion
          : producto.descripcion,
      precio_costo:
        body.precio_costo !== undefined
          ? body.precio_costo
          : producto.precio_costo,
      precio_venta:
        body.precio_venta !== undefined
          ? body.precio_venta
          : producto.precio_venta,
      stock_actual:
        body.stock_actual !== undefined
          ? body.stock_actual
          : producto.stock_actual,
      stock_minimo:
        body.stock_minimo !== undefined
          ? body.stock_minimo
          : producto.stock_minimo,
      stock_maximo:
        body.stock_maximo !== undefined
          ? body.stock_maximo
          : producto.stock_maximo,
      categoria_id: body.categoria_id || producto.categoria_id,
      marca_id: body.marca_id || producto.marca_id,
      medida_id: body.medida_id || producto.medida_id,
      imagen: body.imagen !== undefined ? body.imagen : producto.imagen,
      estado: body.estado || producto.estado,
    });

    // Obtener producto actualizado con relaciones
    const productoActualizado = await Producto.findByPk(id, {
      include: [
        { model: Categoria, as: "categoria", attributes: ["id", "nombre"] },
        { model: Marca, as: "marca", attributes: ["id", "nombre"] },
        {
          model: Medida,
          as: "medida",
          attributes: ["id", "nombre", "abreviatura"],
        },
      ],
    });

    // Generar respuesta exitosa
    const data = {
      success: true,
      message: "Producto actualizado exitosamente",
      data: productoActualizado,
    };

    res.send(data);
  } catch (error) {
    console.error("Error al actualizar producto:", error);

    // Error al editar Producto
    handleHttpError(res, "Error al editar Producto!");
  }
};

// Eliminar Producto
const deleteProducto = async (req, res = response) => {
  try {
    // Eliminar usuario seleccionado
    const { id } = req.params;
    // Buscar si existe el registro
    const producto = await Producto.findByPk(id);
    if (!producto) {
      handleErrorResponse(res, "Producto no encontrado", 404);
      return;
    }

    // Verificar si tiene stock
    if (producto.stock_actual > 0) {
      handleErrorResponse(
        res,
        "No se puede eliminar un producto con stock. Cambie el estado a inactivo.",
        404
      );
      return;
    }
    if (!producto) {
      handleErrorResponse(res, "El Producto no existente", 404);
      return;
    }
    // Eliminando datos
    await producto.destroy();

    // Generar respuesta exitosa
    const data = {
      success: true,
      message: "Producto eliminado exitosamente",
    };
    res.send(data);
  } catch (error) {
    console.error("Error al eliminar producto:", error);
    handleHttpError(res, "Error al eliminar producto");
  }
};

/**
 * Obtener productos con bajo stock
 */
const getProductosBajoStock = async (req, res) => {
  try {
    const productos = await Producto.findAll({
      where: {
        estado: "activo",
        stock_actual: {
          [Op.lte]: sequelize.col("stock_minimo"),
        },
      },
      include: [
        { model: Categoria, as: "categoria", attributes: ["id", "nombre"] },
        { model: Marca, as: "marca", attributes: ["id", "nombre"] },
      ],
      order: [["stock_actual", "ASC"]],
    });

    const data = {
      success: true,
      data: productos,
    };

    res.send(data);
  } catch (error) {
    console.error("Error al obtener productos con bajo stock:", error);
    handleHttpError(res, "Error al obtener productos con bajo stock");
    res.status(500).json({
      success: false,
      message: "Error al obtener productos con bajo stock",
      error: error.message,
    });
  }
};

module.exports = {
  getProductoById,
  getProductos,
  createProducto,
  updateProducto,
  deleteProducto,
  getProductosBajoStock,
};
