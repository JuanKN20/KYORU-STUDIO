import React, { useEffect, useRef, useState } from 'react';
import { ADMIN_IMAGE_ACCEPT, ContentStatus, uploadAdminImage, validateAdminImageFile } from '../adminApi';

export type ProductFormValues = {
  title: string;
  slug: string;
  type: string;
  shortDescription: string;
  longDescription: string;
  priceLabel: string;
  status: ContentStatus;
  coverImageUrl: string;
  galleryUrlsText: string;
  tagsText: string;
  featured: boolean;
  sortOrder: number;
  publishedAt: string;
};

type ProductFormProps = {
  initialValues?: ProductFormValues;
  onSubmit: (values: ProductFormValues) => Promise<void>;
  onCancel: () => void;
  submitting: boolean;
};

const defaultValues: ProductFormValues = {
  title: '',
  slug: '',
  type: '',
  shortDescription: '',
  longDescription: '',
  priceLabel: '',
  status: 'draft',
  coverImageUrl: '',
  galleryUrlsText: '',
  tagsText: '',
  featured: false,
  sortOrder: 0,
  publishedAt: '',
};

const ProductForm: React.FC<ProductFormProps> = ({ initialValues, onSubmit, onCancel, submitting }) => {
  const [form, setForm] = useState<ProductFormValues>(initialValues || defaultValues);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState('');
  const [uploadError, setUploadError] = useState('');
  const coverFileInputRef = useRef<HTMLInputElement>(null);
  const galleryFileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setForm(initialValues || defaultValues);
    setCoverFile(null);
    setGalleryFiles([]);
    setUploadingCover(false);
    setUploadingGallery(false);
    setUploadSuccess('');
    setUploadError('');
    if (coverFileInputRef.current) coverFileInputRef.current.value = '';
    if (galleryFileInputRef.current) galleryFileInputRef.current.value = '';
  }, [initialValues]);

  const handleChange = (field: keyof ProductFormValues, value: string | number | boolean) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const appendGalleryUrls = (uploadedUrls: string[]) => {
    setForm((previous) => {
      const currentUrls = previous.galleryUrlsText
        .split(/[\n,]+/)
        .map((item) => item.trim())
        .filter(Boolean);
      const merged = Array.from(new Set([...currentUrls, ...uploadedUrls]));

      return {
        ...previous,
        galleryUrlsText: merged.join('\n'),
      };
    });
  };

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await onSubmit(form);
  };

  const handleCoverUpload = async () => {
    if (!coverFile) {
      setUploadError('Selecciona una imagen de portada antes de subir.');
      setUploadSuccess('');
      return;
    }

    setUploadingCover(true);
    setUploadError('');
    setUploadSuccess('');

    try {
      validateAdminImageFile(coverFile);
      const { url } = await uploadAdminImage(coverFile, 'products');
      handleChange('coverImageUrl', url);
      setUploadSuccess('Imagen de portada subida correctamente.');
      setCoverFile(null);
      if (coverFileInputRef.current) coverFileInputRef.current.value = '';
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'Error al subir imagen.');
    } finally {
      setUploadingCover(false);
    }
  };

  const handleGalleryUpload = async () => {
    if (galleryFiles.length === 0) {
      setUploadError('Selecciona una o varias imágenes para la galería.');
      setUploadSuccess('');
      return;
    }

    setUploadingGallery(true);
    setUploadError('');
    setUploadSuccess('');
    const uploadedUrls: string[] = [];

    try {
      galleryFiles.forEach(validateAdminImageFile);
      for (const file of galleryFiles) {
        const uploaded = await uploadAdminImage(file, 'products');
        uploadedUrls.push(uploaded.url);
      }
      appendGalleryUrls(uploadedUrls);
      setUploadSuccess('Imágenes de galería subidas correctamente.');
      setGalleryFiles([]);
      if (galleryFileInputRef.current) galleryFileInputRef.current.value = '';
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error al subir imágenes de galería.';

      if (uploadedUrls.length > 0) {
        appendGalleryUrls(uploadedUrls);
        setGalleryFiles([]);
        if (galleryFileInputRef.current) galleryFileInputRef.current.value = '';
        setUploadError(
          `${uploadedUrls.length} ${uploadedUrls.length === 1 ? 'imagen quedó conservada' : 'imágenes quedaron conservadas'} en el formulario. ${message}`,
        );
      } else {
        setUploadError(message);
      }
    } finally {
      setUploadingGallery(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid gap-3 md:grid-cols-2">
        <div className="md:col-span-2">
          <label htmlFor="product-title" className="admin-label">
            Título *
          </label>
          <input
            id="product-title"
            required
            value={form.title}
            onChange={(event) => handleChange('title', event.target.value)}
            className="admin-input"
          />
        </div>

        <div>
          <label htmlFor="product-slug" className="admin-label">
            Slug (opcional)
          </label>
          <input
            id="product-slug"
            value={form.slug}
            onChange={(event) => handleChange('slug', event.target.value)}
            className="admin-input"
          />
        </div>

        <div>
          <label htmlFor="product-type" className="admin-label">
            Tipo *
          </label>
          <input
            id="product-type"
            required
            value={form.type}
            onChange={(event) => handleChange('type', event.target.value)}
            className="admin-input"
          />
        </div>

        <div className="md:col-span-2">
          <label htmlFor="product-short-description" className="admin-label">
            Descripción corta *
          </label>
          <textarea
            id="product-short-description"
            required
            rows={2}
            value={form.shortDescription}
            onChange={(event) => handleChange('shortDescription', event.target.value)}
            className="admin-textarea min-h-20"
          />
        </div>

        <div className="md:col-span-2">
          <label htmlFor="product-long-description" className="admin-label">
            Descripción larga
          </label>
          <textarea
            id="product-long-description"
            rows={3}
            value={form.longDescription}
            onChange={(event) => handleChange('longDescription', event.target.value)}
            className="admin-textarea"
          />
        </div>

        <div>
          <label htmlFor="product-price-label" className="admin-label">
            Price label
          </label>
          <input
            id="product-price-label"
            value={form.priceLabel}
            onChange={(event) => handleChange('priceLabel', event.target.value)}
            className="admin-input"
          />
        </div>

        <div>
          <label htmlFor="product-status" className="admin-label">
            Estado
          </label>
          <select
            id="product-status"
            value={form.status}
            onChange={(event) => handleChange('status', event.target.value as ContentStatus)}
            className="admin-select"
          >
            <option value="draft">Borrador</option>
            <option value="published">Publicado</option>
            <option value="archived">Archivado</option>
            <option value="coming_soon">Próximamente</option>
          </select>
          <p className="admin-note mt-1.5">
            Solo «Publicado» es visible mediante la API pública. Los demás estados permanecen internos.
          </p>
        </div>

        <div className="md:col-span-2">
          <label htmlFor="product-cover-image-url" className="admin-label">
            Cover image URL
          </label>
          <input
            id="product-cover-image-url"
            value={form.coverImageUrl}
            onChange={(event) => handleChange('coverImageUrl', event.target.value)}
            className="admin-input"
          />
          <label htmlFor="product-cover-image-file" className="admin-label mt-3">
            Archivo de portada
          </label>
          <div className="mt-3 grid gap-2 sm:grid-cols-[1fr_auto]">
            <input
              id="product-cover-image-file"
              ref={coverFileInputRef}
              type="file"
              accept={ADMIN_IMAGE_ACCEPT}
              aria-describedby="product-cover-image-help"
              onChange={(event) => {
                setCoverFile(event.target.files?.[0] || null);
                setUploadError('');
                setUploadSuccess('');
              }}
              className="admin-input file:mr-3 file:rounded-lg file:border-0 file:bg-red-900/45 file:px-3 file:py-2 file:text-xs file:font-semibold file:text-red-100"
            />
            <button
              type="button"
              disabled={uploadingCover}
              onClick={() => void handleCoverUpload()}
              className="admin-btn-secondary"
            >
              {uploadingCover ? 'Subiendo...' : 'Subir imagen'}
            </button>
          </div>
          <p id="product-cover-image-help" className="admin-note mt-2">
            JPEG, PNG o WebP · máximo 5 MiB.
          </p>
          {form.coverImageUrl ? (
            <img
              src={form.coverImageUrl}
              alt="Preview portada producto"
              className="mt-3 h-24 w-40 rounded-lg border border-red-900/35 object-cover"
            />
          ) : null}
        </div>

        <div>
          <label htmlFor="product-sort-order" className="admin-label">
            Orden
          </label>
          <input
            id="product-sort-order"
            type="number"
            value={form.sortOrder}
            onChange={(event) => handleChange('sortOrder', Number(event.target.value))}
            className="admin-input"
          />
        </div>

        <div className="md:col-span-2">
          <label htmlFor="product-gallery-urls" className="admin-label">
            Gallery URLs (comas o líneas)
          </label>
          <textarea
            id="product-gallery-urls"
            rows={3}
            value={form.galleryUrlsText}
            onChange={(event) => handleChange('galleryUrlsText', event.target.value)}
            className="admin-textarea"
          />
          <label htmlFor="product-gallery-files" className="admin-label mt-3">
            Archivos de galería
          </label>
          <div className="mt-3 grid gap-2 sm:grid-cols-[1fr_auto]">
            <input
              id="product-gallery-files"
              ref={galleryFileInputRef}
              type="file"
              accept={ADMIN_IMAGE_ACCEPT}
              aria-describedby="product-gallery-files-help"
              multiple
              onChange={(event) => {
                setGalleryFiles(Array.from(event.target.files || []));
                setUploadError('');
                setUploadSuccess('');
              }}
              className="admin-input file:mr-3 file:rounded-lg file:border-0 file:bg-red-900/45 file:px-3 file:py-2 file:text-xs file:font-semibold file:text-red-100"
            />
            <button
              type="button"
              disabled={uploadingGallery}
              onClick={() => void handleGalleryUpload()}
              className="admin-btn-secondary"
            >
              {uploadingGallery ? 'Subiendo...' : 'Subir a galería'}
            </button>
          </div>
          <p id="product-gallery-files-help" className="admin-note mt-2">
            JPEG, PNG o WebP · máximo 5 MiB por imagen.
          </p>
        </div>

        <div>
          <label htmlFor="product-tags" className="admin-label">
            Tags (separadas por comas)
          </label>
          <input
            id="product-tags"
            value={form.tagsText}
            onChange={(event) => handleChange('tagsText', event.target.value)}
            className="admin-input"
          />
        </div>

        <div>
          <label htmlFor="product-published-at" className="admin-label">
            Published at (opcional)
          </label>
          <input
            id="product-published-at"
            type="datetime-local"
            value={form.publishedAt}
            onChange={(event) => handleChange('publishedAt', event.target.value)}
            className="admin-input"
          />
          <p className="admin-note mt-1.5">Esta fecha es metadata; no programa automáticamente la publicación.</p>
        </div>
      </div>

      {uploadSuccess ? (
        <p role="status" aria-live="polite" className="text-xs text-emerald-300">
          {uploadSuccess}
        </p>
      ) : null}
      {uploadError ? (
        <p role="alert" className="text-xs text-red-300">
          {uploadError}
        </p>
      ) : null}

      <label htmlFor="product-featured" className="inline-flex items-center gap-2 text-sm text-zinc-200">
        <input
          id="product-featured"
          type="checkbox"
          checked={form.featured}
          onChange={(event) => handleChange('featured', event.target.checked)}
          className="h-4 w-4 rounded border-red-700/40 bg-black/45"
        />
        Producto destacado (featured)
      </label>

      <div className="flex flex-wrap gap-2">
        <button type="submit" disabled={submitting} className="admin-btn-primary">
          {submitting ? 'Guardando...' : 'Guardar producto'}
        </button>
        <button type="button" onClick={onCancel} className="admin-btn-secondary">
          Cancelar
        </button>
      </div>
    </form>
  );
};

export default ProductForm;
