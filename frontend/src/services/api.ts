const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://yorurei-studio-backend1.onrender.com";
const DEFAULT_TIMEOUT_MS = 8000;
const CONTACT_TIMEOUT_MS = 90000;

export type ApiRequestErrorKind = 'timeout' | 'network' | 'http' | 'response';

export class ApiRequestError extends Error {
  readonly kind: ApiRequestErrorKind;
  readonly status?: number;

  constructor(kind: ApiRequestErrorKind, message: string, status?: number) {
    super(message);
    this.name = 'ApiRequestError';
    this.kind = kind;
    this.status = status;
  }
}

export function isApiRequestError(error: unknown): error is ApiRequestError {
  return error instanceof ApiRequestError;
}

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

type RequestOptions = RequestInit & {
  timeoutMs?: number;
};

export type ProjectStatus = 'draft' | 'published' | 'archived' | 'coming_soon';

export type ProjectItem = {
  id: number;
  title: string;
  slug: string;
  category: string | null;
  short_description: string;
  long_description: string | null;
  status: ProjectStatus;
  cover_image_url: string | null;
  demo_url: string | null;
  repository_url: string | null;
  technologies: string[];
  featured: boolean;
  sort_order: number;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

export type ServiceItem = {
  id: number;
  title: string;
  slug: string;
  description: string;
  deliverables: string[];
  icon_name: string | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type ProductItem = {
  id: number;
  title: string;
  slug: string;
  type: string;
  short_description: string;
  long_description: string | null;
  price_label: string | null;
  status: ProjectStatus;
  cover_image_url: string | null;
  gallery_urls: string[];
  tags: string[];
  featured: boolean;
  sort_order: number;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

export type ContactPayload = {
  name: string;
  email: string;
  message: string;
  phone?: string;
  subject?: string;
};

export type PublicProjectsQuery = {
  status?: ProjectStatus;
  featured?: boolean;
};

export type PublicProductsQuery = {
  status?: ProjectStatus;
  featured?: boolean;
  type?: string;
};

function buildQuery(query: Record<string, string | number | boolean | undefined>): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined) {
      params.set(key, String(value));
    }
  }
  const queryString = params.toString();
  return queryString ? `?${queryString}` : '';
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { timeoutMs = DEFAULT_TIMEOUT_MS, ...requestOptions } = options;
  const controller = new AbortController();
  const timeoutHandle = setTimeout(() => controller.abort(), timeoutMs);
  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(requestOptions.headers || {}),
      },
      ...requestOptions,
      signal: controller.signal,
    });
  } catch (error) {
    if (controller.signal.aborted || (error instanceof DOMException && error.name === 'AbortError')) {
      throw new ApiRequestError('timeout', 'El servidor tardó demasiado en responder.');
    }
    throw new ApiRequestError('network', 'No se pudo conectar con el backend.');
  } finally {
    clearTimeout(timeoutHandle);
  }

  let payload: ApiResponse<T> | null = null;
  const responseText = await response.text();

  if (responseText) {
    try {
      payload = JSON.parse(responseText) as ApiResponse<T>;
    } catch {
      payload = null;
    }
  }

  if (!response.ok) {
    const message = payload && !payload.ok ? payload.error : `Request failed with status ${response.status}`;
    throw new ApiRequestError('http', message, response.status);
  }

  if (!payload || typeof payload !== 'object' || !('ok' in payload)) {
    throw new ApiRequestError('response', 'Respuesta inesperada del backend.');
  }

  if (!payload.ok) {
    throw new ApiRequestError('response', payload.error || 'Error no controlado del backend.');
  }

  return payload.data;
}

export function getPublicServices() {
  return request<ServiceItem[]>('/api/services');
}

export function getPublicProjects(query: PublicProjectsQuery = {}) {
  return request<ProjectItem[]>(`/api/projects${buildQuery(query)}`);
}

export function getPublicProducts(query: PublicProductsQuery = {}) {
  return request<ProductItem[]>(`/api/products${buildQuery(query)}`);
}

export function createContactMessage(payload: ContactPayload) {
  return request('/api/contacts', {
    method: 'POST',
    body: JSON.stringify(payload),
    timeoutMs: CONTACT_TIMEOUT_MS,
  });
}

// Backward-compatible aliases while existing imports migrate.
export const getProjects = getPublicProjects;
export const getServices = getPublicServices;
export const getProducts = getPublicProducts;

export { API_BASE_URL };
