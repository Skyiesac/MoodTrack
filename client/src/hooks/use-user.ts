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

export function useUser() {
  const queryClient = useQueryClient();

  const { data: user, error, isLoading } = useQuery<SelectUser | null, Error>({
    queryKey: ['user'],
    queryFn: async () => {
      try {
        const response = await fetch('/api/user', {
          credentials: 'include'
        });
        
        if (response.status === 401 || response.status === 403) {
          return null;
        }
        
        if (!response.ok) {
          throw new Error(`${response.status}: ${await response.text()}`);
        }
        
        return response.json();
      } catch (error) {
        if (error instanceof Error && error.message.includes('401')) {
          return null;
        }
        throw error;
      }
    },
    staleTime: Infinity,
    gcTime: Infinity,
    retry: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchInterval: false
  });

  const loginMutation = useMutation<RequestResult & { data?: { user: SelectUser } }, Error, LoginCredentials>({
    mutationFn: (userData) => handleRequest('/api/login', 'POST', userData),
    onSuccess: (result) => {
      if (result.ok && result.data) {
        queryClient.setQueryData(['user'], result.data.user);
      }
    },
  });

  const logoutMutation = useMutation<RequestResult, Error>({
    mutationFn: () => handleRequest('/api/logout', 'POST'),
    onSuccess: () => {
      queryClient.setQueryData(['user'], null);
    }
  });

  const registerMutation = useMutation<RequestResult & { data?: { user: SelectUser } }, Error, InsertUser>({
    mutationFn: (userData) => handleRequest('/api/register', 'POST', userData),
    onSuccess: (result) => {
      if (result.ok && result.data) {
        queryClient.setQueryData(['user'], result.data.user);
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
