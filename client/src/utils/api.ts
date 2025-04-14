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
    const headers: HeadersInit = {
      ...options.headers,
      ...(options.body ? { "Content-Type": "application/json" } : {})
    };

    const response = await fetch(`${API_BASE_URL}${url}`, {
      ...options,
      headers,
      credentials: 'include' // Enable cookies for auth token
    });

    let responseData;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      responseData = await response.json();
    } else {
      responseData = await response.text();
    }

    if (!response.ok) {
      return {
        ok: false,
        error: {
          message: responseData.message || responseData || response.statusText,
          status: response.status
        }
      } as const;
    }

    return { ok: true, data: responseData } as const;
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
      return handleRequest<AuthResponse>('/login', {
        method: 'POST',
        body: JSON.stringify(credentials)
      });
    },

    async register(userData: InsertUser): Promise<ApiResponse<AuthResponse>> {
      return handleRequest<AuthResponse>('/register', {
        method: 'POST',
        body: JSON.stringify(userData)
      });
    },

    async getCurrentUser(): Promise<ApiResponse<SelectUser>> {
      return handleRequest<SelectUser>('/user');
    },

    async logout(): Promise<ApiResponse<void>> {
      return handleRequest('/logout', { method: 'POST' });
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
