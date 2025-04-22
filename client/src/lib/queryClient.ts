import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchInterval: false,
      refetchOnWindowFocus: false,
      refetchOnMount: true,
      refetchOnReconnect: false,
      staleTime: 0,
      retry: 1,
      gcTime: 24 * 60 * 60 * 1000, // 24 hours
      networkMode: 'online'
    },
    mutations: {
      retry: false,
      networkMode: 'online'
    }
  },
});
