"use client";

import { useState } from "react";
import { NetworkData, QueryParams } from "@/types";
import { generateMockData } from "@/lib/mockData";

export default function useNetworkData() {
  const [data, setData] = useState<NetworkData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async (
    queryParams: QueryParams
  ): Promise<NetworkData | null> => {
    setLoading(true);
    setError(null);

    try {
      // In a real implementation, this would be an API call
      // const response = await fetch('/api/query', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(queryParams)
      // });
      // const result = await response.json();

      // For demo purposes, we'll generate mock data directly
      const result = generateMockData(queryParams);

      setData(result);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, fetchData };
}
