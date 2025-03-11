// src/components/ui/ContextMenu.tsx
"use client";

import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

export interface ContextMenuItem {
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  danger?: boolean;
  divider?: boolean;
}

interface ContextMenuProps {
  items: ContextMenuItem[];
  onClose: () => void;
  x: number;
  y: number;
  className?: string;
}

export function ContextMenu({
  items,
  onClose,
  x,
  y,
  className,
}: ContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x, y });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);

  useEffect(() => {
    if (menuRef.current) {
      // Adjust position if menu would go off screen
      const rect = menuRef.current.getBoundingClientRect();
      const newPosition = { ...position };

      if (rect.right > window.innerWidth) {
        newPosition.x = window.innerWidth - rect.width;
      }

      if (rect.bottom > window.innerHeight) {
        newPosition.y = window.innerHeight - rect.height;
      }

      if (newPosition.x !== position.x || newPosition.y !== position.y) {
        setPosition(newPosition);
      }
    }
  }, [position]);

  if (!mounted) {
    return null;
  }

  return createPortal(
    <div
      ref={menuRef}
      className={cn(
        "fixed z-50 w-56 bg-white rounded-md shadow-lg border border-gray-200 py-1 text-sm",
        className
      )}
      style={{ top: position.y, left: position.x }}
    >
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {item.divider && <div className="my-1 border-t border-gray-200" />}
          <button
            className={cn(
              "flex w-full items-center px-3 py-2 text-left",
              item.disabled
                ? "text-gray-400 cursor-not-allowed"
                : item.danger
                ? "text-red-600 hover:bg-red-50"
                : "text-gray-700 hover:bg-gray-100"
            )}
            onClick={() => {
              if (!item.disabled) {
                item.onClick();
                onClose();
              }
            }}
            disabled={item.disabled}
          >
            {item.icon && <span className="mr-2">{item.icon}</span>}
            {item.label}
          </button>
        </React.Fragment>
      ))}
    </div>,
    document.body
  );
}

// Hook for using context menu anywhere
export function useContextMenu() {
  const [contextMenu, setContextMenu] = useState<{
    visible: boolean;
    x: number;
    y: number;
    items: ContextMenuItem[];
  }>({
    visible: false,
    x: 0,
    y: 0,
    items: [],
  });

  const showContextMenu = (e: React.MouseEvent, items: ContextMenuItem[]) => {
    e.preventDefault();
    setContextMenu({
      visible: true,
      x: e.clientX,
      y: e.clientY,
      items,
    });
  };

  const hideContextMenu = () => {
    setContextMenu({
      ...contextMenu,
      visible: false,
    });
  };

  const contextMenuElement = contextMenu.visible ? (
    <ContextMenu
      items={contextMenu.items}
      onClose={hideContextMenu}
      x={contextMenu.x}
      y={contextMenu.y}
    />
  ) : null;

  return {
    showContextMenu,
    hideContextMenu,
    contextMenuElement,
  };
}

export default ContextMenu;
