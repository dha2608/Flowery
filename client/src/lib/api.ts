import { useAuthStore } from './store';

const API_BASE = '/api/v1';

interface ApiOptions {
  method?: string;
  body?: unknown;
  headers?: Record<string, string>;
  token?: string;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

class ApiError extends Error {
  code: string;
  statusCode: number;
  details?: unknown;

  constructor(message: string, code: string, statusCode: number, details?: unknown) {
    super(message);
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
  }
}

/** Read the current access token from the Zustand store (works outside React components). */
function getToken(): string | undefined {
  return useAuthStore.getState().accessToken ?? undefined;
}

/**
 * Core fetch wrapper.
 *
 * @param isRetry - true when this call is the single automatic retry after a
 *   successful token refresh, preventing infinite loops.
 */
async function request<T>(
  endpoint: string,
  options: ApiOptions = {},
  isRetry = false,
): Promise<ApiResponse<T>> {
  const { method = 'GET', body, headers = {}, token } = options;

  // Auto-attach token from store when caller hasn't provided one explicitly.
  const authToken = token ?? getToken();

  const config: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
    },
    credentials: 'include',
  };

  if (body && method !== 'GET') {
    config.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_BASE}${endpoint}`, config);

  // ── 401 handling: try a token refresh then replay the original request ──
  if (response.status === 401 && !isRetry) {
    const storedRefresh = useAuthStore.getState().refreshToken;

    if (storedRefresh) {
      try {
        const refreshRes = await fetch(`${API_BASE}/auth/refresh`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken: storedRefresh }),
          credentials: 'include',
        });

        if (refreshRes.ok) {
          const refreshData = await refreshRes.json();
          const newAccessToken = refreshData.data?.tokens?.accessToken as string | undefined;
          const newRefreshToken = refreshData.data?.tokens?.refreshToken as string | undefined;

          if (newAccessToken) {
            const { user } = useAuthStore.getState();
            if (user) {
              useAuthStore.getState().setAuth(user, newAccessToken, newRefreshToken);
            }
            // Replay original request once with the fresh token.
            return request<T>(endpoint, { ...options, token: newAccessToken }, true);
          }
        }
      } catch {
        // Refresh request itself failed – fall through to logout.
      }
    }

    // Could not refresh – clear the session and let the caller handle it.
    useAuthStore.getState().logout();
    throw new ApiError(
      'Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.',
      'UNAUTHORIZED',
      401,
    );
  }

  const data = await response.json();

  if (!response.ok) {
    throw new ApiError(
      data.error?.message || 'Request failed',
      data.error?.code || 'UNKNOWN',
      response.status,
      data.error?.details,
    );
  }

  return data;
}

export const api = {
  get: <T>(endpoint: string, token?: string) => request<T>(endpoint, { token }),
  post: <T>(endpoint: string, body: unknown, token?: string) =>
    request<T>(endpoint, { method: 'POST', body, token }),
  put: <T>(endpoint: string, body: unknown, token?: string) =>
    request<T>(endpoint, { method: 'PUT', body, token }),
  delete: <T>(endpoint: string, token?: string) =>
    request<T>(endpoint, { method: 'DELETE', token }),
};

export { ApiError };
export type { ApiResponse };
