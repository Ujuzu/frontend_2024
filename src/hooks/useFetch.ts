// src/hooks/useFetch.ts
import { useState, useEffect, useCallback, useRef } from 'react';

interface UseFetchResult<T> {
  data: T | null;
  error: Error | null;
  isLoading: boolean;
  refetch: () => Promise<void>;
}

interface FetchOptions {
  headers?: HeadersInit;
  enabled?: boolean;
  onSuccess?: (data: unknown) => void;
  onError?: (error: Error) => void;
}

export function useFetch<T>(url: string, options: FetchOptions = {}): UseFetchResult<T> {
  const { enabled = true, onSuccess, onError } = options;
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // Store the URL and headers in refs to compare in dependencies
  const urlRef = useRef(url);
  const headersRef = useRef(options.headers);
  
  // Store callbacks in refs to prevent unnecessary re-renders
  const onSuccessRef = useRef(onSuccess);
  const onErrorRef = useRef(onError);
  
  // Update refs when callbacks change
  useEffect(() => {
    onSuccessRef.current = onSuccess;
    onErrorRef.current = onError;
  }, [onSuccess, onError]);
  
  // Update URL and headers refs when they change
  useEffect(() => {
    urlRef.current = url;
    headersRef.current = options.headers;
  }, [url, options.headers]);

  const fetchData = useCallback(async () => {
    // Skip if URL is empty
    if (!url) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      const responseData = result.data ?? result; // Handle both {data: T} and T response formats
      
      setData(responseData);
      onSuccessRef.current?.(responseData);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('An error occurred');
      setError(error);
      onErrorRef.current?.(error);
    } finally {
      setIsLoading(false);
    }
  }, [url, options.headers]); // Include headers in dependencies

  // Only fetch when URL changes or enabled changes
  useEffect(() => {
    if (enabled && url) {
      fetchData();
    }
  }, [enabled, url, fetchData]);

  return { data, error, isLoading, refetch: fetchData };
}