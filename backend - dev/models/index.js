const Usuario = require("./usuarios");
const Rol = require("./roles");
const Modulo = require("./modulos");
const Permiso = require("./permisos");
const Categoria = require("./categorias");
const Marca = require("./marcas");
const Medida = require("./medidas");
const Producto = require("./productos");
const Cliente = require("./clientes");
const Proveedor = require("./proveedores");
const Compra = require("./compras");
const DetalleCompra = require("./detalles-compra");
const Venta = require("./ventas");
const DetalleVenta = require("./detalles-venta");
const Caja = require("./caja");
const MovimientoCaja = require("./movimientos-caja");

// ========================================
// ASOCIACIONES USUARIOS Y ROLES
// ========================================

Usuario.belongsTo(Rol, {
  foreignKey: "rol_id",
  as: "rol",
});

Rol.hasMany(Usuario, {
  foreignKey: "rol_id",
  as: "usuarios",
});

// ========================================
// ASOCIACIONES ROLES, PERMISOS Y MÓDULOS
// ========================================

Rol.belongsToMany(Modulo, {
  through: Permiso,
  foreignKey: "rol_id",
  otherKey: "modulo_id",
  as: "modulos",
});

Modulo.belongsToMany(Rol, {
  through: Permiso,
  foreignKey: "modulo_id",
  otherKey: "rol_id",
  as: "roles",
});

Rol.hasMany(Permiso, {
  foreignKey: "rol_id",
  as: "permisos",
});

Permiso.belongsTo(Rol, {
  foreignKey: "rol_id",
  as: "rol",
});

Modulo.hasMany(Permiso, {
  foreignKey: "modulo_id",
  as: "permisos",
});

Permiso.belongsTo(Modulo, {
  foreignKey: "modulo_id",
  as: "modulo",
});

// ========================================
// ASOCIACIONES PRODUCTOS
// ========================================

Producto.belongsTo(Categoria, {
  foreignKey: "categoria_id",
  as: "categoria",
});

Categoria.hasMany(Producto, {
  foreignKey: "categoria_id",
  as: "productos",
});

Producto.belongsTo(Marca, {
  foreignKey: "marca_id",
  as: "marca",
});

Marca.hasMany(Producto, {
  foreignKey: "marca_id",
  as: "productos",
});

Producto.belongsTo(Medida, {
  foreignKey: "medida_id",
  as: "medida",
});

Medida.hasMany(Producto, {
  foreignKey: "medida_id",
  as: "productos",
});

// ========================================
// ASOCIACIONES COMPRAS
// ========================================

Compra.belongsTo(Proveedor, {
  foreignKey: "proveedor_id",
  as: "proveedor",
});

Proveedor.hasMany(Compra, {
  foreignKey: "proveedor_id",
  as: "compras",
});

Compra.belongsTo(Usuario, {
  foreignKey: "usuario_id",
  as: "usuario",
});

Usuario.hasMany(Compra, {
  foreignKey: "usuario_id",
  as: "compras",
});

Compra.hasMany(DetalleCompra, {
  foreignKey: "compra_id",
  as: "detalles",
});

DetalleCompra.belongsTo(Compra, {
  foreignKey: "compra_id",
  as: "compra",
});

DetalleCompra.belongsTo(Producto, {
  foreignKey: "producto_id",
  as: "producto",
});

Producto.hasMany(DetalleCompra, {
  foreignKey: "producto_id",
  as: "detallesCompra",
});

// ========================================
// ASOCIACIONES VENTAS
// ========================================

Venta.belongsTo(Cliente, {
  foreignKey: "cliente_id",
  as: "cliente",
});

Cliente.hasMany(Venta, {
  foreignKey: "cliente_id",
  as: "ventas",
});

Venta.belongsTo(Usuario, {
  foreignKey: "usuario_id",
  as: "usuario",
});

Usuario.hasMany(Venta, {
  foreignKey: "usuario_id",
  as: "ventas",
});

Venta.hasMany(DetalleVenta, {
  foreignKey: "venta_id",
  as: "detalles",
});

DetalleVenta.belongsTo(Venta, {
  foreignKey: "venta_id",
  as: "venta",
});

DetalleVenta.belongsTo(Producto, {
  foreignKey: "producto_id",
  as: "producto",
});

Producto.hasMany(DetalleVenta, {
  foreignKey: "producto_id",
  as: "detallesVenta",
});

// ========================================
// ASOCIACIONES CAJA
// ========================================

Caja.belongsTo(Usuario, {
  foreignKey: "usuario_apertura",
  as: "usuarioApertura",
});

Caja.belongsTo(Usuario, {
  foreignKey: "usuario_cierre",
  as: "usuarioCierre",
});

Caja.hasMany(MovimientoCaja, {
  foreignKey: "caja_id",
  as: "movimientos",
});

MovimientoCaja.belongsTo(Caja, {
  foreignKey: "caja_id",
  as: "caja",
});

MovimientoCaja.belongsTo(Usuario, {
  foreignKey: "usuario_id",
  as: "usuario",
});

MovimientoCaja.belongsTo(Venta, {
  foreignKey: "venta_id",
  as: "venta",
});

MovimientoCaja.belongsTo(Compra, {
  foreignKey: "compra_id",
  as: "compra",
});

// ========================================
// EXPORTAR TODOS LOS MODELOS
// ========================================

module.exports = {
  Usuario,
  Rol,
  Modulo,
  Permiso,
  Categoria,
  Marca,
  Medida,
  Producto,
  Cliente,
  Proveedor,
  Compra,
  DetalleCompra,
  Venta,
  DetalleVenta,
  Caja,
  MovimientoCaja,
};
