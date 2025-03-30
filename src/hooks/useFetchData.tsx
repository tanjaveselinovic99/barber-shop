import { useState, useEffect } from "react";
import axios from "axios";

function useFetchData<T>(
  url: string,
  transformData: (data: any) => T = (data) => data
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(url);

        const transformedData = transformData(response.data);
        setData(transformedData);
      } catch (error: unknown) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("An unknown error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url, transformData]);

  return { data, loading, error };
}

export default useFetchData;
