"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface GroupBySelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function GroupBySelector({
  value,
  onChange,
}: GroupBySelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const fields = [
    { name: "source_ip", category: "Topology" },
    { name: "destination_ip", category: "Topology" },
    { name: "protocol", category: "Protocol" },
    { name: "device_name", category: "Infrastructure" },
    { name: "kubernetes.namespace", category: "Kubernetes" },
    { name: "kubernetes.pod_name", category: "Kubernetes" },
    { name: "http.status_code", category: "HTTP" },
    { name: "url.path", category: "HTTP" },
  ];

  const handleSelect = (field: string) => {
    onChange(field);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <div
        className="border border-gray-300 rounded px-3 py-2 bg-white cursor-pointer flex items-center justify-between"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-sm text-gray-700">
          {value || "Select field to group by..."}
        </span>
        <ChevronDown className="h-4 w-4 text-gray-500" />
      </div>

      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg">
          <div className="p-2 border-b border-gray-200">
            <p className="text-xs font-medium text-gray-600">
              Frequently Grouped Fields
            </p>
          </div>
          <div className="max-h-60 overflow-y-auto py-1">
            {fields.map((field, index) => (
              <div
                key={index}
                className="px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer flex items-center justify-between"
                onClick={() => handleSelect(field.name)}
              >
                <span>{field.name}</span>
                <span className="text-xs text-gray-500">{field.category}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
