// src/components/query/QueryBuilder.tsx
"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle, Play, Plus, X } from "lucide-react";
import { QueryParams } from "@/types";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import WhereCondition from "@/components/query/WhereCondition";
import GroupBySelector from "@/components/query/GroupBySelector";

interface QueryBuilderProps {
  onRunQuery: (params: QueryParams) => void;
}

export default function QueryBuilder({ onRunQuery }: QueryBuilderProps) {
  const [dataSource, setDataSource] = useState<string>("network-flows");
  const [visualizeFields, setVisualizeFields] = useState<string[]>([
    "COUNT",
    "AVG(latency)",
  ]);
  const [whereConditions, setWhereConditions] = useState<string[]>([]);
  const [groupBy, setGroupBy] = useState<string>("");
  const [orderBy, setOrderBy] = useState<string>("COUNT DESC");
  const [limit, setLimit] = useState<number>(1000);
  const [timeRange, setTimeRange] = useState<string>("Last 24 hours");

  const handleAddVisualizeField = (field: string) => {
    if (!visualizeFields.includes(field) && field.trim() !== "") {
      setVisualizeFields([...visualizeFields, field]);
    }
  };

  const handleRemoveVisualizeField = (index: number) => {
    const newFields = [...visualizeFields];
    newFields.splice(index, 1);
    setVisualizeFields(newFields);
  };

  const handleAddWhereCondition = (condition: string) => {
    if (condition.trim() !== "") {
      setWhereConditions([...whereConditions, condition]);
    }
  };

  const handleRemoveWhereCondition = (index: number) => {
    const newConditions = [...whereConditions];
    newConditions.splice(index, 1);
    setWhereConditions(newConditions);
  };

  const handleRunQuery = () => {
    onRunQuery({
      dataSource,
      visualizeFields,
      whereConditions,
      groupBy,
      orderBy,
      limit,
      timeRange,
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Data Source */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            DATA SOURCE
          </label>
          <div className="relative">
            <select
              value={dataSource}
              onChange={(e) => setDataSource(e.target.value)}
              className="block w-full border border-gray-300 rounded-md shadow-sm py-2 pl-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="network-flows">Network Flows</option>
              <option value="dhcp-logs">DHCP Logs</option>
              <option value="dns-queries">DNS Queries</option>
              <option value="security-events">Security Events</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
              <ChevronDown className="h-4 w-4" />
            </div>
          </div>
        </div>

        {/* Time Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            TIME RANGE
          </label>
          <div className="relative">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="block w-full border border-gray-300 rounded-md shadow-sm py-2 pl-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option>Last 15 minutes</option>
              <option>Last hour</option>
              <option>Last 6 hours</option>
              <option>Last 24 hours</option>
              <option>Last 7 days</option>
              <option>Custom range</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
              <ChevronDown className="h-4 w-4" />
            </div>
          </div>
        </div>

        {/* Visualize */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">
              VISUALIZE
            </label>
            {visualizeFields.length > 0 && (
              <button
                className="text-xs text-green-700 font-medium flex items-center"
                onClick={() => {
                  const input = document.getElementById(
                    "visualize-input"
                  ) as HTMLInputElement;
                  if (input) input.focus();
                }}
              >
                <Plus className="h-3 w-3 mr-1" />
                Add Field
              </button>
            )}
          </div>
          <div className="border border-gray-300 rounded-md p-3 bg-white">
            <div className="flex flex-wrap gap-2 mb-2">
              {visualizeFields.map((field, index) => (
                <div
                  key={index}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 rounded text-sm"
                >
                  <span>{field}</span>
                  <button
                    onClick={() => handleRemoveVisualizeField(index)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
            <div
              className={cn(
                "mt-2",
                visualizeFields.length > 0 && "border-t border-gray-200 pt-2"
              )}
            >
              <input
                id="visualize-input"
                className="w-full p-1 text-sm focus:outline-none placeholder:text-gray-400"
                placeholder="Add a field or metric..."
                onKeyDown={(e) => {
                  if (e.key === "Enter" && e.currentTarget.value) {
                    handleAddVisualizeField(e.currentTarget.value);
                    e.currentTarget.value = "";
                  }
                }}
              />
            </div>
          </div>
        </div>

        {/* Where */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">
              WHERE
            </label>
            <div className="flex items-center space-x-2 bg-gray-100 rounded px-2 py-1">
              <span className="text-xs font-medium text-gray-700">AND</span>
              <ChevronDown className="h-3 w-3 text-gray-500" />
            </div>
          </div>
          <div className="border border-gray-300 rounded-md p-3 bg-white">
            {whereConditions.length > 0 ? (
              <div className="flex flex-col gap-2 mb-2">
                {whereConditions.map((condition, index) => (
                  <WhereCondition
                    key={index}
                    condition={condition}
                    onRemove={() => handleRemoveWhereCondition(index)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500 text-xs py-2 border border-dashed border-gray-300 rounded mb-2">
                No conditions - return all results
              </div>
            )}
            <div
              className={cn(
                "mt-2",
                whereConditions.length > 0 && "border-t border-gray-200 pt-2"
              )}
            >
              <input
                className="w-full p-1 text-sm focus:outline-none placeholder:text-gray-400"
                placeholder="Add a filter (e.g. bytes > 1000)..."
                onKeyDown={(e) => {
                  if (e.key === "Enter" && e.currentTarget.value) {
                    handleAddWhereCondition(e.currentTarget.value);
                    e.currentTarget.value = "";
                  }
                }}
              />
            </div>
          </div>
        </div>

        {/* Group By */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            GROUP BY
          </label>
          <GroupBySelector value={groupBy} onChange={setGroupBy} />
        </div>

        {/* Order By */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ORDER BY
          </label>
          <input
            className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            value={orderBy}
            onChange={(e) => setOrderBy(e.target.value)}
            placeholder="e.g. COUNT DESC"
          />
        </div>

        {/* Limit */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            LIMIT
          </label>
          <input
            type="number"
            className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            value={limit}
            onChange={(e) => setLimit(parseInt(e.target.value) || 0)}
            min="1"
            max="10000"
          />
        </div>
      </div>

      {/* Query Controls */}
      <div className="border-t border-gray-200 bg-gray-50 px-6 py-3 flex items-center justify-between rounded-b-lg">
        <div className="flex items-center text-sm text-gray-600">
          <a href="#" className="flex items-center hover:text-green-700">
            <HelpCircle className="h-4 w-4 mr-1" />
            <span className="text-sm">Query Help</span>
          </a>
        </div>
        <div className="flex items-center">
          <Button className="font-medium" onClick={handleRunQuery}>
            <Play className="h-4 w-4 mr-2" />
            Run Query
          </Button>
        </div>
      </div>
    </div>
  );
}
