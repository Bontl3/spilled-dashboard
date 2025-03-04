// src/components/ui/DashboardCard.tsx
import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface DashboardCardProps {
  title: string;
  children: ReactNode;
  icon?: LucideIcon;
  className?: string;
  action?: ReactNode;
  isLoading?: boolean;
}

export default function DashboardCard({
  title,
  children,
  icon: Icon,
  className,
  action,
  isLoading = false,
}: DashboardCardProps) {
  return (
    <div
      className={cn(
        "bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden",
        className
      )}
    >
      <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          {Icon && <Icon className="h-5 w-5 text-gray-500" />}
          <h3 className="font-medium text-gray-700">{title}</h3>
        </div>
        {action && <div>{action}</div>}
      </div>

      <div className="p-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 rounded-full border-t-2 border-b-2 border-green-600 animate-spin"></div>
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  );
}
