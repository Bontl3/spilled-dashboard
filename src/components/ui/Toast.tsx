// src/components/ui/Toast.tsx
"use client";

import React, { useState, useEffect, createContext, useContext } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import { X, AlertCircle, CheckCircle, Info, AlertTriangle } from "lucide-react";

// Toast types
export type ToastType = "success" | "error" | "info" | "warning";

// Toast interface
export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

// Toast context
interface ToastContextType {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, "id">) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

// Provider component
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Add a new toast
  const addToast = (toast: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { ...toast, id }]);

    // Auto remove after duration
    if (toast.duration !== Infinity) {
      setTimeout(() => {
        removeToast(id);
      }, toast.duration || 5000);
    }
  };

  // Remove a toast by ID
  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      {mounted && <ToastContainer />}
    </ToastContext.Provider>
  );
}

// Hook to use toast
export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

// Toast container component
function ToastContainer() {
  const { toasts, removeToast } = useToast();

  // If there are no toasts, don't render anything
  if (toasts.length === 0) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 pointer-events-none flex flex-col items-end p-4 gap-2">
      <div className="max-h-screen overflow-hidden flex flex-col-reverse gap-2">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            toast={toast}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </div>,
    document.body
  );
}

// Individual toast component
function Toast({ toast, onClose }: { toast: Toast; onClose: () => void }) {
  const { type, title, message, action } = toast;

  // Define icon and styles based on toast type
  const getToastStyles = (type: ToastType) => {
    switch (type) {
      case "success":
        return {
          icon: <CheckCircle className="h-5 w-5" />,
          className: "bg-green-50 border-green-200 text-green-800",
          iconClassName: "text-green-500",
        };
      case "error":
        return {
          icon: <AlertCircle className="h-5 w-5" />,
          className: "bg-red-50 border-red-200 text-red-800",
          iconClassName: "text-red-500",
        };
      case "warning":
        return {
          icon: <AlertTriangle className="h-5 w-5" />,
          className: "bg-amber-50 border-amber-200 text-amber-800",
          iconClassName: "text-amber-500",
        };
      case "info":
      default:
        return {
          icon: <Info className="h-5 w-5" />,
          className: "bg-blue-50 border-blue-200 text-blue-800",
          iconClassName: "text-blue-500",
        };
    }
  };

  const { icon, className, iconClassName } = getToastStyles(type);

  // Animation classes
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger animation after mount
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={cn(
        "pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg border shadow-lg transform transition-all duration-300 ease-in-out",
        className,
        isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
      )}
    >
      <div className="p-4 flex">
        <div className={cn("flex-shrink-0 mr-3", iconClassName)}>{icon}</div>
        <div className="flex-1 pt-0.5">
          <p className="text-sm font-medium">{title}</p>
          {message && <p className="mt-1 text-sm opacity-90">{message}</p>}

          {action && (
            <div className="mt-3">
              <button
                type="button"
                onClick={() => {
                  action.onClick();
                  onClose();
                }}
                className="text-sm font-medium underline focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                {action.label}
              </button>
            </div>
          )}
        </div>
        <div className="flex-shrink-0 self-start ml-4">
          <button
            type="button"
            className="rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            onClick={onClose}
          >
            <span className="sr-only">Close</span>
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

// For convenience, create helper functions
export const toast = {
  success: (props: Omit<Toast, "id" | "type">) => {
    const { addToast } = useToast();
    addToast({ ...props, type: "success" });
  },
  error: (props: Omit<Toast, "id" | "type">) => {
    const { addToast } = useToast();
    addToast({ ...props, type: "error" });
  },
  warning: (props: Omit<Toast, "id" | "type">) => {
    const { addToast } = useToast();
    addToast({ ...props, type: "warning" });
  },
  info: (props: Omit<Toast, "id" | "type">) => {
    const { addToast } = useToast();
    addToast({ ...props, type: "info" });
  },
};

export default Toast;
