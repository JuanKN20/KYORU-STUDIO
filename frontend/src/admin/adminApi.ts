import { API_BASE_URL, ProductItem, ProjectItem, ServiceItem } from '../services/api';

type ApiSuccess<T> = {
  ok: true;
  data: T;
  message?: string;
};

type ApiError = {
  ok: false;
  error: string;
};

type ApiResponse<T> = ApiSuccess<T> | ApiError;

export type ContactStatus = 'new' | 'in_progress' | 'resolved' | 'archived';
export type ContentStatus = 'draft' | 'published' | 'archived' | 'coming_soon';

export type AdminContactItem = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  status: ContactStatus;
  created_at: string;
  updated_at: string;
};

export type ProjectPayload = {
  title: string;
  slug?: string;
  category?: string | null;
  short_description: string;
  long_description?: string | null;
  status?: ContentStatus;
  cover_image_url?: string | null;
  demo_url?: string | null;
  repository_url?: string | null;
  technologies?: string[];
  featured?: boolean;
  sort_order?: number;
  published_at?: string | null;
};

export type ServicePayload = {
  title: string;
  slug?: string;
  description: string;
  deliverables?: string[];
  icon_name?: string | null;
  is_active?: boolean;
  sort_order?: number;
};

export type ProductPayload = {
  title: string;
  slug?: string;
  type: string;
  short_description: string;
  long_description?: string | null;
  price_label?: string | null;
  status?: ContentStatus;
  cover_image_url?: string | null;
  gallery_urls?: string[];
  tags?: string[];
  featured?: boolean;
  sort_order?: number;
  published_at?: string | null;
};

export type UploadFolder = 'projects' | 'products' | 'general';

const ADMIN_TOKEN_STORAGE_KEY = 'yorurei_admin_token';
export const ADMIN_AUTH_REJECTED_EVENT = 'kyoru:admin-auth-rejected';
export const ADMIN_IMAGE_ACCEPT = 'image/jpeg,image/png,image/webp';
export const ADMIN_UPLOAD_MAX_BYTES = 5 * 1024 * 1024;

const ADMIN_IMAGE_MIME_TYPES = new Set(ADMIN_IMAGE_ACCEPT.split(','));

function toApiErrorMessage(status: number, context: 'request' | 'upload' = 'request'): string {
  if (status === 400) {
    return context === 'upload'
      ? 'La imagen no es válida. Usa un archivo JPEG, PNG o WebP de hasta 5 MiB.'
      : 'La solicitud contiene datos inválidos. Revisa los campos e inténtalo de nuevo.';
  }
  if (status === 401) return 'El token de administración no es válido. Inicia sesión de nuevo.';
  if (status === 403) return 'No tienes permiso para realizar esta acción.';
  if (status === 404) return 'El registro solicitado ya no existe.';
  if (status === 409) return 'Ya existe un registro con esos datos únicos. Revisa el slug.';
  if (status === 413) {
    return context === 'upload'
      ? 'La imagen supera el límite máximo de 5 MiB.'
      : 'La solicitud es demasiado grande. Reduce el contenido e inténtalo de nuevo.';
  }
  if (status === 429) return 'Hay demasiadas solicitudes. Espera unos minutos antes de reintentar.';
  if (status >= 500) return 'El servidor no pudo completar la operación. Inténtalo de nuevo más tarde.';
  return 'No fue posible completar la solicitud.';
}

function compactPayload<T extends Record<string, unknown>>(payload: T): Partial<T> {
  const result: Partial<T> = {};

  for (const [key, value] of Object.entries(payload)) {
    if (value !== undefined) {
      result[key as keyof T] = value as T[keyof T];
    }
  }

  return result;
}

function normalizeText(value: string | undefined): string | undefined {
  if (value === undefined) return undefined;
  const trimmed = value.trim();
  return trimmed || undefined;
}

function getStoredAdminToken(): string | null {
  try {
    return localStorage.getItem(ADMIN_TOKEN_STORAGE_KEY);
  } catch {
    return null;
  }
}

export function hasAdminToken(): boolean {
  return Boolean(getStoredAdminToken());
}

export function saveAdminToken(token: string): void {
  try {
    localStorage.setItem(ADMIN_TOKEN_STORAGE_KEY, token);
  } catch {
    throw new Error('El navegador no permitió guardar la sesión administrativa.');
  }
}

function normalizeNullableText(value: string | null | undefined): string | null | undefined {
  if (value === undefined || value === null) return value;
  const trimmed = value.trim();
  return trimmed || null;
}

export function clearAdminToken(): void {
  try {
    localStorage.removeItem(ADMIN_TOKEN_STORAGE_KEY);
  } catch {
    // The UI still returns to login even if storage is unavailable.
  }
}

function invalidateRejectedToken(rejectedToken: string): void {
  if (getStoredAdminToken() !== rejectedToken) return;

  clearAdminToken();
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(ADMIN_AUTH_REJECTED_EVENT));
  }
}

function notifyMissingAdminSession(): void {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(ADMIN_AUTH_REJECTED_EVENT));
  }
}

async function authorizedAdminFetch(
  path: string,
  options: RequestInit = {},
  tokenOverride?: string,
  context: 'request' | 'upload' = 'request',
): Promise<unknown> {
  const token = tokenOverride || getStoredAdminToken();

  if (!token) {
    if (tokenOverride === undefined) {
      notifyMissingAdminSession();
    }
    throw new Error('No se encontró token admin. Inicia sesión para continuar.');
  }

  const headers = new Headers(options.headers);
  headers.set('x-admin-token', token);

  if (options.body !== undefined && !headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers,
    });
  } catch {
    throw new Error('No se pudo conectar con el servidor. Comprueba tu conexión e inténtalo de nuevo.');
  }

  let payload: unknown = null;
  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  if (!response.ok) {
    if (response.status === 401) {
      invalidateRejectedToken(token);
    }
    throw new Error(toApiErrorMessage(response.status, context));
  }

  if (!payload || typeof payload !== 'object' || !('ok' in payload)) {
    throw new Error('Respuesta inesperada del backend.');
  }

  return payload;
}

async function adminRequest<T>(
  path: string,
  options: RequestInit = {},
  tokenOverride?: string,
): Promise<T> {
  const payload = await authorizedAdminFetch(path, options, tokenOverride);

  const normalized = payload as ApiResponse<T>;
  if (normalized.ok !== true) {
    throw new Error('El backend rechazó la operación. Revisa los datos enviados.');
  }

  if (!('data' in normalized)) {
    throw new Error('Respuesta inesperada del backend.');
  }

  return normalized.data;
}

async function adminCommand(path: string, options: RequestInit): Promise<void> {
  const payload = (await authorizedAdminFetch(path, options)) as { ok?: unknown };
  if (payload.ok !== true) {
    throw new Error('El backend rechazó la operación. Revisa los datos enviados.');
  }
}

export async function validateAdminToken(token: string): Promise<void> {
  const cleanToken = token.trim();
  if (!cleanToken) {
    throw new Error('Debes ingresar el token admin.');
  }

  await adminRequest<ProjectItem[]>('/api/admin/projects', { method: 'GET' }, cleanToken);
}

export function getAdminProjects() {
  return adminRequest<ProjectItem[]>('/api/admin/projects');
}

export function createProject(payload: ProjectPayload) {
  return adminRequest<ProjectItem>('/api/admin/projects', {
    method: 'POST',
    body: JSON.stringify(
      compactPayload({
        ...payload,
        slug: normalizeText(payload.slug),
        category: normalizeNullableText(payload.category),
        long_description: normalizeNullableText(payload.long_description),
        cover_image_url: normalizeNullableText(payload.cover_image_url),
        demo_url: normalizeNullableText(payload.demo_url),
        repository_url: normalizeNullableText(payload.repository_url),
      }),
    ),
  });
}

export function updateProject(id: number, payload: Partial<ProjectPayload>) {
  return adminRequest<ProjectItem>(`/api/admin/projects/${id}`, {
    method: 'PUT',
    body: JSON.stringify(
      compactPayload({
        ...payload,
        slug: normalizeText(payload.slug),
        category: normalizeNullableText(payload.category),
        long_description: normalizeNullableText(payload.long_description),
        cover_image_url: normalizeNullableText(payload.cover_image_url),
        demo_url: normalizeNullableText(payload.demo_url),
        repository_url: normalizeNullableText(payload.repository_url),
      }),
    ),
  });
}

export function deleteProject(id: number) {
  return adminCommand(`/api/admin/projects/${id}`, {
    method: 'DELETE',
  });
}

export function getAdminServices() {
  return adminRequest<ServiceItem[]>('/api/admin/services');
}

export function createService(payload: ServicePayload) {
  return adminRequest<ServiceItem>('/api/admin/services', {
    method: 'POST',
    body: JSON.stringify(
      compactPayload({
        ...payload,
        slug: normalizeText(payload.slug),
        icon_name: normalizeNullableText(payload.icon_name),
      }),
    ),
  });
}

export function updateService(id: number, payload: Partial<ServicePayload>) {
  return adminRequest<ServiceItem>(`/api/admin/services/${id}`, {
    method: 'PUT',
    body: JSON.stringify(
      compactPayload({
        ...payload,
        slug: normalizeText(payload.slug),
        icon_name: normalizeNullableText(payload.icon_name),
      }),
    ),
  });
}

export function deleteService(id: number) {
  return adminCommand(`/api/admin/services/${id}`, {
    method: 'DELETE',
  });
}

export function getAdminProducts() {
  return adminRequest<ProductItem[]>('/api/admin/products');
}

export function createProduct(payload: ProductPayload) {
  return adminRequest<ProductItem>('/api/admin/products', {
    method: 'POST',
    body: JSON.stringify(
      compactPayload({
        ...payload,
        slug: normalizeText(payload.slug),
        long_description: normalizeNullableText(payload.long_description),
        price_label: normalizeNullableText(payload.price_label),
        cover_image_url: normalizeNullableText(payload.cover_image_url),
      }),
    ),
  });
}

export function updateProduct(id: number, payload: Partial<ProductPayload>) {
  return adminRequest<ProductItem>(`/api/admin/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(
      compactPayload({
        ...payload,
        slug: normalizeText(payload.slug),
        long_description: normalizeNullableText(payload.long_description),
        price_label: normalizeNullableText(payload.price_label),
        cover_image_url: normalizeNullableText(payload.cover_image_url),
      }),
    ),
  });
}

export function deleteProduct(id: number) {
  return adminCommand(`/api/admin/products/${id}`, {
    method: 'DELETE',
  });
}

export function getAdminContacts() {
  return adminRequest<AdminContactItem[]>('/api/admin/contacts');
}

export function updateContactStatus(id: number, status: ContactStatus) {
  return adminRequest<AdminContactItem>(`/api/admin/contacts/${id}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status }),
  });
}

type UploadResponse =
  | {
      ok: true;
      url: string;
      path: string;
    }
  | {
      ok: false;
      error: string;
    };

export function validateAdminImageFile(file: File): void {
  if (!ADMIN_IMAGE_MIME_TYPES.has(file.type)) {
    throw new Error('Formato no permitido. Selecciona una imagen JPEG, PNG o WebP.');
  }

  if (file.size > ADMIN_UPLOAD_MAX_BYTES) {
    throw new Error('La imagen supera el límite máximo de 5 MiB.');
  }
}

export async function uploadAdminImage(file: File, folder: UploadFolder = 'general'): Promise<{ url: string; path: string }> {
  validateAdminImageFile(file);

  const formData = new FormData();
  formData.append('file', file);
  formData.append('folder', folder);

  const payload = await authorizedAdminFetch(
    '/api/admin/uploads/image',
    {
      method: 'POST',
      body: formData,
    },
    undefined,
    'upload',
  );

  const uploadPayload = payload as UploadResponse;
  if (!uploadPayload.ok) {
    throw new Error('El backend rechazó la imagen. Revisa el formato y el tamaño.');
  }

  if (!uploadPayload.url || !uploadPayload.path) {
    throw new Error('Respuesta inesperada del backend.');
  }

  return {
    url: uploadPayload.url,
    path: uploadPayload.path,
  };
}
