import { useState, useEffect } from 'react';
import Papa from 'papaparse';

interface TradeData {
  year: string;
  country: string;
  value_trln_USD: number;
  quantity_mln_metric_tons: number;
}

export function useData<T>(filename: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/data/${filename}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const csvText = await response.text();
        console.log('CSV content:', csvText.slice(0, 200));
        
        Papa.parse(csvText, {
          header: true,
          dynamicTyping: true,
          skipEmptyLines: true,
          complete: (results) => {
            if (results.errors.length > 0) {
              console.warn('CSV parsing errors:', results.errors);
            }
            console.log('Parsed data:', results.data);
            setData(results.data as T);
            setLoading(false);
          },
          error: (error) => {
            console.error('CSV parsing error:', error);
            setError(error.message);
            setLoading(false);
          }
        });
      } catch (err) {
        console.error('Data fetching error:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        setLoading(false);
      }
    };

    fetchData();
  }, [filename]);

  return { data, loading, error };
} 