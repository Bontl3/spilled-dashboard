// src/app/(dashboard)/query/page.tsx
"use client";

import { useState } from "react";
import {
  ArrowRight,
  Database,
  AlertCircle,
  Download,
  Save,
  Share,
  Copy,
  Trash,
  Clock,
  Filter,
  BarChart,
  CheckCircle,
  RefreshCw,
  Info,
} from "lucide-react";
import QueryBuilder from "@/components/query/QueryBuilder";
import TimeSeriesChart from "@/components/visualizations/TimeSeriesChart";
import ResultsTable from "@/components/visualizations/ResultsTable";
import DashboardCard from "@/components/ui/DashboardCard";
import { Button } from "@/components/ui/Button";
import useNetworkData from "@/hooks/useNetworkData";
import { QueryParams, TimeSeriesPoint } from "@/types";
import { formatBytes, formatDateTime } from "@/lib/utils";
import { useToast } from "@/components/ui/Toast";
import { useContextMenu, ContextMenuItem } from "@/components/ui/ContextMenu";

export default function QueryPage() {
  const [queryParams, setQueryParams] = useState<QueryParams | null>(null);
  const { data, loading, error, fetchData } = useNetworkData();
  const [loadingExport, setLoadingExport] = useState(false);
  const [savedQueries, setSavedQueries] = useState<
    Array<{ id: string; name: string; params: QueryParams }>
  >([]);
  const { addToast } = useToast();
  const { showContextMenu, hideContextMenu, contextMenuElement } =
    useContextMenu();

  // Track query execution stats
  const [queryStats, setQueryStats] = useState({
    lastExecuted: "",
    executionTime: 0,
    resultCount: 0,
  });

  const handleRunQuery = async (params: QueryParams) => {
    setQueryParams(params);
    const startTime = performance.now();

    try {
      await fetchData(params);
      const endTime = performance.now();
      setQueryStats({
        lastExecuted: new Date().toISOString(),
        executionTime: Math.round(endTime - startTime),
        resultCount: 0, // Updated later when data arrives
      });
      addToast({
        type: "success",
        title: "Query executed successfully",
        duration: 3000,
      });
    } catch (err) {
      addToast({
        type: "error",
        title: "Query failed",
        message:
          err instanceof Error ? err.message : "An unexpected error occurred",
        duration: 5000,
      });
    }
  };

  const handleSaveQuery = () => {
    if (!queryParams) return;

    const queryName = prompt("Enter a name for this query:");
    if (!queryName) return;

    const newQuery = {
      id: `query-${Date.now()}`,
      name: queryName,
      params: queryParams,
    };

    setSavedQueries([...savedQueries, newQuery]);

    addToast({
      type: "success",
      title: "Query saved",
      message: `"${queryName}" has been saved to your queries`,
      duration: 3000,
    });
  };

  const handleLoadSavedQuery = (id: string) => {
    const query = savedQueries.find((q) => q.id === id);
    if (query) {
      setQueryParams(query.params);
      handleRunQuery(query.params);
    }
  };

  const handleExportResults = async () => {
    if (!data) return;

    setLoadingExport(true);

    try {
      let exportData: string;

      if (data.groupedData && data.groupedData.length > 0) {
        const headers = Object.keys(data.groupedData[0]).join(",");
        const rows = data.groupedData.map((row: Record<string, any>) =>
          Object.values(row)
            .map((value) =>
              typeof value === "string" && value.includes(",")
                ? `"${value}"`
                : value
            )
            .join(",")
        );
        exportData = [headers, ...rows].join("\n");
      } else if (data.timeSeriesData && data.timeSeriesData.length > 0) {
        exportData =
          "time,value\n" +
          data.timeSeriesData
            .map((point: TimeSeriesPoint) => `${point.time},${point.value}`)
            .join("\n");
      } else {
        throw new Error("No data available to export");
      }

      const blob = new Blob([exportData], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `query-results-${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      addToast({
        type: "success",
        title: "Export successful",
        message: "Query results have been exported to CSV",
        duration: 3000,
      });
    } catch (err) {
      addToast({
        type: "error",
        title: "Export failed",
        message:
          err instanceof Error ? err.message : "Failed to export query results",
        duration: 5000,
      });
    } finally {
      setLoadingExport(false);
    }
  };

  // Handle right-click on table rows
  const handleRowContextMenu = (e: React.MouseEvent, row: any) => {
    e.preventDefault();
    showContextMenu(e, [
      {
        label: "Copy Row Data",
        icon: <Copy className="h-4 w-4" />,
        onClick: () => {
          navigator.clipboard.writeText(JSON.stringify(row));
          addToast({
            type: "info",
            title: "Copied to clipboard",
            duration: 2000,
          });
        },
      },
      {
        label: "Filter by This Value",
        icon: <Filter className="h-4 w-4" />,
        onClick: () => {
          addToast({
            type: "info",
            title: "Filter applied",
            message: "Filtering functionality would be applied here",
            duration: 2000,
          });
        },
      },
      {
        label: "Divider",
        onClick: () => {},
        divider: true,
      },
      {
        label: "View Details",
        icon: <Database className="h-4 w-4" />,
        onClick: () => {
          addToast({
            type: "info",
            title: "View details",
            message: "Details view would be shown here",
            duration: 2000,
          });
        },
      },
    ]);
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Network Query</h1>
        <p className="mt-2 text-gray-600">
          Build complex queries to analyze network traffic patterns and identify
          issues
        </p>
      </div>

      {/* Saved Queries Section */}
      {savedQueries.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-medium mb-3">Saved Queries</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {savedQueries.map((query) => (
              <button
                key={query.id}
                className="bg-white p-4 rounded-lg border border-gray-200 text-left hover:border-green-500 hover:shadow-sm transition-all"
                onClick={() => handleLoadSavedQuery(query.id)}
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-gray-900">{query.name}</h3>
                  <Database className="h-4 w-4 text-gray-400" />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {formatDateTime(new Date())}
                </p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Query Builder */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-medium">Build Your Query</h2>
          {queryStats.lastExecuted && (
            <div className="text-xs text-gray-500 flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              Last execution: {formatDateTime(queryStats.lastExecuted)}
              <span className="mx-2">•</span>
              <span className="font-medium">{queryStats.executionTime}ms</span>
            </div>
          )}
        </div>
        <QueryBuilder
          onRunQuery={handleRunQuery}
          savedQuery={queryParams || undefined}
        />
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
                  <div className="flex flex-wrap gap-6">
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
                    <div className="self-end">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center"
                        onClick={() => {
                          if (queryParams) handleRunQuery(queryParams);
                        }}
                      >
                        <RefreshCw className="h-3 w-3 mr-1" />
                        Refresh
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-gray-600">Query executed successfully</p>
              )}
            </div>

            {/* Chart Visualization */}
            {data.timeSeriesData?.length > 0 && (
              <div className="mb-8 border border-gray-200 rounded-lg p-5 bg-white">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-800">
                    {queryParams?.visualizeFields?.[0] || "Results Over Time"}
                  </h3>
                  <div className="flex space-x-2">
                    <button
                      className="p-1 text-gray-400 hover:text-gray-600 rounded"
                      title="Change visualization"
                    >
                      <BarChart className="h-5 w-5" />
                    </button>
                    <button
                      className="p-1 text-gray-400 hover:text-gray-600 rounded"
                      title="Export chart"
                      onClick={handleExportResults}
                    >
                      <Download className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                <TimeSeriesChart data={data.timeSeriesData} height={350} />
              </div>
            )}

            {/* Table Visualization */}
            {data.groupedData && data.groupedData.length > 0 && (
              <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-800">
                    {queryParams?.groupBy
                      ? `Grouped by ${queryParams.groupBy}`
                      : "Results"}
                  </h3>
                  <div className="text-sm text-gray-500">
                    {data.groupedData.length} rows
                  </div>
                </div>
                <div
                  className="relative"
                  onContextMenu={(e) => e.preventDefault()}
                >
                  <ResultsTable
                    data={data.groupedData.map((row: Record<string, any>) => {
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
                    onRowContextMenu={handleRowContextMenu}
                  />
                </div>
              </div>
            )}

            <div className="flex justify-end mt-6 space-x-3">
              <Button
                className="flex items-center"
                variant="outline"
                onClick={handleExportResults}
                disabled={loadingExport}
              >
                {loadingExport ? (
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Download className="h-4 w-4 mr-2" />
                )}
                Export Results
              </Button>
              <Button
                className="flex items-center"
                variant="outline"
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  addToast({
                    type: "info",
                    title: "Query shared",
                    message: "Query URL copied to clipboard",
                    duration: 3000,
                  });
                }}
              >
                <Share className="h-4 w-4 mr-2" />
                Share Query
              </Button>
              <Button
                className="flex items-center"
                onClick={handleSaveQuery}
                disabled={!queryParams}
              >
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

      {/* Context menu portal */}
      {contextMenuElement}
    </div>
  );
}
