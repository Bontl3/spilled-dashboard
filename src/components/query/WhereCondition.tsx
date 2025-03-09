import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { X } from "lucide-react";

interface WhereConditionProps {
  options: Array<{ label: string; value: string }>;
  onAdd: (condition: string) => void;
  onRemove: (condition: string) => void;
  selectedConditions: string[];
}

const WhereCondition: React.FC<WhereConditionProps> = ({
  options,
  onAdd,
  onRemove,
  selectedConditions,
}) => {
  const [selectedOption, setSelectedOption] = useState("");

  const handleAdd = () => {
    if (selectedOption && !selectedConditions.includes(selectedOption)) {
      onAdd(selectedOption);
      setSelectedOption("");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <select
          className="flex-1 p-2 border rounded"
          value={selectedOption}
          onChange={(e) => setSelectedOption(e.target.value)}
        >
          <option value="">Select a condition...</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <Button onClick={handleAdd} disabled={!selectedOption}>
          Add
        </Button>
      </div>

      {selectedConditions.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Applied Conditions:</h4>
          <div className="flex flex-wrap gap-2">
            {selectedConditions.map((condition) => {
              const option = options.find((o) => o.value === condition);
              return (
                <div
                  key={condition}
                  className="bg-blue-100 text-blue-700 text-sm px-3 py-1 rounded-full flex items-center gap-1"
                >
                  <span>{option?.label || condition}</span>
                  <button
                    onClick={() => onRemove(condition)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default WhereCondition;
