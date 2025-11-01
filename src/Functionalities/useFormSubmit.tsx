import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

interface UseFormSubmitProps {
  url: string;
  redirectUrl?: string;
}

export const useFormSubmit = <T,>({ url, redirectUrl }: UseFormSubmitProps) => {
  const [response, setResponse] = useState<string>('');
  const navigate = useNavigate();

  const handleSubmit = useCallback(async (data: T) => {
    try {
      const res = await fetch(`http://localhost:3000${url}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (res.ok) {
        setResponse(result.message);
        if (redirectUrl) {
          setTimeout(() => {
            navigate(redirectUrl);
          }, 2000);
        }
      } else {
        setResponse(result.message);
      }
    } catch (error) {
      console.error('Network Error:', error);
      setResponse('An unexpected error occurred.');
    }

    setTimeout(() => {
      setResponse('');
    }, 2000);
  }, [url, redirectUrl, navigate]);

  return { response, handleSubmit };
};