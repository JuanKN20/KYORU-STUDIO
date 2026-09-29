const MIME_EXTENSION_MAP = Object.freeze({
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
});

const PNG_SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
const WEBP_CHUNK_TYPES = new Set(['VP8 ', 'VP8L', 'VP8X']);

function invalidImage(message) {
  const error = new Error(message);
  error.status = 400;
  error.code = 'INVALID_IMAGE_UPLOAD';
  return error;
}

function isAllowedImageMime(mimeType) {
  return Object.hasOwn(MIME_EXTENSION_MAP, mimeType);
}

function detectImageMime(buffer) {
  if (!Buffer.isBuffer(buffer)) return null;

  if (
    buffer.length >= 3 &&
    buffer[0] === 0xff &&
    buffer[1] === 0xd8 &&
    buffer[2] === 0xff
  ) {
    return 'image/jpeg';
  }

  if (buffer.length >= PNG_SIGNATURE.length && buffer.subarray(0, 8).equals(PNG_SIGNATURE)) {
    return 'image/png';
  }

  if (
    buffer.length >= 16 &&
    buffer.toString('ascii', 0, 4) === 'RIFF' &&
    buffer.toString('ascii', 8, 12) === 'WEBP' &&
    WEBP_CHUNK_TYPES.has(buffer.toString('ascii', 12, 16))
  ) {
    return 'image/webp';
  }

  return null;
}

function validateImageFile(file) {
  if (!file || !Buffer.isBuffer(file.buffer) || file.buffer.length === 0) {
    throw invalidImage('Archivo inválido. Intenta subir la imagen de nuevo.');
  }

  if (!isAllowedImageMime(file.mimetype)) {
    throw invalidImage('Tipo de archivo no permitido. Usa JPG, PNG o WEBP.');
  }

  const detectedMime = detectImageMime(file.buffer);
  if (!detectedMime || detectedMime !== file.mimetype) {
    throw invalidImage('El contenido del archivo no coincide con un formato de imagen permitido.');
  }

  return detectedMime;
}

function getImageExtension(mimeType) {
  const extension = MIME_EXTENSION_MAP[mimeType];
  if (!extension) {
    throw invalidImage('Tipo de archivo no permitido. Usa JPG, PNG o WEBP.');
  }
  return extension;
}

module.exports = {
  getImageExtension,
  isAllowedImageMime,
  validateImageFile,
};
