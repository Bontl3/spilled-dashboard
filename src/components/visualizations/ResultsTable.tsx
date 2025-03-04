// src/components/visualizations/ResultsTable.tsx
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/Table";
import { TableColumn } from "@/types";
import { cn } from "@/lib/utils";

interface ResultsTableProps {
  data: Record<string, any>[];
  columns: TableColumn[];
  className?: string;
  maxHeight?: string;
}

export default function ResultsTable({
  data,
  columns,
  className,
  maxHeight,
}: ResultsTableProps) {
  if (!data || data.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">No data available</div>
    );
  }

  const formatCellValue = (value: any) => {
    if (value === null || value === undefined) return "-";

    // Format numbers with commas
    if (typeof value === "number") {
      return value.toLocaleString();
    }

    // Convert boolean to Yes/No
    if (typeof value === "boolean") {
      return value ? "Yes" : "No";
    }

    // Format dates
    if (value instanceof Date) {
      return value.toLocaleString();
    }

    // Handle date strings
    if (typeof value === "string" && value.match(/^\d{4}-\d{2}-\d{2}T/)) {
      return new Date(value).toLocaleString();
    }

    return value.toString();
  };

  return (
    <div
      className={cn(
        "border border-gray-200 rounded-lg overflow-hidden bg-white",
        className
      )}
    >
      <div
        className={cn(
          "overflow-x-auto",
          maxHeight && `max-h-[${maxHeight}] overflow-y-auto`
        )}
      >
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column, index) => (
                <TableHead key={index} className="bg-gray-50">
                  {column.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row, rowIndex) => (
              <TableRow key={rowIndex} className="hover:bg-gray-50">
                {columns.map((column, colIndex) => (
                  <TableCell key={colIndex}>
                    {formatCellValue(row[column.accessor])}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
