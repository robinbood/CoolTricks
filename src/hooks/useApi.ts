import { useState, useEffect } from 'react';

interface ApiResponse<T> {
  data?: T;
  error?: string;
  loading: boolean;
}

export const useApi = <T>(url: string, options?: RequestInit): ApiResponse<T> => {
  const [data, setData] = useState<T | undefined>();
  const [error, setError] = useState<string | undefined>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(url, options);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return { data, error, loading };
};

export const usePostApi = <T>(url: string): [(data: any) => Promise<T | undefined>, { error?: string; loading: boolean }] => {
  const [error, setError] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);

  const postData = async (data: any): Promise<T | undefined> => {
    try {
      setLoading(true);
      setError(undefined);
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      return undefined;
    } finally {
      setLoading(false);
    }
  };

  return [postData, { error, loading }];
};