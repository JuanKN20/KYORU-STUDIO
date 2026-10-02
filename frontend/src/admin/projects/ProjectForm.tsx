import React, { useEffect, useRef, useState } from 'react';
import { ADMIN_IMAGE_ACCEPT, ContentStatus, uploadAdminImage, validateAdminImageFile } from '../adminApi';

export type ProjectFormValues = {
  title: string;
  slug: string;
  category: string;
  shortDescription: string;
  longDescription: string;
  status: ContentStatus;
  coverImageUrl: string;
  demoUrl: string;
  repositoryUrl: string;
  technologiesText: string;
  featured: boolean;
  sortOrder: number;
  publishedAt: string;
};

type ProjectFormProps = {
  initialValues?: ProjectFormValues;
  onSubmit: (values: ProjectFormValues) => Promise<void>;
  onCancel: () => void;
  submitting: boolean;
};

const defaultValues: ProjectFormValues = {
  title: '',
  slug: '',
  category: '',
  shortDescription: '',
  longDescription: '',
  status: 'draft',
  coverImageUrl: '',
  demoUrl: '',
  repositoryUrl: '',
  technologiesText: '',
  featured: false,
  sortOrder: 0,
  publishedAt: '',
};

const ProjectForm: React.FC<ProjectFormProps> = ({ initialValues, onSubmit, onCancel, submitting }) => {
  const [form, setForm] = useState<ProjectFormValues>(initialValues || defaultValues);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState('');
  const [uploadError, setUploadError] = useState('');
  const coverFileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setForm(initialValues || defaultValues);
    setCoverFile(null);
    setUploadingCover(false);
    setUploadSuccess('');
    setUploadError('');
    if (coverFileInputRef.current) coverFileInputRef.current.value = '';
  }, [initialValues]);

  const handleChange = (field: keyof ProjectFormValues, value: string | number | boolean) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await onSubmit(form);
  };

  const handleCoverUpload = async () => {
    if (!coverFile) {
      setUploadError('Selecciona una imagen antes de subir.');
      setUploadSuccess('');
      return;
    }

    setUploadingCover(true);
    setUploadError('');
    setUploadSuccess('');

    try {
      validateAdminImageFile(coverFile);
      const { url } = await uploadAdminImage(coverFile, 'projects');
      handleChange('coverImageUrl', url);
      setUploadSuccess('Imagen subida correctamente.');
      setCoverFile(null);
      if (coverFileInputRef.current) coverFileInputRef.current.value = '';
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'Error al subir imagen.');
    } finally {
      setUploadingCover(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid gap-3 md:grid-cols-2">
        <div className="md:col-span-2">
          <label htmlFor="project-title" className="admin-label">
            Título *
          </label>
          <input
            id="project-title"
            required
            value={form.title}
            onChange={(event) => handleChange('title', event.target.value)}
            className="admin-input"
          />
        </div>

        <div>
          <label htmlFor="project-slug" className="admin-label">
            Slug (opcional)
          </label>
          <input
            id="project-slug"
            value={form.slug}
            onChange={(event) => handleChange('slug', event.target.value)}
            className="admin-input"
          />
        </div>

        <div>
          <label htmlFor="project-category" className="admin-label">
            Categoría
          </label>
          <input
            id="project-category"
            value={form.category}
            onChange={(event) => handleChange('category', event.target.value)}
            className="admin-input"
          />
        </div>

        <div className="md:col-span-2">
          <label htmlFor="project-short-description" className="admin-label">
            Descripción corta *
          </label>
          <textarea
            id="project-short-description"
            required
            rows={2}
            value={form.shortDescription}
            onChange={(event) => handleChange('shortDescription', event.target.value)}
            className="admin-textarea min-h-20"
          />
        </div>

        <div className="md:col-span-2">
          <label htmlFor="project-long-description" className="admin-label">
            Descripción larga
          </label>
          <textarea
            id="project-long-description"
            rows={3}
            value={form.longDescription}
            onChange={(event) => handleChange('longDescription', event.target.value)}
            className="admin-textarea min-h-24"
          />
        </div>

        <div>
          <label htmlFor="project-status" className="admin-label">
            Estado
          </label>
          <select
            id="project-status"
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

        <div>
          <label htmlFor="project-sort-order" className="admin-label">
            Orden
          </label>
          <input
            id="project-sort-order"
            type="number"
            value={form.sortOrder}
            onChange={(event) => handleChange('sortOrder', Number(event.target.value))}
            className="admin-input"
          />
        </div>

        <div className="md:col-span-2">
          <label htmlFor="project-technologies" className="admin-label">
            Tecnologías (separadas por comas)
          </label>
          <textarea
            id="project-technologies"
            rows={2}
            value={form.technologiesText}
            onChange={(event) => handleChange('technologiesText', event.target.value)}
            className="admin-textarea min-h-20"
          />
        </div>

        <div className="md:col-span-2">
          <label htmlFor="project-cover-image-url" className="admin-label">
            Cover image URL
          </label>
          <input
            id="project-cover-image-url"
            value={form.coverImageUrl}
            onChange={(event) => handleChange('coverImageUrl', event.target.value)}
            className="admin-input"
          />
          <label htmlFor="project-cover-image-file" className="admin-label mt-3">
            Archivo de portada
          </label>
          <div className="mt-3 grid gap-2 sm:grid-cols-[1fr_auto]">
            <input
              id="project-cover-image-file"
              ref={coverFileInputRef}
              type="file"
              accept={ADMIN_IMAGE_ACCEPT}
              aria-describedby="project-cover-image-help"
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
          <p id="project-cover-image-help" className="admin-note mt-2">
            JPEG, PNG o WebP · máximo 5 MiB.
          </p>
          {uploadSuccess ? (
            <p role="status" aria-live="polite" className="mt-2 text-xs text-emerald-300">
              {uploadSuccess}
            </p>
          ) : null}
          {uploadError ? (
            <p role="alert" className="mt-2 text-xs text-red-300">
              {uploadError}
            </p>
          ) : null}
          {form.coverImageUrl ? (
            <img
              src={form.coverImageUrl}
              alt="Preview portada proyecto"
              className="mt-3 h-24 w-40 rounded-lg border border-red-900/35 object-cover"
            />
          ) : null}
        </div>

        <div>
          <label htmlFor="project-demo-url" className="admin-label">
            Demo URL
          </label>
          <input
            id="project-demo-url"
            value={form.demoUrl}
            onChange={(event) => handleChange('demoUrl', event.target.value)}
            className="admin-input"
          />
        </div>

        <div>
          <label htmlFor="project-repository-url" className="admin-label">
            Repository URL
          </label>
          <input
            id="project-repository-url"
            value={form.repositoryUrl}
            onChange={(event) => handleChange('repositoryUrl', event.target.value)}
            className="admin-input"
          />
        </div>

        <div>
          <label htmlFor="project-published-at" className="admin-label">
            Published at (opcional)
          </label>
          <input
            id="project-published-at"
            type="datetime-local"
            value={form.publishedAt}
            onChange={(event) => handleChange('publishedAt', event.target.value)}
            className="admin-input"
          />
          <p className="admin-note mt-1.5">Esta fecha es metadata; no programa automáticamente la publicación.</p>
        </div>
      </div>

      <label htmlFor="project-featured" className="inline-flex items-center gap-2 text-sm text-zinc-200">
        <input
          id="project-featured"
          type="checkbox"
          checked={form.featured}
          onChange={(event) => handleChange('featured', event.target.checked)}
          className="h-4 w-4 rounded border-red-700/40 bg-black/45"
        />
        Proyecto destacado (featured)
      </label>

      <div className="flex flex-wrap gap-2">
        <button type="submit" disabled={submitting} className="admin-btn-primary">
          {submitting ? 'Guardando...' : 'Guardar proyecto'}
        </button>
        <button type="button" onClick={onCancel} className="admin-btn-secondary">
          Cancelar
        </button>
      </div>
    </form>
  );
};

export default ProjectForm;
