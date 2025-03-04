// src/components/ui/AlertDetailsModal.tsx
import { useEffect, useRef } from "react";
import {
  X,
  AlertTriangle,
  ExternalLink,
  Clock,
  Server,
  Network,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { formatDateTime } from "@/lib/utils";

// Define a proper interface for the alert details
interface AlertDetails {
  ipAddress?: string;
  protocol?: string;
  port?: number;
}

interface Alert {
  id: string;
  message: string;
  severity: "Critical" | "High" | "Medium" | "Low";
  timestamp: string | Date;
  source: string;
  type: string;
  details?: AlertDetails;
}

interface AlertDetailsModalProps {
  alert: Alert;
  onClose: () => void;
  onAcknowledge: (id: string) => void;
}

export default function AlertDetailsModal({
  alert,
  onClose,
  onAcknowledge,
}: AlertDetailsModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    }

    // Close on ESC key press
    function handleEscKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscKey);

    // Prevent scrolling when modal is open
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscKey);
      document.body.style.overflow = "auto";
    };
  }, [onClose]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Critical":
        return {
          bg: "bg-red-50",
          text: "text-red-800",
          border: "border-red-200",
          icon: "text-red-600",
          badge: "bg-red-100 text-red-800",
        };
      case "High":
        return {
          bg: "bg-amber-50",
          text: "text-amber-800",
          border: "border-amber-200",
          icon: "text-amber-600",
          badge: "bg-amber-100 text-amber-800",
        };
      case "Medium":
        return {
          bg: "bg-yellow-50",
          text: "text-yellow-800",
          border: "border-yellow-200",
          icon: "text-yellow-600",
          badge: "bg-yellow-100 text-yellow-800",
        };
      default:
        return {
          bg: "bg-blue-50",
          text: "text-blue-800",
          border: "border-blue-200",
          icon: "text-blue-600",
          badge: "bg-blue-100 text-blue-800",
        };
    }
  };

  const colors = getSeverityColor(alert.severity);

  // Add error boundary for undefined details
  const renderTechnicalDetails = () => {
    if (!alert.details) {
      return (
        <div className="text-sm text-gray-500">
          No technical details available
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {alert.details.ipAddress && (
          <div>
            <div className="text-xs text-gray-500">IP Address</div>
            <div className="text-sm font-medium font-mono">
              {alert.details.ipAddress}
            </div>
          </div>
        )}
        {alert.details.protocol && (
          <div>
            <div className="text-xs text-gray-500">Protocol</div>
            <div className="text-sm font-medium flex items-center">
              <Network className="h-4 w-4 mr-1 text-gray-400" />
              {alert.details.protocol}
              {alert.details.port && ` (Port ${alert.details.port})`}
            </div>
          </div>
        )}
        <div>
          <div className="text-xs text-gray-500">Detection Method</div>
          <div className="text-sm font-medium flex items-center">
            <Shield className="h-4 w-4 mr-1 text-gray-400" />
            Automated Threat Detection
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div
        ref={modalRef}
        className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div
          className={`px-6 py-4 ${colors.bg} ${colors.border} border-b flex justify-between items-center`}
        >
          <div className="flex items-center">
            <AlertTriangle className={`h-5 w-5 mr-2 ${colors.icon}`} />
            <h2 className={`text-lg font-semibold ${colors.text}`}>
              Alert Details
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {alert.message}
            </h3>
            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
              <span
                className={`font-medium px-2 py-0.5 rounded-full ${colors.badge}`}
              >
                {alert.severity} Severity
              </span>
              <span className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                {formatDateTime(alert.timestamp)}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Alert Details */}
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-3 uppercase">
                Alert Information
              </h4>
              <div className="space-y-3">
                <div>
                  <div className="text-xs text-gray-500">Alert Type</div>
                  <div className="text-sm font-medium">{alert.type}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Source</div>
                  <div className="text-sm font-medium flex items-center">
                    <Server className="h-4 w-4 mr-1 text-gray-400" />
                    {alert.source}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Alert ID</div>
                  <div className="text-sm font-mono">{alert.id}</div>
                </div>
              </div>
            </div>

            {/* Technical Details */}
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-3 uppercase">
                Technical Details
              </h4>
              {renderTechnicalDetails()}
            </div>
          </div>

          {/* Recommendations */}
          <div className="mt-6 p-4 bg-gray-50 rounded-md border border-gray-200">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">
              Recommended Actions
            </h4>
            <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
              <li>Investigate the source of the alert</li>
              <li>Check system logs for related events</li>
              <li>Review network traffic patterns</li>
              {alert.severity === "Critical" && (
                <li className="text-red-600">Immediate attention required</li>
              )}
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
          <a
            href="#"
            className="text-green-700 text-sm flex items-center hover:text-green-800"
          >
            <ExternalLink className="h-4 w-4 mr-1" />
            View in Security Center
          </a>
          <div className="space-x-3">
            <Button variant="outline" onClick={onClose}>
              Dismiss
            </Button>
            <Button onClick={() => onAcknowledge(alert.id)}>
              Acknowledge Alert
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Add default props
AlertDetailsModal.defaultProps = {
  onAcknowledge: () => {}, // No-op function as fallback
};
