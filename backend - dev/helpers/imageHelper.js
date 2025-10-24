const sharp = require("sharp");
const fs = require("fs").promises;
const path = require("path");

/**
 * Procesar y mover imagen a su carpeta definitiva
 */
const procesarImagen = async (file, tipo, oldImagePath = null) => {
  try {
    if (!file) return null;

    const carpeta = tipo === "usuario" ? "usuarios" : "productos";
    const destPath = `public/uploads/${carpeta}`;

    // Asegurar que el directorio existe
    await fs.mkdir(destPath, { recursive: true });

    // Generar nombre único
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 8);
    const ext = path.extname(file.originalname).toLowerCase();
    const nombreArchivo = `${tipo}-${timestamp}-${randomStr}${ext}`;
    const rutaFinal = path.join(destPath, nombreArchivo);

    // Procesar imagen con sharp (optimizar y redimensionar)
    if (tipo === "usuario") {
      // Para usuarios: redimensionar a 300x300
      await sharp(file.path)
        .resize(300, 300, {
          fit: "cover",
          position: "center",
        })
        .jpeg({ quality: 90 })
        .toFile(rutaFinal);
    } else if (tipo === "producto") {
      // Para productos: redimensionar a 800x800 máximo
      await sharp(file.path)
        .resize(800, 800, {
          fit: "inside",
          withoutEnlargement: true,
        })
        .jpeg({ quality: 85 })
        .toFile(rutaFinal);
    }

    // Eliminar archivo temporal
    await fs.unlink(file.path);

    // Eliminar imagen anterior si existe
    if (oldImagePath) {
      await eliminarImagen(oldImagePath);
    }

    // Retornar la ruta relativa para guardar en BD
    return `/uploads/${carpeta}/${nombreArchivo}`;
  } catch (error) {
    // Limpiar archivo temporal en caso de error
    if (file && file.path) {
      try {
        await fs.unlink(file.path);
      } catch (unlinkError) {
        console.error("Error al eliminar archivo temporal:", unlinkError);
      }
    }
    throw error;
  }
};

/**
 * Eliminar imagen del servidor
 */
const eliminarImagen = async (imagePath) => {
  try {
    if (!imagePath) return;

    // Construir la ruta completa
    const rutaCompleta = path.join("public", imagePath);

    // Verificar si el archivo existe
    try {
      await fs.access(rutaCompleta);
      // Si existe, eliminarlo
      await fs.unlink(rutaCompleta);
      console.log("Imagen eliminada:", rutaCompleta);
    } catch (error) {
      // El archivo no existe, no hacer nada
      console.log("Imagen no encontrada para eliminar:", rutaCompleta);
    }
  } catch (error) {
    console.error("Error al eliminar imagen:", error);
    // No lanzar error, solo registrar
  }
};

/**
 * Validar si el archivo es una imagen
 */
const esImagenValida = (mimetype) => {
  const tiposPermitidos = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/webp",
  ];
  return tiposPermitidos.includes(mimetype);
};

module.exports = {
  procesarImagen,
  eliminarImagen,
  esImagenValida,
};
