"use client";

import { useState } from "react";
import { ChevronDown, X, Info, HelpCircle } from "lucide-react";
import { QueryParams } from "@/types";
import VisualizeField from "./VisualizeField";
import WhereCondition from "./WhereCondition";
import GroupBySelector from "./GroupBySelector";

interface QueryBuilderProps {
  onRunQuery: (params: QueryParams) => void;
}

export default function QueryBuilder({ onRunQuery }: QueryBuilderProps) {
  const [dataSource, setDataSource] = useState<string>("network-flows");
  const [visualizeFields, setVisualizeFields] = useState<string[]>([
    "COUNT",
    "AVG(latency)",
  ]);
  const [whereConditions, setWhereConditions] = useState<string[]>([
    "bytes_transferred > 1000000",
    "destination_port = 443",
  ]);
  const [groupBy, setGroupBy] = useState<string>("");
  const [orderBy, setOrderBy] = useState<string>("COUNT DESC");
  const [limit, setLimit] = useState<number>(1000);

  const handleAddVisualizeField = (field: string) => {
    if (!visualizeFields.includes(field)) {
      setVisualizeFields([...visualizeFields, field]);
    }
  };

  const handleRemoveVisualizeField = (index: number) => {
    const newFields = [...visualizeFields];
    newFields.splice(index, 1);
    setVisualizeFields(newFields);
  };

  const handleAddWhereCondition = (condition: string) => {
    setWhereConditions([...whereConditions, condition]);
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
    });
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Visualize */}
        <div>
          <h3 className="text-sm font-semibold uppercase text-gray-500 mb-2">
            VISUALIZE
          </h3>
          <div className="border border-gray-300 rounded p-2 bg-white">
            <div className="flex flex-wrap gap-2 mb-2">
              {visualizeFields.map((field, index) => (
                <VisualizeField
                  key={index}
                  field={field}
                  onRemove={() => handleRemoveVisualizeField(index)}
                />
              ))}
            </div>
            <div className="mt-2 border-t border-gray-200 pt-2">
              <input
                className="w-full p-1 text-sm focus:outline-none"
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
            <h3 className="text-sm font-semibold uppercase text-gray-500">
              WHERE
            </h3>
            <div className="flex items-center space-x-2 bg-gray-100 rounded px-2 py-1">
              <span className="text-xs font-medium text-gray-700">AND</span>
              <ChevronDown className="h-3 w-3 text-gray-500" />
            </div>
          </div>
          <div className="border border-gray-300 rounded p-2 bg-white">
            <div className="flex flex-col gap-2 mb-2">
              {whereConditions.map((condition, index) => (
                <WhereCondition
                  key={index}
                  condition={condition}
                  onRemove={() => handleRemoveWhereCondition(index)}
                />
              ))}
            </div>
            <div className="mt-2 border-t border-gray-200 pt-2">
              <input
                className="w-full p-1 text-sm focus:outline-none"
                placeholder="Add a filter..."
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
          <h3 className="text-sm font-semibold uppercase text-gray-500 mb-2">
            GROUP BY
          </h3>
          <GroupBySelector value={groupBy} onChange={setGroupBy} />
        </div>

        {/* Order By */}
        <div>
          <h3 className="text-sm font-semibold uppercase text-gray-500 mb-2">
            ORDER BY
          </h3>
          <input
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
            value={orderBy}
            onChange={(e) => setOrderBy(e.target.value)}
            placeholder="e.g. COUNT DESC"
          />
        </div>

        {/* Limit */}
        <div>
          <h3 className="text-sm font-semibold uppercase text-gray-500 mb-2">
            LIMIT
          </h3>
          <input
            type="number"
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
            value={limit}
            onChange={(e) => setLimit(parseInt(e.target.value) || 0)}
          />
        </div>
      </div>

      {/* Query Controls */}
      <div className="border-t border-gray-200 bg-gray-50 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center text-sm text-gray-600">
          <span className="font-medium">Query Assistant</span>
          <Info className="h-4 w-4 ml-1 text-gray-400" />
        </div>
        <div className="flex items-center">
          <button className="flex items-center text-gray-600 mr-6">
            <HelpCircle className="h-4 w-4 mr-1" />
            <span className="text-sm">Query Help</span>
          </button>
          <button
            className="bg-green-800 text-white px-4 py-2 rounded text-sm font-medium hover:bg-green-700 focus:outline-none"
            onClick={handleRunQuery}
          >
            Run Query
          </button>
        </div>
      </div>
    </div>
  );
}
