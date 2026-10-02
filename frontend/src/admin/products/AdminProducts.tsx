import React, { useEffect, useMemo, useState } from 'react';
import { createProduct, deleteProduct, getAdminProducts, ProductPayload, updateProduct } from '../adminApi';
import { ProductItem } from '../../services/api';
import ProductForm, { ProductFormValues } from './ProductForm';

function splitByCommaOrLine(value: string): string[] {
  return value
    .split(/[\n,]+/)
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

function toFormValues(item: ProductItem): ProductFormValues {
  return {
    title: item.title,
    slug: item.slug || '',
    type: item.type,
    shortDescription: item.short_description,
    longDescription: item.long_description || '',
    priceLabel: item.price_label || '',
    status: item.status,
    coverImageUrl: item.cover_image_url || '',
    galleryUrlsText: item.gallery_urls.join('\n'),
    tagsText: item.tags.join(', '),
    featured: item.featured,
    sortOrder: item.sort_order,
    publishedAt: toDateTimeLocalValue(item.published_at),
  };
}

function statusClass(status: ProductItem['status']): string {
  if (status === 'published') return 'border-emerald-500/50 bg-emerald-950/35 text-emerald-200';
  if (status === 'coming_soon') return 'border-sky-500/50 bg-sky-950/35 text-sky-200';
  if (status === 'archived') return 'border-zinc-500/45 bg-zinc-950/35 text-zinc-300';
  return 'border-amber-500/50 bg-amber-950/35 text-amber-200';
}

const statusLabels: Record<ProductItem['status'], string> = {
  draft: 'Borrador',
  published: 'Publicado',
  archived: 'Archivado',
  coming_soon: 'Próximamente',
};

const AdminProducts: React.FC = () => {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [actionError, setActionError] = useState('');
  const [editorTarget, setEditorTarget] = useState<ProductItem | null>(null);
  const [formRevision, setFormRevision] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [formError, setFormError] = useState('');

  const isEditing = Boolean(editorTarget);

  const sortedProducts = useMemo(
    () =>
      [...products].sort((a, b) => {
        if (a.sort_order === b.sort_order) {
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        }
        return a.sort_order - b.sort_order;
      }),
    [products],
  );

  const loadProducts = async () => {
    setLoading(true);
    setLoadError('');

    try {
      const data = await getAdminProducts();
      setProducts(data);
    } catch (loadError) {
      setLoadError(loadError instanceof Error ? loadError.message : 'No se pudieron cargar los productos.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadProducts();
  }, []);

  const openCreate = () => {
    setFormError('');
    setActionError('');
    setFormRevision((value) => value + 1);
    setEditorTarget(null);
  };

  const openEdit = (product: ProductItem) => {
    setFormError('');
    setActionError('');
    setFormRevision((value) => value + 1);
    setEditorTarget(product);
  };

  const closeForm = () => {
    setEditorTarget(null);
    setFormError('');
    setFormRevision((value) => value + 1);
  };

  const handleSubmit = async (values: ProductFormValues) => {
    const payload: ProductPayload = {
      title: values.title.trim(),
      slug: values.slug.trim() || undefined,
      type: values.type.trim(),
      short_description: values.shortDescription.trim(),
      long_description: values.longDescription.trim() || null,
      price_label: values.priceLabel.trim() || null,
      status: values.status,
      cover_image_url: values.coverImageUrl.trim() || null,
      gallery_urls: splitByCommaOrLine(values.galleryUrlsText),
      tags: splitByCommaOrLine(values.tagsText),
      featured: values.featured,
      sort_order: values.sortOrder,
      published_at: values.publishedAt ? new Date(values.publishedAt).toISOString() : null,
    };

    setSubmitting(true);
    setFormError('');

    try {
      if (isEditing && editorTarget) {
        await updateProduct(editorTarget.id, payload);
      } else {
        await createProduct(payload);
      }

      await loadProducts();
      closeForm();
    } catch (submitError) {
      setFormError(submitError instanceof Error ? submitError.message : 'No se pudo guardar el producto.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (product: ProductItem) => {
    const confirmed = window.confirm(`¿Eliminar el producto "${product.title}"?`);
    if (!confirmed) return;

    setDeletingId(product.id);
    setActionError('');

    try {
      await deleteProduct(product.id);
      await loadProducts();
    } catch (deleteError) {
      setActionError(deleteError instanceof Error ? deleteError.message : 'No se pudo eliminar el producto.');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <section className="space-y-4">
      <header className="admin-surface flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <div>
          <p className="admin-kicker">Admin</p>
          <h1 className="text-2xl font-bold text-white">Productos</h1>
          <p className="text-sm text-zinc-300">Gestiona tipo, estado de publicación, etiquetas y orden de catálogo.</p>
        </div>
        <button type="button" onClick={openCreate} className="admin-btn-primary">
          Nuevo producto
        </button>
      </header>

      <div className="admin-surface p-4 sm:p-5">
        <h2 className="mb-3 text-sm font-semibold text-red-200">{isEditing ? 'Editar producto' : 'Crear producto'}</h2>
        <ProductForm
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
          <button type="button" onClick={() => void loadProducts()} className="admin-btn-secondary mt-3 px-3 py-2 text-xs">
            Reintentar
          </button>
        </div>
      ) : null}

      {actionError ? (
        <div role="alert" className="rounded-xl border border-amber-700/60 bg-amber-950/30 px-4 py-3 text-sm text-amber-100">
          {actionError}
        </div>
      ) : null}

      {loading ? <div className="admin-surface p-4 text-sm text-zinc-300">Cargando productos...</div> : null}

      {!loading && !loadError ? (
        <div className="grid gap-3">
          {sortedProducts.length === 0 ? (
            <div className="admin-surface p-5 text-sm text-zinc-300">Todavía no hay productos registrados.</div>
          ) : sortedProducts.map((product) => (
            <article key={product.id} className="akai-card p-4 sm:p-5">
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg font-semibold text-white">{product.title}</h3>
                    <span className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ${statusClass(product.status)}`}>
                      {statusLabels[product.status]}
                    </span>
                    {product.featured ? <span className="akai-chip border-red-500/70 text-red-100">featured</span> : null}
                  </div>
                  <p className="mt-1 text-xs text-zinc-400">
                    tipo: {product.type} • slug: {product.slug} • orden: {product.sort_order}
                  </p>
                  <p className="mt-2 text-sm text-zinc-300">{product.short_description}</p>
                  {product.tags.length ? <p className="mt-2 text-xs text-zinc-400">Tags: {product.tags.join(', ')}</p> : null}
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  <button type="button" onClick={() => openEdit(product)} className="admin-btn-secondary px-3 py-2 text-xs">
                    Editar
                  </button>
                  <button
                    type="button"
                    disabled={deletingId !== null}
                    onClick={() => void handleDelete(product)}
                    className="admin-btn-danger px-3 py-2 text-xs"
                  >
                    {deletingId === product.id ? 'Eliminando...' : 'Eliminar'}
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

export default AdminProducts;
