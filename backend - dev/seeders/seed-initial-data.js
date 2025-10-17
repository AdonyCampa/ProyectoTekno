// seeders/YYYYMMDDHHMMSS-seed-initial-data.js
"use strict";
const bcrypt = require("bcryptjs");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 1. Crear roles iniciales
    await queryInterface.bulkInsert(
      "roles",
      [
        {
          id: 1,
          nombre: "Administrador",
          descripcion: "Acceso completo a todo el sistema",
          estado: "activo",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          nombre: "Gerente",
          descripcion: "Acceso a módulos de gestión y reportes",
          estado: "activo",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 3,
          nombre: "Vendedor",
          descripcion: "Acceso a ventas y caja",
          estado: "activo",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 4,
          nombre: "Almacenista",
          descripcion: "Acceso a inventario, productos y compras",
          estado: "activo",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );

    // 2. Crear módulos iniciales
    await queryInterface.bulkInsert(
      "modulos",
      [
        {
          nombre: "Caja",
          slug: "caja",
          descripcion: "Gestión de caja",
          icono: "bi-cash-stack",
          ruta: "/caja",
          orden: 1,
          estado: "activo",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          nombre: "Ventas",
          slug: "ventas",
          descripcion: "Gestión de ventas",
          icono: "bi-cart",
          ruta: "/ventas",
          orden: 2,
          estado: "activo",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          nombre: "Compras",
          slug: "compras",
          descripcion: "Gestión de compras",
          icono: "bi-bag",
          ruta: "/compras",
          orden: 3,
          estado: "activo",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          nombre: "Inventario",
          slug: "inventario",
          descripcion: "Gestión de inventario",
          icono: "bi-box-seam",
          ruta: "/inventario",
          orden: 4,
          estado: "activo",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          nombre: "Productos",
          slug: "productos",
          descripcion: "Gestión de productos",
          icono: "bi-clipboard",
          ruta: "/productos",
          orden: 5,
          estado: "activo",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          nombre: "Proveedores",
          slug: "proveedores",
          descripcion: "Gestión de proveedores",
          icono: "bi-briefcase",
          ruta: "/proveedores",
          orden: 6,
          estado: "activo",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          nombre: "Clientes",
          slug: "clientes",
          descripcion: "Gestión de clientes",
          icono: "bi-people",
          ruta: "/clientes",
          orden: 7,
          estado: "activo",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          nombre: "Usuarios",
          slug: "usuarios",
          descripcion: "Gestión de usuarios",
          icono: "bi-person",
          ruta: "/usuarios",
          orden: 8,
          estado: "activo",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          nombre: "Roles",
          slug: "roles",
          descripcion: "Gestión de roles y permisos",
          icono: "bi-shield-lock",
          ruta: "/roles",
          orden: 9,
          estado: "activo",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          nombre: "Categorías",
          slug: "categorias",
          descripcion: "Gestión de categorías",
          icono: "bi-grid",
          ruta: "/categorias",
          orden: 10,
          estado: "activo",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          nombre: "Marcas",
          slug: "marcas",
          descripcion: "Gestión de marcas",
          icono: "bi-award",
          ruta: "/marcas",
          orden: 11,
          estado: "activo",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          nombre: "Medidas",
          slug: "medidas",
          descripcion: "Gestión de unidades de medida",
          icono: "bi-rulers",
          ruta: "/medidas",
          orden: 12,
          estado: "activo",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );

    // 3. Crear usuario administrador
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("admin123", salt);

    await queryInterface.bulkInsert(
      "usuarios",
      [
        {
          usuario: "admin",
          nombres: "Abisai Adoniram",
          apellidos: "Lopez CAmpa",
          email: "admin@sistema.com",
          password: hashedPassword,
          telefono: "12345678",
          direccion: "Dirección del administrador",
          estado: "activo",
          rol_id: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );

    // 4. Asignar permisos completos al rol Administrador (todos los módulos)
    const permisos = [];
    for (let moduloId = 1; moduloId <= 12; moduloId++) {
      permisos.push({
        rol_id: 1,
        modulo_id: moduloId,
        crear: true,
        leer: true,
        actualizar: true,
        eliminar: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    // Permisos para Gerente (2) - Sin eliminar usuarios y roles
    for (let moduloId = 1; moduloId <= 12; moduloId++) {
      const puedeEliminar = moduloId !== 8 && moduloId !== 9; // No eliminar en usuarios y roles
      permisos.push({
        rol_id: 2,
        modulo_id: moduloId,
        crear: true,
        leer: true,
        actualizar: true,
        eliminar: puedeEliminar,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    // Permisos para Vendedor (3) - Solo caja, ventas y clientes
    [1, 2, 7].forEach((moduloId) => {
      permisos.push({
        rol_id: 3,
        modulo_id: moduloId,
        crear: true,
        leer: true,
        actualizar: true,
        eliminar: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    });

    // Permisos para Almacenista (4) - Inventario, productos, compras, proveedores
    [3, 4, 5, 6].forEach((moduloId) => {
      permisos.push({
        rol_id: 4,
        modulo_id: moduloId,
        crear: true,
        leer: true,
        actualizar: true,
        eliminar: moduloId !== 3, // No eliminar compras
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    });

    await queryInterface.bulkInsert("permisos", permisos, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("permisos", null, {});
    await queryInterface.bulkDelete("usuarios", null, {});
    await queryInterface.bulkDelete("modulos", null, {});
    await queryInterface.bulkDelete("roles", null, {});
  },
};
