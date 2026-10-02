import React, { useEffect, useMemo, useState } from 'react';
import { createProject, deleteProject, getAdminProjects, ProjectPayload, updateProject } from '../adminApi';
import { ProjectItem } from '../../services/api';
import ProjectForm, { ProjectFormValues } from './ProjectForm';

function splitCsv(value: string): string[] {
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function toDateTimeLocalValue(value: string | null): string {
  if (!value) return '';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return '';
  const offset = parsed.getTimezoneOffset() * 60000;
  return new Date(parsed.getTime() - offset).toISOString().slice(0, 16);
}

function toFormValues(item: ProjectItem): ProjectFormValues {
  return {
    title: item.title,
    slug: item.slug || '',
    category: item.category || '',
    shortDescription: item.short_description,
    longDescription: item.long_description || '',
    status: item.status,
    coverImageUrl: item.cover_image_url || '',
    demoUrl: item.demo_url || '',
    repositoryUrl: item.repository_url || '',
    technologiesText: item.technologies.join(', '),
    featured: item.featured,
    sortOrder: item.sort_order,
    publishedAt: toDateTimeLocalValue(item.published_at),
  };
}

function statusClass(status: ProjectItem['status']): string {
  if (status === 'published') return 'border-emerald-500/50 bg-emerald-950/35 text-emerald-200';
  if (status === 'coming_soon') return 'border-sky-500/50 bg-sky-950/35 text-sky-200';
  if (status === 'archived') return 'border-zinc-500/45 bg-zinc-950/35 text-zinc-300';
  return 'border-amber-500/50 bg-amber-950/35 text-amber-200';
}

const statusLabels: Record<ProjectItem['status'], string> = {
  draft: 'Borrador',
  published: 'Publicado',
  archived: 'Archivado',
  coming_soon: 'Próximamente',
};

const AdminProjects: React.FC = () => {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [actionError, setActionError] = useState('');
  const [editorTarget, setEditorTarget] = useState<ProjectItem | null>(null);
  const [formRevision, setFormRevision] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [formError, setFormError] = useState('');

  const isEditing = Boolean(editorTarget);

  const sortedProjects = useMemo(
    () =>
      [...projects].sort((a, b) => {
        if (a.sort_order === b.sort_order) {
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        }
        return a.sort_order - b.sort_order;
      }),
    [projects],
  );

  const loadProjects = async () => {
    setLoading(true);
    setLoadError('');

    try {
      const data = await getAdminProjects();
      setProjects(data);
    } catch (loadError) {
      setLoadError(loadError instanceof Error ? loadError.message : 'No se pudieron cargar los proyectos.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadProjects();
  }, []);

  const openCreate = () => {
    setFormError('');
    setActionError('');
    setFormRevision((value) => value + 1);
    setEditorTarget(null);
  };

  const openEdit = (project: ProjectItem) => {
    setFormError('');
    setActionError('');
    setFormRevision((value) => value + 1);
    setEditorTarget(project);
  };

  const closeForm = () => {
    setEditorTarget(null);
    setFormError('');
    setFormRevision((value) => value + 1);
  };

  const handleSubmit = async (values: ProjectFormValues) => {
    const payload: ProjectPayload = {
      title: values.title.trim(),
      slug: values.slug.trim() || undefined,
      category: values.category.trim() || null,
      short_description: values.shortDescription.trim(),
      long_description: values.longDescription.trim() || null,
      status: values.status,
      cover_image_url: values.coverImageUrl.trim() || null,
      demo_url: values.demoUrl.trim() || null,
      repository_url: values.repositoryUrl.trim() || null,
      technologies: splitCsv(values.technologiesText),
      featured: values.featured,
      sort_order: values.sortOrder,
      published_at: values.publishedAt ? new Date(values.publishedAt).toISOString() : null,
    };

    setSubmitting(true);
    setFormError('');

    try {
      if (isEditing && editorTarget) {
        await updateProject(editorTarget.id, payload);
      } else {
        await createProject(payload);
      }

      await loadProjects();
      closeForm();
    } catch (submitError) {
      setFormError(submitError instanceof Error ? submitError.message : 'No se pudo guardar el proyecto.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (project: ProjectItem) => {
    const confirmed = window.confirm(`¿Eliminar el proyecto "${project.title}"? Esta acción no se puede deshacer.`);
    if (!confirmed) return;

    setDeletingId(project.id);
    setActionError('');

    try {
      await deleteProject(project.id);
      await loadProjects();
    } catch (deleteError) {
      setActionError(deleteError instanceof Error ? deleteError.message : 'No se pudo eliminar el proyecto.');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <section className="space-y-4">
      <header className="admin-surface flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <div>
          <p className="admin-kicker">Admin</p>
          <h1 className="text-2xl font-bold text-white">Proyectos</h1>
          <p className="text-sm text-zinc-300">Gestiona estado, prioridad, destacado y metadatos del portafolio corporativo.</p>
        </div>
        <button type="button" onClick={openCreate} className="admin-btn-primary">
          Nuevo proyecto
        </button>
      </header>

      <div className="admin-surface p-4 sm:p-5">
        <h2 className="mb-3 text-sm font-semibold text-red-200">{isEditing ? 'Editar proyecto' : 'Crear proyecto'}</h2>
        <ProjectForm
          key={`${editorTarget?.id ?? 'new'}-${formRevision}`}
          initialValues={editorTarget ? toFormValues(editorTarget) : undefined}
          onSubmit={handleSubmit}
          onCancel={closeForm}
          submitting={submitting}
        />
        {formError ? <p className="mt-3 text-sm text-red-200">{formError}</p> : null}
      </div>

      {loadError ? (
        <div role="alert" className="rounded-xl border border-red-700/60 bg-red-950/35 px-4 py-3 text-sm text-red-100">
          <p>{loadError}</p>
          <button type="button" onClick={() => void loadProjects()} className="admin-btn-secondary mt-3 px-3 py-2 text-xs">
            Reintentar
          </button>
        </div>
      ) : null}

      {actionError ? (
        <div role="alert" className="rounded-xl border border-amber-700/60 bg-amber-950/30 px-4 py-3 text-sm text-amber-100">
          {actionError}
        </div>
      ) : null}

      {loading ? <div className="admin-surface p-4 text-sm text-zinc-300">Cargando proyectos...</div> : null}

      {!loading && !loadError ? (
        <div className="grid gap-3">
          {sortedProjects.length === 0 ? (
            <div className="admin-surface p-5 text-sm text-zinc-300">Todavía no hay proyectos registrados.</div>
          ) : sortedProjects.map((project) => (
            <article key={project.id} className="akai-card p-4 sm:p-5">
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg font-semibold text-white">{project.title}</h3>
                    <span className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ${statusClass(project.status)}`}>
                      {statusLabels[project.status]}
                    </span>
                    {project.featured ? <span className="akai-chip border-red-500/70 text-red-100">featured</span> : null}
                  </div>
                  <p className="mt-1 text-xs text-zinc-400">
                    slug: {project.slug} • categoría: {project.category || '-'} • orden: {project.sort_order}
                  </p>
                  <p className="mt-2 text-sm text-zinc-300">{project.short_description}</p>
                  {project.technologies.length ? (
                    <p className="mt-2 text-xs text-zinc-400">Tecnologías: {project.technologies.join(', ')}</p>
                  ) : null}
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  <button type="button" onClick={() => openEdit(project)} className="admin-btn-secondary px-3 py-2 text-xs">
                    Editar
                  </button>
                  <button
                    type="button"
                    disabled={deletingId !== null}
                    onClick={() => void handleDelete(project)}
                    className="admin-btn-danger px-3 py-2 text-xs"
                  >
                    {deletingId === project.id ? 'Eliminando...' : 'Eliminar'}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : null}
    </section>
  );
};

export default AdminProjects;
