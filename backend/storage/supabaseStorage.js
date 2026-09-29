const { randomUUID } = require('crypto');
const { createClient } = require('@supabase/supabase-js');
const { getImageExtension } = require('../utils/imageValidation');

const DEFAULT_BUCKET = 'yorurei-media';

function buildConfig() {
  const supabaseUrl = String(process.env.SUPABASE_URL || '').trim();
  const serviceRoleKey = String(process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim();
  const bucketName = String(process.env.SUPABASE_STORAGE_BUCKET || DEFAULT_BUCKET).trim();

  if (!supabaseUrl || !serviceRoleKey || !bucketName) {
    const error = new Error('Storage no configurado en el servidor. Faltan variables SUPABASE_*.');
    error.status = 500;
    throw error;
  }

  return {
    supabaseUrl,
    serviceRoleKey,
    bucketName,
  };
}

function buildObjectPath(folder, file) {
  const extension = getImageExtension(file.mimetype);
  const random = randomUUID();
  const timestamp = Date.now();
  const dateKey = new Date().toISOString().slice(0, 10);
  const fileName = `${timestamp}-${random}${extension}`;

  return `${folder}/${dateKey}/${fileName}`;
}

async function uploadImage(file, folder) {
  if (!file || !file.buffer || !file.size) {
    const error = new Error('Archivo inválido. Intenta subir la imagen de nuevo.');
    error.status = 400;
    throw error;
  }

  const { supabaseUrl, serviceRoleKey, bucketName } = buildConfig();
  const objectPath = buildObjectPath(folder, file);
  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  const { error: uploadError } = await supabase.storage
    .from(bucketName)
    .upload(objectPath, file.buffer, {
      contentType: file.mimetype,
      upsert: false,
      cacheControl: '3600',
    });

  if (uploadError) {
    const error = new Error(`Error al subir imagen a Supabase Storage: ${uploadError.message}`);
    error.status = 502;
    throw error;
  }

  const { data } = supabase.storage.from(bucketName).getPublicUrl(objectPath);
  if (!data || !data.publicUrl) {
    const error = new Error('No se pudo obtener la URL pública de la imagen.');
    error.status = 502;
    throw error;
  }

  return {
    publicUrl: data.publicUrl,
    path: objectPath,
  };
}

module.exports = {
  uploadImage,
};
