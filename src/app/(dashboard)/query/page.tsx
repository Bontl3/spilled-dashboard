"use client";

import { useState } from "react";
import QueryBuilder from "@/components/query/QueryBuilder";
import TimeSeriesChart from "@/components/visualizations/TimeSeriesChart";
import ResultsTable from "@/components/visualizations/ResultsTable";
import useNetworkData from "@/hooks/useNetworkData";
import { QueryParams } from "@/types";

export default function QueryPage() {
  const [queryParams, setQueryParams] = useState<QueryParams | null>(null);
  const { data, loading, error, fetchData } = useNetworkData();

  const handleRunQuery = async (params: QueryParams) => {
    setQueryParams(params);
    await fetchData(params);
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Network Query</h1>
        <QueryBuilder onRunQuery={handleRunQuery} />
      </div>

      {/* Query Results */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-200">
          <h2 className="font-medium text-gray-700">Query Results</h2>
        </div>

        <div className="p-4">
          {loading ? (
            <div className="py-12 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-600"></div>
            </div>
          ) : error ? (
            <div className="py-12 text-center text-red-500">Error: {error}</div>
          ) : data ? (
            <div>
              <div className="text-sm text-gray-600 mb-4">
                {data.summary?.timeRange ? (
                  <>
                    {new Date(data.summary.timeRange.start).toLocaleString()} -{" "}
                    {new Date(data.summary.timeRange.end).toLocaleString()}
                  </>
                ) : (
                  "Query executed successfully"
                )}
              </div>

              {/* Chart Visualization */}
              {data.timeSeriesData?.length > 0 && (
                <div className="mb-6 border border-gray-200 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-gray-700 mb-4">
                    {queryParams?.visualizeFields?.[0] || "Results Over Time"}
                  </h3>
                  <TimeSeriesChart data={data.timeSeriesData} />
                </div>
              )}

              {/* Table Visualization */}
              {data.groupedData?.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-700 mb-4">
                    {queryParams?.groupBy
                      ? `Grouped by ${queryParams.groupBy}`
                      : "Results"}
                  </h3>
                  <ResultsTable
                    data={data.groupedData}
                    columns={Object.keys(data.groupedData[0]).map((key) => ({
                      header: key,
                      accessor: key,
                    }))}
                  />
                </div>
              )}

              {/* Summary */}
              {data.summary && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">
                    Summary
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {data.summary.totalCount !== undefined && (
                      <div>
                        <p className="text-xs text-gray-500">Total Count</p>
                        <p className="text-lg font-medium">
                          {data.summary.totalCount.toLocaleString()}
                        </p>
                      </div>
                    )}
                    {data.summary.avgLatency !== undefined && (
                      <div>
                        <p className="text-xs text-gray-500">Average Latency</p>
                        <p className="text-lg font-medium">
                          {data.summary.avgLatency} ms
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : queryParams ? (
            <div className="py-12 text-center text-gray-500">
              No results found for your query
            </div>
          ) : (
            <div className="py-12 text-center text-gray-500">
              Run a query to see results
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
