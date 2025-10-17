// migrations/YYYYMMDDHHMMSS-create-usuarios-roles.js
"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Crear tabla roles
    await queryInterface.createTable("roles", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      nombre: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true,
      },
      descripcion: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      estado: {
        type: Sequelize.ENUM("activo", "inactivo"),
        allowNull: false,
        defaultValue: "activo",
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });

    // Crear tabla usuarios
    await queryInterface.createTable("usuarios", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      usuario: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true,
      },
      nombres: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      apellidos: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      password: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      telefono: {
        type: Sequelize.STRING(20),
        allowNull: true,
      },
      direccion: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      imagen: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      estado: {
        type: Sequelize.ENUM("activo", "inactivo"),
        allowNull: false,
        defaultValue: "activo",
      },
      rol_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "roles",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },
      ultimoAtcceso: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });

    // Crear tabla modulos
    await queryInterface.createTable("modulos", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      nombre: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true,
      },
      slug: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true,
      },
      descripcion: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      icono: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      ruta: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      orden: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      estado: {
        type: Sequelize.ENUM("activo", "inactivo"),
        allowNull: false,
        defaultValue: "activo",
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });

    // Crear tabla permisos
    await queryInterface.createTable("permisos", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      rol_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "roles",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      modulo_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "modulos",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      crear: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      leer: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      actualizar: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      eliminar: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });

    // 5. Crear tabla categorias
    await queryInterface.createTable("categorias", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      nombre: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true,
      },
      descripcion: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      estado: {
        type: Sequelize.ENUM("activo", "inactivo"),
        allowNull: false,
        defaultValue: "activo",
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });

    // 6. Crear tabla marcas
    await queryInterface.createTable("marcas", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      nombre: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true,
      },
      descripcion: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      estado: {
        type: Sequelize.ENUM("activo", "inactivo"),
        allowNull: false,
        defaultValue: "activo",
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });

    // 7. Crear tabla medidas
    await queryInterface.createTable("medidas", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      nombre: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true,
      },
      abreviatura: {
        type: Sequelize.STRING(10),
        allowNull: false,
        unique: true,
      },
      descripcion: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      estado: {
        type: Sequelize.ENUM("activo", "inactivo"),
        allowNull: false,
        defaultValue: "activo",
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });

    // 8. Crear tabla clientes
    await queryInterface.createTable("clientes", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      nombre: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      nit: {
        type: Sequelize.STRING(20),
        allowNull: true,
        unique: true,
      },
      telefono: {
        type: Sequelize.STRING(20),
        allowNull: true,
      },
      email: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      direccion: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      tipo: {
        type: Sequelize.ENUM("individual", "empresa"),
        allowNull: false,
        defaultValue: "individual",
      },
      limite_credito: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.0,
      },
      saldo_actual: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.0,
      },
      estado: {
        type: Sequelize.ENUM("activo", "inactivo"),
        allowNull: false,
        defaultValue: "activo",
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });

    // 9. Crear tabla proveedores
    await queryInterface.createTable("proveedores", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      empresa: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true,
      },
      contacto: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      nit: {
        type: Sequelize.STRING(20),
        allowNull: true,
      },
      telefono: {
        type: Sequelize.STRING(20),
        allowNull: true,
      },
      email: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      direccion: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      estado: {
        type: Sequelize.ENUM("activo", "inactivo"),
        allowNull: false,
        defaultValue: "activo",
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });

    // 10. Crear tabla productos
    await queryInterface.createTable("productos", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      codigo: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true,
      },
      nombre: {
        type: Sequelize.STRING(150),
        allowNull: false,
      },
      descripcion: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      precio_costo: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.0,
      },
      precio_venta: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.0,
      },
      stock_actual: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      stock_minimo: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      stock_maximo: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 100,
      },
      imagen: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      categoria_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "categorias",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },
      marca_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "marcas",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },
      medida_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "medidas",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },
      estado: {
        type: Sequelize.ENUM("activo", "inactivo"),
        allowNull: false,
        defaultValue: "activo",
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });

    // 11. Crear tabla compras
    await queryInterface.createTable("compras", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      numero_compra: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true,
      },
      fecha: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      proveedor_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "proveedores",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },
      total: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.0,
      },
      tipo_pago: {
        type: Sequelize.ENUM("contado", "credito"),
        allowNull: false,
        defaultValue: "contado",
      },
      estado: {
        type: Sequelize.ENUM("pendiente", "completada", "cancelada"),
        allowNull: false,
        defaultValue: "completada",
      },
      observaciones: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      usuario_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "usuarios",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });

    // 12. Crear tabla detalle_compras
    await queryInterface.createTable("detalle_compras", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      compra_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "compras",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      producto_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "productos",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },
      cantidad: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      precio_unitario: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      subtotal: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });

    // 13. Crear tabla ventas
    await queryInterface.createTable("ventas", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      numero_venta: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true,
      },
      fecha: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      cliente_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "clientes",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },
      total: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.0,
      },
      tipo_pago: {
        type: Sequelize.ENUM("efectivo", "tarjeta", "credito", "transferencia"),
        allowNull: false,
        defaultValue: "efectivo",
      },
      estado: {
        type: Sequelize.ENUM("pendiente", "completada", "cancelada"),
        allowNull: false,
        defaultValue: "completada",
      },
      observaciones: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      usuario_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "usuarios",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });

    // 14. Crear tabla detalle_ventas
    await queryInterface.createTable("detalle_ventas", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      venta_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "ventas",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      producto_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "productos",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },
      cantidad: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      precio_unitario: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      subtotal: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });

    // 15. Crear tabla cajas
    await queryInterface.createTable("cajas", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      fecha_apertura: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      fecha_cierre: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      monto_inicial: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.0,
      },
      monto_final: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
      },
      total_ingresos: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.0,
      },
      total_egresos: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.0,
      },
      saldo_esperado: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
      },
      diferencia: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
        defaultValue: 0.0,
      },
      estado: {
        type: Sequelize.ENUM("abierta", "cerrada"),
        allowNull: false,
        defaultValue: "abierta",
      },
      observaciones_apertura: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      observaciones_cierre: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      usuario_apertura: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "usuarios",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },
      usuario_cierre: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "usuarios",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });

    // 16. Crear tabla movimientos_caja
    await queryInterface.createTable("movimientos_caja", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      caja_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "cajas",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      tipo: {
        type: Sequelize.ENUM("apertura", "ingreso", "egreso", "cierre"),
        allowNull: false,
      },
      concepto: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      descripcion: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      monto: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      referencia: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      venta_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "ventas",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      compra_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "compras",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      usuario_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "usuarios",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });

    // Crear índices para mejorar el rendimiento
    await queryInterface.addIndex("usuarios", ["email"]);
    await queryInterface.addIndex("usuarios", ["estado"]);
    await queryInterface.addIndex("usuarios", ["rol_id"]);
    await queryInterface.addIndex("modulos", ["slug"]);
    await queryInterface.addIndex("modulos", ["estado"]);
    await queryInterface.addIndex("permisos", ["rol_id", "modulo_id"], {
      unique: true,
    });
    await queryInterface.addIndex("productos", ["codigo"]);
    await queryInterface.addIndex("productos", ["estado"]);
    await queryInterface.addIndex("productos", ["categoria_id"]);
    await queryInterface.addIndex("productos", ["marca_id"]);
    await queryInterface.addIndex("clientes", ["nit"]);
    await queryInterface.addIndex("clientes", ["estado"]);
    await queryInterface.addIndex("proveedores", ["empresa"]);
    await queryInterface.addIndex("proveedores", ["estado"]);
    await queryInterface.addIndex("compras", ["numero_compra"]);
    await queryInterface.addIndex("compras", ["fecha"]);
    await queryInterface.addIndex("compras", ["estado"]);
    await queryInterface.addIndex("ventas", ["numero_venta"]);
    await queryInterface.addIndex("ventas", ["fecha"]);
    await queryInterface.addIndex("ventas", ["estado"]);
    await queryInterface.addIndex("cajas", ["estado"]);
    await queryInterface.addIndex("cajas", ["fecha_apertura"]);
    await queryInterface.addIndex("movimientos_caja", ["caja_id"]);
    await queryInterface.addIndex("movimientos_caja", ["tipo"]);
    await queryInterface.addIndex("movimientos_caja", ["created_at"]);
  },

  down: async (queryInterface, Sequelize) => {
    // Eliminar tablas en orden inverso para evitar problemas con foreign keys
    await queryInterface.dropTable("movimientos_caja");
    await queryInterface.dropTable("cajas");
    await queryInterface.dropTable("detalle_ventas");
    await queryInterface.dropTable("ventas");
    await queryInterface.dropTable("detalle_compras");
    await queryInterface.dropTable("compras");
    await queryInterface.dropTable("productos");
    await queryInterface.dropTable("proveedores");
    await queryInterface.dropTable("clientes");
    await queryInterface.dropTable("medidas");
    await queryInterface.dropTable("marcas");
    await queryInterface.dropTable("categorias");
    await queryInterface.dropTable("permisos");
    await queryInterface.dropTable("modulos");
    await queryInterface.dropTable("usuarios");
    await queryInterface.dropTable("roles");
  },
};
