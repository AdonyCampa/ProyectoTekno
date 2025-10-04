const { response } = require("express");
const {
  handleHttpError,
  handleErrorResponse,
} = require("../helpers/handleError");
const { matchedData } = require("express-validator");

const { CajaAperturas } = require("../models/caja");
const { Compras, ComprasDetalle } = require("../models/compras");
const Inventarios = require("../models/inventarios");

// Ver Apertura
const getDetalleCompra = async (req, res = response) => {
  try {
    /* const { id } = req.params;

    const compra = await Compra.findOne({
      where: { id },
      include: [
        {
          model: DetalleCompra,
          include: [
            {
              model: Producto,
              attributes: ["id", "nombre", "codigo", "precio"]
            }
          ]
        }
      ]
    });

    if (!compra) {
      return res.status(404).json({ message: "Compra no encontrada" });
    }

    res.json(compra); */
    // Obtener datos desde el frontend
    const { id } = req.params;
    const apertura = await CajaAperturas.findByPk(id);

    // Comprobar si existe el id ingresado
    if (!apertura) {
      // Mostrar mensaje de error
      handleErrorResponse(res, "ID Apertura no existe", 404);
      return;
    }
    // Generar respuesta exitosa
    res.send(apertura);
  } catch (error) {
    handleHttpError(res, "Error al buscar apertura");
  }
};
// Ver compras
const getCompras = async (req, res = response) => {
  try {
    /* const { fechaInicio, fechaFin, proveedor, search } = req.query;

    const where = {};

    // 🔹 Filtro por rango de fechas
    if (fechaInicio && fechaFin) {
      where.fecha = {
        [Op.between]: [new Date(fechaInicio), new Date(fechaFin)]
      };
    } else if (fechaInicio) {
      where.fecha = { [Op.gte]: new Date(fechaInicio) };
    } else if (fechaFin) {
      where.fecha = { [Op.lte]: new Date(fechaFin) };
    }

    // 🔹 Filtro por proveedor (por id)
    if (proveedor) {
      where.id_proveedor = proveedor;
    }

    // 🔹 Búsqueda por texto
    const searchCondition = search
      ? {
          [Op.or]: [
            { '$Proveedor.nombre$': { [Op.like]: `%${search}%` } },
            { numero_factura: { [Op.like]: `%${search}%` } }
          ]
        }
      : {};

    const compras = await Compra.findAll({
      where: { ...where, ...searchCondition },
      include: [
        {
          model: Proveedor,
          attributes: ["id", "nombre"]
        },
        {
          model: DetalleCompra,
          attributes: ["id", "cantidad", "precio_unitario", "subtotal"]
        }
      ],
      order: [["fecha", "DESC"]]
    });

    res.json(compras); */

    // Obtener datos
    const aperturas = await CajaAperturas.findAll();

    // Mostrar datos
    res.send(aperturas);
  } catch (error) {
    // Mostrar mensaje de error en la peticion
    handleHttpError(res, "Error al obtener aperturas");
  }
};

// Agregar apertura de caja
const registrarCompra = async (req, res = response) => {
  try {
    // Limpiar los datos
    const body = matchedData(req);

    // Validar que haya caja abierta
    const cajaAbierta = await CajaAperturas.findOne({
      where: { estado: 1 },
    });
    if (!cajaAbierta) {
      handleErrorResponse(res, "No hay caja abierta", 404);
      return;
    }
    let total = 0;

    // Calcular total de la compra
    body.detalle.forEach((p) => {
      total += p.cantidad * p.precio_unitario;
    });

    // Crear compra
    const compra = await Compras.create({
      proveedor: body.proveedor,
      usuario: body.usuario,
      apertura: body.apertura,
      total: total,
    });

    // Crear los detalles y actualizar inventario
    for (const p of body.detalle) {
      const subtotal = p.cantidad * p.precio_unitario;

      // Registrar detalle de compra
      await ComprasDetalle.create({
        compra: compra.id,
        producto: p.producto,
        cantidad: p.cantidad,
        precio_unitario: p.precio_unitario,
        subtotal,
      });

      // Movimiento de inventario (ingreso)
      await Inventarios.create({
        producto: p.producto,
        tipo: 1,
        cantidad: p.cantidad,
        referencia: compra.id,
      });
    }

    const data = {
      ok: true,
      msg: "Apertura de caja Exitosa",
      compra,
    };
    // Generar respuesta exitosa
    res.send(data);
  } catch (error) {
    // Error al crear realizar compra
    handleHttpError(res, "Error al realizar compra");
  }
};

// Anular compra
const anularCompra = async (req, res = response) => {
  try {
    // Limpiar los datos
    const { id } = req.params;
    const body = matchedData(req);

    // Checkear id categoria existente
    const caja = await CajaAperturas.findByPk(id);

    if (!caja) {
      handleErrorResponse(res, "La apertura no existe", 404);
      return;
    }
    if (caja.estado === false) {
      handleErrorResponse(res, "La caja ya esta cerrada", 404);
      return;
    }

    caja.cierre = new Date();
    caja.monto_final = body.monto_final;
    caja.estado = 0;

    await caja.save();

    // Generar respuesta exitosa
    const data = {
      ok: true,
      msg: "Cierre de caja Exitoso",
      caja,
    };

    res.send(data);
  } catch (error) {
    // Error al editar categoria
    handleHttpError(res, "Error al cerrar caja!");
  }
};

// Eliminar compra
const deleteCompra = async (req, res = response) => {
  try {
    // Eliminar usuario seleccionado
    const { id } = req.params;
    // Buscar si existe el registro
    const apertura = await CajaAperturas.findByPk(id);
    if (!apertura) {
      handleErrorResponse(res, "Categoria no existente", 404);
      return;
    }
    // Eliminando datos
    await apertura.destroy(apertura);

    // Generar respuesta exitosa
    const data = {
      ok: true,
      msg: "Apertura eliminada exitosamente",
      apertura,
    };
    res.send(data);
  } catch (error) {
    handleHttpError(res, "Error al eliminar apertera");
  }
};

module.exports = {
  getDetalleCompra,
  getCompras,
  registrarCompra,
  anularCompra,
  deleteCompra,
};
