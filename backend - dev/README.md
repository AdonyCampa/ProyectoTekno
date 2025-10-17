# Sistema de Gestión - Backend

Backend completo con Node.js, Express, Sequelize y MySQL.

## Características

- ✅ Autenticación con JWT
- ✅ Sistema de roles y permisos (RBAC)
- ✅ Gestión de usuarios
- ✅ 12 módulos del sistema
- ✅ Validaciones con express-validator
- ✅ Migraciones y seeders con Sequelize
- ✅ Middleware de permisos por módulo y acción (CRUD)

## Instalación

1. Clonar el repositorio
2. Instalar dependencias:

```bash
npm install
```

3. Configurar .env:

```bash
cp .env.example .env
# Editar .env con tus credenciales
```

4. Crear base de datos en MySQL:

```sql
CREATE DATABASE nombre_base_datos CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

5. Ejecutar migraciones:

```bash
npm run migrate
```

6. Ejecutar seeders (datos iniciales):

```bash
npm run seed
```

## Datos iniciales

El seeder crea:

- **4 roles**: Administrador, Gerente, Vendedor, Almacenista
- **12 módulos**: Caja, Ventas, Compras, Inventario, Productos, Proveedores, Clientes, Usuarios, Roles, Categorías, Marcas, Medidas
- **Usuario administrador**:
  - Email: admin@sistema.com
  - Password: admin123

## Uso

### Desarrollo

```bash
npm run dev
```

### Producción

```bash
npm start
```

## Endpoints Principales

### Autenticación

- POST /api/usuarios/login - Login
- GET /api/auth/permisos - Obtener permisos del usuario

### Usuarios

- GET /api/usuarios - Listar usuarios
- GET /api/usuarios/:id - Obtener usuario
- POST /api/usuarios - Crear usuario
- PUT /api/usuarios/:id - Actualizar usuario
- DELETE /api/usuarios/:id - Eliminar usuario
- PUT /api/usuarios/:id/cambiar-password - Cambiar contraseña

### Roles

- GET /api/roles - Listar roles
- GET /api/roles/:id - Obtener rol
- POST /api/roles - Crear rol
- PUT /api/roles/:id - Actualizar rol
- DELETE /api/roles/:id - Eliminar rol
- POST /api/roles/:rol_id/permisos - Asignar permisos
- GET /api/roles/:rol_id/permisos - Obtener permisos

### Módulos

- GET /api/modulos - Listar módulos
- GET /api/modulos/:id - Obtener módulo
- POST /api/modulos - Crear módulo
- PUT /api/modulos/:id - Actualizar módulo
- DELETE /api/modulos/:id - Eliminar módulo
- POST /api/modulos/inicializar - Inicializar módulos del sistema

## Sistema de Permisos

Cada rol tiene permisos por módulo con 4 acciones:

- **crear**: Permite crear registros
- **leer**: Permite ver registros
- **actualizar**: Permite modificar registros
- **eliminar**: Permite borrar registros

El middleware `validarPermisos(modulo, accion)` verifica automáticamente los permisos antes de ejecutar cada operación.

## Estructura del proyecto

```
backend/
├── config/
│   └── database.js
├── controllers/
│   ├── usuarioController.js
│   ├── rolController.js
│   ├── moduloController.js
│   └── cajaController.js
├── middlewares/
│   ├── validarCampos.js
│   ├── validarJWT.js
│   └── validarPermisos.js
├── migrations/
│   ├── YYYYMMDDHHMMSS-create-usuarios-roles.js
│   └── YYYYMMDDHHMMSS-create-cajas.js
├── models/
│   ├── Usuario.js
│   ├── Rol.js
│   ├── Modulo.js
│   ├── Permiso.js
│   ├── Caja.js
│   ├── MovimientoCaja.js
│   └── index.js
├── routes/
│   ├── usuarioRoutes.js
│   ├── rolRoutes.js
│   ├── moduloRoutes.js
│   └── cajaRoutes.js
├── seeders/
│   └── YYYYMMDDHHMMSS-seed-initial-data.js
├── validators/
│   ├── usuarioValidators.js
│   ├── rolValidators.js
│   ├── moduloValidators.js
│   └── cajaValidators.js
├── .env
├── .env.example
├── .gitignore
├── package.json
├── server.js
└── README.md
```

## Comandos útiles

```bash
# Resetear base de datos (elimina todo y vuelve a crear)
npm run db:reset

# Deshacer última migración
npm run migrate:undo

# Deshacer todos los seeders
npm run seed:undo
```

## Variables de entorno requeridas

- `NODE_ENV`: Entorno (development/production)
- `PORT`: Puerto del servidor
- `DB_HOST`: Host de MySQL
- `DB_PORT`: Puerto de MySQL
- `DB_NAME`: Nombre de la base de datos
- `DB_USER`: Usuario de MySQL
- `DB_PASSWORD`: Contraseña de MySQL
- `JWT_SECRET`: Clave secreta para JWT
- `JWT_EXPIRE`: Tiempo de expiración del token
- `CORS_ORIGIN`: Origen permitido para CORS

## Seguridad

- ✅ Contraseñas hasheadas con bcrypt
- ✅ Autenticación con JWT
- ✅ Validación de datos con express-validator
- ✅ Protección CORS configurada
- ✅ Middleware de permisos granular
- ✅ Soft delete para usuarios
- ✅ Validación de unicidad en emails

## Testing de la API

### Login

```bash
curl -X POST http://localhost:3000/api/usuarios/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@sistema.com",
    "password": "admin123"
  }'
```

### Obtener permisos (requiere token)

```bash
curl -X GET http://localhost:3000/api/auth/permisos \
  -H "Authorization: Bearer TU_TOKEN_AQUI"
```

### Crear usuario (requiere token y permisos)

```bash
curl -X POST http://localhost:3000/api/usuarios \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TU_TOKEN_AQUI" \
  -d '{
    "nombre": "Nuevo Usuario",
    "email": "usuario@ejemplo.com",
    "password": "password123",
    "telefono": "12345678",
    "rol_id": 3
  }'
```

### Asignar permisos a un rol

```bash
curl -X POST http://localhost:3000/api/roles/2/permisos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TU_TOKEN_AQUI" \
  -d '{
    "permisos": [
      {
        "modulo_id": 1,
        "crear": true,
        "leer": true,
        "actualizar": true,
        "eliminar": false
      },
      {
        "modulo_id": 2,
        "crear": true,
        "leer": true,
        "actualizar": true,
        "eliminar": true
      }
    ]
  }'
```

## Contribuir

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## Licencia

Este proyecto es privado y confidencial.
