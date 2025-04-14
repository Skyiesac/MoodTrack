import type { InsertUser, SelectUser, MoodEntry } from "../types/schema";

export interface ApiError {
  message: string;
  status?: number;
}

export interface AuthResponse {
  message: string;
  user: SelectUser;
  token: string;
}

export type ApiResponse<T> = {
  ok: true;
  data: T;
} | {
  ok: false;
  error: ApiError;
}

const API_BASE_URL = '/api';

async function handleRequest<T>(
  url: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const token = localStorage.getItem('auth_token');
    const headers: HeadersInit = {
      ...options.headers,
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...(token ? { "Authorization": `Bearer ${token}` } : {})
    };

    const response = await fetch(`${API_BASE_URL}${url}`, {
      ...options,
      headers,
      credentials: 'include' // Enable cookies for CSRF
    });

    if (!response.ok) {
      // Try to get error message from response
      let errorMessage: string;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || response.statusText;
      } catch {
        errorMessage = await response.text() || response.statusText;
      }

      return {
        ok: false,
        error: {
          message: errorMessage,
          status: response.status
        }
      } as const;
    }

    const data = await response.json();
    return { ok: true, data } as const;
  } catch (error) {
    return {
      ok: false,
      error: {
        message: error instanceof Error ? error.message : 'An unexpected error occurred',
        status: 500
      }
    } as const;
  }
}

export const api = {
  auth: {
    async login(credentials: Pick<InsertUser, 'username' | 'password'>): Promise<ApiResponse<AuthResponse>> {
      const response = await handleRequest<AuthResponse>('/login', {
        method: 'POST',
        body: JSON.stringify(credentials)
      });

      if (response.ok) {
        localStorage.setItem('auth_token', response.data.token);
      }

      return response;
    },

    async register(userData: InsertUser): Promise<ApiResponse<AuthResponse>> {
      const response = await handleRequest<AuthResponse>('/register', {
        method: 'POST',
        body: JSON.stringify(userData)
      });

      if (response.ok) {
        localStorage.setItem('auth_token', response.data.token);
      }

      return response;
    },

    async getCurrentUser(): Promise<ApiResponse<SelectUser>> {
      return handleRequest<SelectUser>('/user');
    },

    async logout(): Promise<void> {
      localStorage.removeItem('auth_token');
    }
  },

  entries: {
    async getAll(): Promise<ApiResponse<MoodEntry[]>> {
      return handleRequest<MoodEntry[]>('/entries');
    },

    async create(entry: Omit<MoodEntry, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<MoodEntry>> {
      return handleRequest<MoodEntry>('/entries', {
        method: 'POST',
        body: JSON.stringify(entry)
      });
    },

    async get(id: number): Promise<ApiResponse<MoodEntry>> {
      return handleRequest<MoodEntry>(`/entries/${id}`);
    },

    async update(id: number, entry: Partial<Omit<MoodEntry, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>): Promise<ApiResponse<MoodEntry>> {
      return handleRequest<MoodEntry>(`/entries/${id}`, {
        method: 'PUT',
        body: JSON.stringify(entry)
      });
    },

    async delete(id: number): Promise<ApiResponse<void>> {
      return handleRequest<void>(`/entries/${id}`, {
        method: 'DELETE'
      });
    }
  }
};
