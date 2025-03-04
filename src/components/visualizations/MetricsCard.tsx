import { MetricCardProps } from "@/types";

export default function MetricsCard({
  title,
  value,
  change,
  icon: Icon,
}: MetricCardProps) {
  const isPositive = change !== undefined && change > 0;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <div className="mt-1">
            <h3 className="text-xl font-semibold text-gray-800">{value}</h3>
          </div>
        </div>
        {Icon && <Icon className="h-5 w-5 text-green-600" />}
      </div>
      {change !== undefined && (
        <div
          className={`mt-4 text-xs ${
            isPositive ? "text-green-600" : "text-red-600"
          }`}
        >
          {isPositive ? "+" : ""}
          {change}% from yesterday
        </div>
      )}
    </div>
  );
}
