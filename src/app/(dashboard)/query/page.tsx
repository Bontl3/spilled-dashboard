// src/app/(dashboard)/query/page.tsx
"use client";

import { useState } from "react";
import {
  ArrowRight,
  Database,
  AlertCircle,
  Download,
  Save,
} from "lucide-react";
import QueryBuilder from "@/components/query/QueryBuilder";
import TimeSeriesChart from "@/components/visualizations/TimeSeriesChart";
import ResultsTable from "@/components/visualizations/ResultsTable";
import DashboardCard from "@/components/ui/DashboardCard";
import { Button } from "@/components/ui/Button";
import useNetworkData from "@/hooks/useNetworkData";
import { QueryParams } from "@/types";
import { formatBytes, formatDateTime } from "@/lib/utils";

export default function QueryPage() {
  const [queryParams, setQueryParams] = useState<QueryParams | null>(null);
  const { data, loading, error, fetchData } = useNetworkData();

  const handleRunQuery = async (params: QueryParams) => {
    setQueryParams(params);
    await fetchData(params);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Network Query</h1>
        <p className="mt-2 text-gray-600">
          Build complex queries to analyze network traffic patterns and identify
          issues
        </p>
      </div>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <QueryBuilder onRunQuery={handleRunQuery} />
      </div>

      {/* Query Results */}
      <DashboardCard title="Query Results" isLoading={loading} icon={Database}>
        {error ? (
          <div className="py-12 flex flex-col items-center justify-center">
            <AlertCircle className="h-12 w-12 text-red-500 mb-3" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              Query Error
            </h3>
            <p className="text-red-500">{error}</p>
          </div>
        ) : data ? (
          <div>
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              {data.summary?.timeRange ? (
                <div className="flex flex-col md:flex-row md:items-center justify-between">
                  <div className="mb-2 md:mb-0">
                    <h4 className="text-sm font-medium text-gray-700 mb-1">
                      Time Range
                    </h4>
                    <p className="text-sm text-gray-600">
                      {formatDateTime(data.summary.timeRange.start)} -{" "}
                      {formatDateTime(data.summary.timeRange.end)}
                    </p>
                  </div>

                  <div className="flex space-x-6">
                    {data.summary.totalCount !== undefined && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-1">
                          Total Records
                        </h4>
                        <p className="text-xl font-bold text-gray-900">
                          {data.summary.totalCount.toLocaleString()}
                        </p>
                      </div>
                    )}

                    {data.summary.avgLatency !== undefined && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-1">
                          Average Latency
                        </h4>
                        <p className="text-xl font-bold text-gray-900">
                          {data.summary.avgLatency} ms
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <p className="text-gray-600">Query executed successfully</p>
              )}
            </div>

            {/* Chart Visualization */}
            {data.timeSeriesData?.length > 0 && (
              <div className="mb-8 border border-gray-200 rounded-lg p-5 bg-white">
                <h3 className="text-lg font-medium text-gray-800 mb-4">
                  {queryParams?.visualizeFields?.[0] || "Results Over Time"}
                </h3>
                <TimeSeriesChart data={data.timeSeriesData} height={350} />
              </div>
            )}
            {/* Table Visualization */}
            {data.groupedData && data.groupedData.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-800 mb-4">
                  {queryParams?.groupBy
                    ? `Grouped by ${queryParams.groupBy}`
                    : "Results"}
                </h3>
                <ResultsTable
                  data={data.groupedData.map((row) => {
                    // Format any byte values
                    const formatted = { ...row };
                    if (formatted.bytes) {
                      formatted.bytes = formatBytes(formatted.bytes);
                    }
                    return formatted;
                  })}
                  columns={Object.keys(data.groupedData[0]).map((key) => ({
                    header: key
                      .replace(/_/g, " ")
                      .replace(/\b\w/g, (c) => c.toUpperCase()),
                    accessor: key,
                  }))}
                />
              </div>
            )}

            <div className="flex justify-end mt-6">
              <Button className="mr-3" variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export Results
              </Button>
              <Button>
                <Save className="h-4 w-4 mr-2" />
                Save Query
              </Button>
            </div>
          </div>
        ) : queryParams ? (
          <div className="py-12 text-center text-gray-500">
            No results found for your query
          </div>
        ) : (
          <div className="py-16 flex flex-col items-center justify-center text-center text-gray-500">
            <Database className="h-12 w-12 text-gray-300 mb-3" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              Run a Query to See Results
            </h3>
            <p className="max-w-md text-gray-500 mb-6">
              Use the query builder above to analyze your network data. Results
              will appear here.
            </p>
            <div className="flex items-center text-sm text-green-700">
              <ArrowRight className="h-4 w-4 mr-1 animate-pulse" />
              Try running a query with the default settings
            </div>
          </div>
        )}
      </DashboardCard>
    </div>
  );
}
