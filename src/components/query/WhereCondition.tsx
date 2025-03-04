import { X } from "lucide-react";

interface WhereConditionProps {
  condition: string;
  onRemove: () => void;
}

export default function WhereCondition({
  condition,
  onRemove,
}: WhereConditionProps) {
  return (
    <div className="flex items-center justify-between bg-green-50 text-green-800 rounded-md px-2 py-1 text-sm border border-green-200">
      <div className="font-mono">{condition}</div>
      <button
        className="text-green-600 hover:text-green-800 focus:outline-none"
        onClick={onRemove}
        aria-label="Remove condition"
      >
        <X className="h-3 w-3" />
      </button>
    </div>
  );
}
