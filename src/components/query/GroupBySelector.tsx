import React, { useState } from "react";

interface GroupByOption {
  label: string;
  value: string;
}

interface GroupBySelectorProps {
  options: GroupByOption[];
  onChange: (selected: string[]) => void;
}

const GroupBySelector: React.FC<GroupBySelectorProps> = ({
  options,
  onChange,
}) => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  const handleOptionChange = (option: string, isChecked: boolean) => {
    let newSelected: string[];

    if (isChecked) {
      newSelected = [...selectedOptions, option];
    } else {
      newSelected = selectedOptions.filter((item) => item !== option);
    }

    setSelectedOptions(newSelected);
    onChange(newSelected);
  };

  return (
    <div className="space-y-2 border rounded-md p-3">
      {options.map((option) => (
        <label
          key={option.value}
          className="flex items-center space-x-2 cursor-pointer"
        >
          <input
            type="checkbox"
            className="rounded border-gray-300"
            checked={selectedOptions.includes(option.value)}
            onChange={(e) => handleOptionChange(option.value, e.target.checked)}
          />
          <span className="text-sm">{option.label}</span>
        </label>
      ))}

      {selectedOptions.length === 0 && (
        <p className="text-sm text-gray-500 italic">No grouping selected</p>
      )}
    </div>
  );
};

export default GroupBySelector;
