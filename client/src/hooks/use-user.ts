import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { InsertUser, SelectUser } from "@/types/schema";

type AuthResponse = {
  message: string;
  user: SelectUser;
  token: string;
};

type LoginCredentials = {
  username: string;
  password: string;
};

type RequestResult = {
  ok: true;
  data?: AuthResponse;
} | {
  ok: false;
  message: string;
};

async function handleRequest(
  url: string,
  method: string,
  body?: InsertUser | LoginCredentials
): Promise<RequestResult> {
  try {
    const headers: Record<string, string> = {
      ...(body ? { "Content-Type": "application/json" } : {})
    };

    const response = await fetch(url, {
      method,
      headers,
      credentials: 'include',
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      if (response.status >= 500) {
        return { ok: false, message: response.statusText };
      }

      const message = await response.text();
      return { ok: false, message };
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      if (method === 'POST' && (url === '/api/login' || url === '/api/register')) {
        return { ok: true, data };
      }
      return { ok: true, data };
    }
    return { ok: true };
  } catch (e: any) {
    return { ok: false, message: e.toString() };
  }
}

async function fetchUser(): Promise<SelectUser | null> {
  const response = await fetch('/api/user', {
    credentials: 'include'
  });

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      return null;
    }

    if (response.status >= 500) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }

    throw new Error(`${response.status}: ${await response.text()}`);
  }

  return response.json();
}

export function useUser() {
  const queryClient = useQueryClient();

  const { data: user, error, isLoading } = useQuery<SelectUser | null, Error>({
    queryKey: ['user'],
    queryFn: fetchUser,
    staleTime: Infinity,
    retry: false
  });

  const loginMutation = useMutation<RequestResult, Error, LoginCredentials>({
    mutationFn: (userData) => handleRequest('/api/login', 'POST', userData),
    onSuccess: (result) => {
      if (result.ok && result.data) {
        queryClient.setQueryData(['user'], result.data.user);
        // Trigger a refetch of the user data to ensure we have the latest state
        queryClient.invalidateQueries({ queryKey: ['user'] });
      }
    },
  });

  const logoutMutation = useMutation<RequestResult, Error>({
    mutationFn: () => handleRequest('/api/logout', 'POST'),
    onSuccess: () => {
      queryClient.setQueryData(['user'], null);
      queryClient.invalidateQueries({ queryKey: ['user'] });
    }
  });

  const registerMutation = useMutation<RequestResult, Error, InsertUser>({
    mutationFn: (userData) => handleRequest('/api/register', 'POST', userData),
    onSuccess: (result) => {
      if (result.ok && result.data) {
        queryClient.setQueryData(['user'], result.data.user);
        // Trigger a refetch of the user data to ensure we have the latest state
        queryClient.invalidateQueries({ queryKey: ['user'] });
      }
    },
  });

  return {
    user,
    isLoading,
    error,
    login: loginMutation.mutateAsync,
    logout: logoutMutation.mutateAsync,
    register: registerMutation.mutateAsync,
  };
}
