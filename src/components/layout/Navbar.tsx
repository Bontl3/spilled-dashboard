import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Search,
  HardDrive,
  Bell,
  Settings,
  LogOut,
} from "lucide-react";

export function Navbar() {
  const pathname = usePathname();

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/query", label: "Query", icon: Search },
    { href: "/devices", label: "Devices", icon: HardDrive },
    { href: "/alerts", label: "Alerts", icon: Bell },
    { href: "/settings", label: "Settings", icon: Settings },
  ];

  return (
    <nav className="fixed top-0 left-0 h-screen w-64 bg-white shadow-lg border-r border-gray-200 z-50">
      <div className="flex flex-col h-full">
        {/* Logo/Brand */}
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-800">
            Network Observability
          </h1>
        </div>

        {/* User Info */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
              <span className="text-white font-medium">A</span>
            </div>
            <div>
              <p className="font-medium text-gray-800">Admin User</p>
              <p className="text-sm text-gray-500">admin@example.com</p>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 py-6">
          <ul className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center px-6 py-3 text-sm font-medium transition-colors ${
                      isActive
                        ? "text-blue-600 bg-blue-50"
                        : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
                    }`}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Logout */}
        <div className="p-4 border-t border-gray-200">
          <button className="flex items-center px-6 py-3 text-sm font-medium text-gray-600 hover:text-red-600 hover:bg-gray-50 w-full rounded-md transition-colors">
            <LogOut className="w-5 h-5 mr-3" />
            Log out
          </button>
        </div>
      </div>
    </nav>
  );
}
