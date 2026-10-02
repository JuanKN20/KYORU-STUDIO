import React, { useEffect, useState } from 'react';
import { AdminContactItem, ContactStatus, getAdminContacts, updateContactStatus } from '../adminApi';

const statusOptions: ContactStatus[] = ['new', 'in_progress', 'resolved', 'archived'];
const statusLabels: Record<ContactStatus, string> = {
  new: 'Nuevo',
  in_progress: 'En seguimiento',
  resolved: 'Resuelto',
  archived: 'Archivado',
};

function statusClass(status: ContactStatus): string {
  if (status === 'resolved') return 'border-emerald-500/50 bg-emerald-950/35 text-emerald-200';
  if (status === 'in_progress') return 'border-sky-500/50 bg-sky-950/35 text-sky-200';
  if (status === 'archived') return 'border-zinc-500/45 bg-zinc-950/35 text-zinc-300';
  return 'border-amber-500/50 bg-amber-950/35 text-amber-200';
}

function formatContactDate(value: string): { dateTime: string; label: string } | null {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;

  return {
    dateTime: date.toISOString(),
    label: date.toLocaleString(),
  };
}

const AdminContacts: React.FC = () => {
  const [contacts, setContacts] = useState<AdminContactItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [actionError, setActionError] = useState('');
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [draftStatuses, setDraftStatuses] = useState<Record<number, ContactStatus>>({});

  const loadContacts = async () => {
    setLoading(true);
    setLoadError('');
    setActionError('');

    try {
      const data = await getAdminContacts();
      setContacts(data);
      setDraftStatuses(() => {
        const next: Record<number, ContactStatus> = {};
        for (const contact of data) {
          next[contact.id] = contact.status;
        }
        return next;
      });
    } catch (loadError) {
      setLoadError(loadError instanceof Error ? loadError.message : 'No se pudieron cargar los contactos.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadContacts();
  }, []);

  const saveStatus = async (contact: AdminContactItem) => {
    const nextStatus = draftStatuses[contact.id] || contact.status;
    if (nextStatus === contact.status) return;

    setUpdatingId(contact.id);
    setActionError('');

    try {
      const updatedContact = await updateContactStatus(contact.id, nextStatus);
      setContacts((current) => current.map((item) => (item.id === updatedContact.id ? updatedContact : item)));
      setDraftStatuses((current) => ({
        ...current,
        [updatedContact.id]: updatedContact.status,
      }));
    } catch (updateError) {
      setActionError(updateError instanceof Error ? updateError.message : 'No se pudo actualizar el estado del contacto.');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <section className="space-y-4">
      <header className="admin-surface flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <div>
          <p className="admin-kicker">Admin</p>
          <h1 className="text-2xl font-bold text-white">Contactos</h1>
          <p className="text-sm text-zinc-300">Gestiona solicitudes recibidas y su estado interno de seguimiento.</p>
        </div>
        <button
          type="button"
          disabled={loading || updatingId !== null}
          onClick={() => void loadContacts()}
          className="admin-btn-secondary"
        >
          Recargar
        </button>
      </header>

      {loadError ? (
        <div role="alert" className="rounded-xl border border-red-700/60 bg-red-950/35 px-4 py-3 text-sm text-red-100">
          <p>{loadError}</p>
          <button type="button" onClick={() => void loadContacts()} className="admin-btn-secondary mt-3 px-3 py-2 text-xs">
            Reintentar
          </button>
        </div>
      ) : null}

      {actionError ? (
        <div role="alert" className="rounded-xl border border-amber-700/60 bg-amber-950/30 px-4 py-3 text-sm text-amber-100">
          {actionError}
        </div>
      ) : null}

      {loading ? (
        <div role="status" aria-live="polite" className="admin-surface p-4 text-sm text-zinc-300">
          Cargando contactos...
        </div>
      ) : null}

      {!loading && !loadError ? (
        <div className="grid gap-3">
          {contacts.length === 0 ? (
            <div className="admin-surface p-5 text-sm text-zinc-300">Todavía no hay solicitudes de contacto.</div>
          ) : (
            contacts.map((contact) => {
              const createdAt = formatContactDate(contact.created_at);
              const draftStatus = draftStatuses[contact.id] || contact.status;

              return (
                <article key={contact.id} className="akai-card p-4 motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:p-5">
                  <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-start">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="break-words text-base font-semibold text-white">{contact.name}</h2>
                        <span className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ${statusClass(contact.status)}`}>
                          {statusLabels[contact.status]}
                        </span>
                      </div>
                      <div className="mt-1 space-y-1 text-xs text-zinc-400">
                        <p className="break-all">{contact.email}</p>
                        {contact.phone ? <p className="break-words">{contact.phone}</p> : null}
                        <p>
                          {createdAt ? <time dateTime={createdAt.dateTime}>{createdAt.label}</time> : 'Fecha no disponible'}
                        </p>
                      </div>
                      <p className="mt-2 break-words text-sm text-red-200">Asunto: {contact.subject || 'Sin asunto'}</p>
                      <p className="mt-2 whitespace-pre-wrap break-words text-sm text-zinc-200">{contact.message}</p>
                    </div>

                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                      <label htmlFor={`contact-status-${contact.id}`} className="sr-only">
                        Estado del contacto {contact.name}
                      </label>
                      <select
                        id={`contact-status-${contact.id}`}
                        disabled={updatingId !== null}
                        value={draftStatus}
                        onChange={(event) =>
                          setDraftStatuses((previous) => ({
                            ...previous,
                            [contact.id]: event.target.value as ContactStatus,
                          }))
                        }
                        className="admin-select min-w-36 px-3 py-2 text-xs"
                      >
                        {statusOptions.map((status) => (
                          <option key={status} value={status}>
                            {statusLabels[status]}
                          </option>
                        ))}
                      </select>
                      <button
                        type="button"
                        disabled={updatingId !== null || draftStatus === contact.status}
                        onClick={() => void saveStatus(contact)}
                        className="admin-btn-secondary px-3 py-2 text-xs"
                        aria-label={`Guardar estado de ${contact.name}`}
                      >
                        {updatingId === contact.id ? 'Guardando...' : 'Guardar'}
                      </button>
                    </div>
                  </div>
                </article>
              );
            })
          )}
        </div>
      ) : null}
    </section>
  );
};

export default AdminContacts;
