// middlewares/upload.js
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { handleErrorResponse } = require("../helpers/handleError");

// Crear directorios si no existen
const createDirectories = () => {
  const dirs = [
    "public",
    "public/uploads",
    "public/uploads/usuarios",
    "public/uploads/productos",
    "public/uploads/temp",
  ];

  dirs.forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
};

createDirectories();

// Configuración de almacenamiento
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Guardar temporalmente en la carpeta temp
    cb(null, "public/uploads/temp");
  },
  filename: (req, file, cb) => {
    // Generar nombre único para el archivo
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});

// Filtro para validar tipos de archivo
const fileFilter = (req, file, cb) => {
  // Tipos de archivo permitidos
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error("Solo se permiten imágenes (jpeg, jpg, png, gif, webp)"));
  }
};

// Configuración de multer
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB máximo
  },
  fileFilter: fileFilter,
});

// Middleware para subir imagen de usuario
const uploadUsuarioImage = upload.single("imagen");

// Middleware para subir imagen de producto
const uploadProductoImage = upload.single("imagen");

// Middleware para manejar errores de multer
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      handleErrorResponse(
        res,
        "El archivo es demasiado grande. Máximo 5MB.",
        400
      );
      return;
    }
    handleErrorResponse(res, `Error al subir archivo: ${err.message}`, 400);
    return;
  } else if (err) {
    handleErrorResponse(res, err.message, 400);
    return;
  }
  next();
};

module.exports = {
  uploadUsuarioImage,
  uploadProductoImage,
  handleMulterError,
};
