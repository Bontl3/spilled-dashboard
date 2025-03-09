// src/components/ui/Toolbar.tsx
import React from "react";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";

interface ToolbarProps {
  children: React.ReactNode;
  className?: string;
  sticky?: boolean;
}

interface ToolbarItemProps {
  children: React.ReactNode;
  className?: string;
}

interface ToolbarSectionProps {
  children: React.ReactNode;
  className?: string;
  align?: "left" | "center" | "right";
}

interface ToolbarSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function Toolbar({ children, className, sticky = false }: ToolbarProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between px-4 py-2 bg-white border-b border-gray-200",
        sticky && "sticky top-0 z-10",
        className
      )}
    >
      {children}
    </div>
  );
}

export function ToolbarItem({ children, className }: ToolbarItemProps) {
  return <div className={cn("px-2", className)}>{children}</div>;
}

export function ToolbarSection({
  children,
  className,
  align = "left",
}: ToolbarSectionProps) {
  return (
    <div
      className={cn(
        "flex items-center",
        {
          "justify-start": align === "left",
          "justify-center": align === "center",
          "justify-end": align === "right",
        },
        className
      )}
    >
      {children}
    </div>
  );
}

export function ToolbarSearch({
  value,
  onChange,
  placeholder = "Search...",
  className,
}: ToolbarSearchProps) {
  return (
    <div className={cn("relative", className)}>
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <Search className="w-4 h-4 text-gray-400" />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="block w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
        placeholder={placeholder}
      />
    </div>
  );
}

export function ToolbarDivider() {
  return <div className="h-5 border-l border-gray-300 mx-2"></div>;
}

// Helper component for creating toolbar button groups
export function ToolbarButtonGroup({ children, className }: ToolbarItemProps) {
  return <div className={cn("flex space-x-1", className)}>{children}</div>;
}

// Example usage:
/*
<Toolbar>
  <ToolbarSection>
    <ToolbarItem>
      <Button variant="outline" size="sm">New</Button>
    </ToolbarItem>
    <ToolbarItem>
      <Button variant="outline" size="sm">Edit</Button>
    </ToolbarItem>
  </ToolbarSection>
  
  <ToolbarSection align="center">
    <ToolbarItem>
      <h2 className="font-medium">Title</h2>
    </ToolbarItem>
  </ToolbarSection>
  
  <ToolbarSection align="right">
    <ToolbarItem>
      <ToolbarSearch value={search} onChange={setSearch} />
    </ToolbarItem>
  </ToolbarSection>
</Toolbar>
*/
