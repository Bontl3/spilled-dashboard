// src/components/visualizations/MetricsCard.tsx
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricsCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon?: LucideIcon;
  className?: string;
}

export default function MetricsCard({
  title,
  value,
  change,
  icon: Icon,
  className,
}: MetricsCardProps) {
  const isPositive = change !== undefined && change > 0;

  return (
    <div
      className={cn(
        "bg-white rounded-lg border border-gray-200 p-5 shadow-sm transition-all hover:shadow-md",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <div className="mt-2">
            <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
          </div>
        </div>
        {Icon && (
          <div className="rounded-full bg-green-100 p-2 text-green-700">
            <Icon className="h-5 w-5" />
          </div>
        )}
      </div>
      {change !== undefined && (
        <div className="mt-4 flex items-center">
          <span
            className={cn(
              "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
              isPositive
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            )}
          >
            {isPositive ? "+" : ""}
            {change}%
          </span>
          <span className="ml-2 text-xs text-gray-500">from yesterday</span>
        </div>
      )}
    </div>
  );
}
