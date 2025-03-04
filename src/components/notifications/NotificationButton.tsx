import { Bell } from "lucide-react";

export function NotificationButton() {
  return (
    <button className="fixed top-4 right-4 p-2 bg-white rounded-full shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors">
      <Bell className="w-5 h-5 text-gray-600" />
      <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
        3
      </span>
    </button>
  );
}
