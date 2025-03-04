// src/components/ui/Stat.tsx
import React from "react";
import { cn } from "@/lib/utils";

interface StatProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string | number;
  label: string;
  icon?: React.ReactNode;
  change?: number;
}

const Stat = ({
  value,
  label,
  icon,
  change,
  className,
  ...props
}: StatProps) => {
  const isPositive = change !== undefined && change > 0;

  return (
    <div
      className={cn(
        "rounded-lg border border-gray-200 bg-white p-6 shadow-sm",
        className
      )}
      {...props}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{label}</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>

          {change !== undefined && (
            <div className="mt-2">
              <span
                className={cn(
                  "inline-flex items-center rounded-full px-2 py-1 text-xs font-medium",
                  isPositive
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                )}
              >
                {isPositive ? "+" : ""}
                {change}%
              </span>
            </div>
          )}
        </div>

        {icon && (
          <div className="rounded-full bg-green-100 p-3 text-green-800">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
};

export { Stat };
