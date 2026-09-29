const { uploadImage } = require('../storage/supabaseStorage');
const { validateImageFile } = require('../utils/imageValidation');

const ALLOWED_FOLDERS = new Set(['projects', 'products', 'general']);

function resolveFolder(req) {
  const bodyFolder = typeof req.body?.folder === 'string' ? req.body.folder : '';
  const queryFolder = typeof req.query?.folder === 'string' ? req.query.folder : '';
  const value = (bodyFolder || queryFolder || 'general').trim().toLowerCase();

  if (!ALLOWED_FOLDERS.has(value)) {
    const error = new Error('Carpeta inválida. Usa projects, products o general.');
    error.status = 400;
    throw error;
  }

  return value;
}

async function uploadAdminImage(req, res, next) {
  try {
    const folder = resolveFolder(req);

    if (!req.file) {
      return res.status(400).json({
        ok: false,
        error: 'Archivo requerido. Envía la imagen en el campo "file".',
      });
    }

    validateImageFile(req.file);

    const result = await uploadImage(req.file, folder);

    return res.status(201).json({
      ok: true,
      url: result.publicUrl,
      path: result.path,
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  uploadAdminImage,
};
