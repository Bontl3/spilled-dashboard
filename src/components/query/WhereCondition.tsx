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
    <div className="flex items-center justify-between bg-blue-100 text-blue-800 rounded px-2 py-1 text-sm">
      <span>{condition}</span>
      <button className="text-blue-600 hover:text-blue-800" onClick={onRemove}>
        <X className="h-3 w-3" />
      </button>
    </div>
  );
}
