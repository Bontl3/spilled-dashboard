"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, X, Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface GroupBySelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function GroupBySelector({
  value,
  onChange,
}: GroupBySelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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

  const filteredFields = searchTerm
    ? fields.filter(
        (field) =>
          field.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          field.category.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : fields;

  const handleSelect = (field: string) => {
    onChange(field);
    setIsOpen(false);
    setSearchTerm("");
  };

  const clearSelection = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange("");
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        className={cn(
          "border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-white cursor-pointer flex items-center justify-between",
          isOpen && "ring-2 ring-green-500 border-green-500"
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        {value ? (
          <div className="flex items-center justify-between w-full">
            <span className="text-sm text-gray-900">{value}</span>
            <button
              onClick={clearSelection}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <span className="text-sm text-gray-500">
            Select field to group by...
          </span>
        )}
        <ChevronDown className="h-4 w-4 text-gray-500 ml-2" />
      </div>

      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg">
          <div className="p-2 border-b border-gray-200">
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                className="focus:ring-green-500 focus:border-green-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                placeholder="Search fields..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>
          <div className="max-h-60 overflow-y-auto py-1">
            {filteredFields.length > 0 ? (
              <>
                {Array.from(
                  new Set(filteredFields.map((field) => field.category))
                ).map((category) => (
                  <div key={category}>
                    <div className="px-3 py-1 text-xs font-semibold text-gray-500 bg-gray-50">
                      {category}
                    </div>
                    {filteredFields
                      .filter((field) => field.category === category)
                      .map((field, index) => (
                        <div
                          key={index}
                          className="px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer flex items-center justify-between"
                          onClick={() => handleSelect(field.name)}
                        >
                          <span className="font-mono text-gray-800">
                            {field.name}
                          </span>
                        </div>
                      ))}
                  </div>
                ))}
              </>
            ) : (
              <div className="px-3 py-2 text-sm text-gray-500">
                No matching fields
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
