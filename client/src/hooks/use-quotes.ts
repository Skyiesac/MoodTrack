import { useQuery } from '@tanstack/react-query';
import { startOfDay } from 'date-fns';

type Quote = {
  content: string;
  author: string;
};

async function fetchQuote(source: 'random' | 'zen'): Promise<Quote> {
  try {
    const response = await fetch(`/api/quotes/${source}`, {
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Quote fetch error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      });
      throw new Error(`Failed to fetch quote: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Quote data received:', data);
    
    if (!data || !data.content || !data.author) {
      console.error('Invalid quote data:', data);
      throw new Error('Invalid quote data received');
    }

    return data;
  } catch (error) {
    console.error('Quote fetch error:', error);
    throw error;
  }
}

export function useQuote(source: 'random' | 'zen' = 'random') {
  const query = useQuery<Quote, Error>({
    queryKey: ['quote', source, startOfDay(new Date()).toISOString()],
    queryFn: () => fetchQuote(source),
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
    gcTime: 24 * 60 * 60 * 1000, // 24 hours
    refetchOnWindowFocus: false,
    retry: 2,
    retryDelay: 1000
  });

  console.log('useQuote hook state:', {
    data: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error?.message
  });

  return query;
}
