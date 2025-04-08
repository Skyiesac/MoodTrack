import { useQuery } from '@tanstack/react-query';
import { startOfDay } from 'date-fns';

type Quote = {
  content: string;
  author: string;
  source: string;
  tags?: string[];
};

async function fetchQuote(source: 'random' | 'zen'): Promise<Quote> {
  const response = await fetch(`/api/quotes/${source}`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
    }
  });

  if (!response.ok) {
    throw new Error('Failed to fetch quote');
  }

  return response.json();
}

export function useQuote(source: 'random' | 'zen' = 'random') {
  return useQuery<Quote, Error>({
    queryKey: ['quote', source, startOfDay(new Date()).toISOString()],
    queryFn: () => fetchQuote(source),
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
    cacheTime: 24 * 60 * 60 * 1000, // 24 hours
    refetchOnWindowFocus: false,
  });
}