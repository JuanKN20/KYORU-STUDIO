const express = require('express');
const multer = require('multer');
const adminAuth = require('../middleware/adminAuth');
const uploadsController = require('../controllers/uploads.controller');
const { isAllowedImageMime } = require('../utils/imageValidation');

const router = express.Router();

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter(req, file, callback) {
    if (!isAllowedImageMime(file.mimetype)) {
      const error = new Error('Tipo de archivo no permitido. Usa JPG, PNG o WEBP.');
      error.status = 400;
      error.code = 'INVALID_IMAGE_UPLOAD';
      return callback(error);
    }

    return callback(null, true);
  },
  limits: {
    fileSize: MAX_FILE_SIZE_BYTES,
    files: 1,
    fields: 1,
    parts: 3,
    fieldSize: 64,
    fieldNameSize: 32,
    headerPairs: 20,
    fieldNestingDepth: 0,
    fieldArrayIndexLimit: 0,
  },
});

router.post('/admin/uploads/image', adminAuth, (req, res, next) => {
  upload.single('file')(req, res, (error) => {
    if (!error) {
      return uploadsController.uploadAdminImage(req, res, next);
    }

    if (error instanceof multer.MulterError) {
      if (error.code === 'LIMIT_FILE_SIZE') {
        return res.status(413).json({
          ok: false,
          error: 'Archivo muy pesado. El límite permitido es 5 MB.',
        });
      }

      return res.status(400).json({
        ok: false,
        error: 'Solicitud de archivo inválida.',
      });
    }

    return next(error);
  });
});

module.exports = router;
