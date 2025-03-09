// src/app/(dashboard)/layout.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Search,
  Server,
  AlertTriangle,
  Settings,
  Menu,
  X,
  Activity,
  Bell,
  ChevronDown,
  LogOut,
  User,
  HelpCircle,
} from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(3);
  const pathname = usePathname();
  const router = useRouter();

  // Track scroll for header shadow
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Add click outside handler for user menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".user-menu")) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close sidebar on route change on mobile
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Query", href: "/query", icon: Search },
    { name: "Devices", href: "/devices", icon: Server },
    { name: "Alerts", href: "/alerts", icon: AlertTriangle },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  const handleNavigation = (route: string) => {
    // For desktop, we can navigate immediately
    router.push(route);

    // For mobile, we want to close the sidebar first
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  const handleLogout = () => {
    // In a real app, implement actual logout logic here
    console.log("Logging out");
    router.push("/");
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-75 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 w-64 bg-green-800 text-white transform transition-transform duration-300 ease-in-out z-30 lg:translate-x-0 lg:static lg:inset-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-green-700">
          <Link href="/dashboard" className="flex items-center">
            <div className="flex items-center justify-center w-8 h-8 rounded-md bg-white mr-2">
              <Activity className="h-5 w-5 text-green-800" />
            </div>
            <span className="text-xl font-semibold tracking-wide">Spilled</span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden focus:outline-none focus:ring-2 focus:ring-green-500 rounded-md"
            aria-label="Close sidebar"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="px-4 py-3">
          <div className="flex items-center space-x-2 px-2 py-1.5 rounded-md bg-green-700/50">
            <div className="flex-shrink-0 h-8 w-8 rounded-full bg-green-600 flex items-center justify-center">
              <User className="h-4 w-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                Admin User
              </p>
              <p className="text-xs text-green-200 truncate">
                admin@example.com
              </p>
            </div>
          </div>
        </div>

        <nav className="mt-4 px-2 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <button
                key={item.name}
                onClick={() => handleNavigation(item.href)}
                className={cn(
                  "flex items-center w-full px-3 py-2.5 text-sm font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-green-500",
                  isActive
                    ? "bg-green-700 text-white"
                    : "text-green-100 hover:bg-green-700/70"
                )}
              >
                <Icon className="mr-3 h-5 w-5" />
                {item.name}
              </button>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-green-700">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-3 py-2.5 text-sm font-medium rounded-md text-green-100 hover:bg-green-700/70 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <LogOut className="mr-3 h-5 w-5" />
            Log out
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Header */}
        <header
          className={cn(
            "bg-white z-10 transition-shadow duration-200",
            scrolled ? "shadow-md" : "shadow-sm"
          )}
        >
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <button
                  type="button"
                  className="text-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 rounded-md lg:hidden"
                  onClick={() => setSidebarOpen(true)}
                  aria-label="Open sidebar"
                >
                  <Menu className="h-6 w-6" />
                </button>
                <div className="ml-4">
                  <h1 className="text-lg font-medium text-gray-900">
                    Network Observability
                  </h1>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <button
                  className="relative p-1 text-gray-500 hover:text-gray-600 hover:bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500"
                  aria-label={`View ${unreadNotifications} notifications`}
                  onClick={() => router.push("/alerts")}
                >
                  <Bell className="h-6 w-6" />
                  {unreadNotifications > 0 && (
                    <span className="absolute top-0 right-0 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-medium text-white">
                      {unreadNotifications}
                    </span>
                  )}
                </button>

                <button
                  className="relative p-1 text-gray-500 hover:text-gray-600 hover:bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500"
                  aria-label="Help"
                >
                  <HelpCircle className="h-6 w-6" />
                </button>

                <div className="relative user-menu">
                  <button
                    type="button"
                    className="flex items-center space-x-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 rounded-full"
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    aria-expanded={userMenuOpen}
                    aria-haspopup="true"
                  >
                    <div className="h-8 w-8 bg-green-600 rounded-full flex items-center justify-center text-white">
                      <span className="text-sm font-medium">A</span>
                    </div>
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                  </button>

                  {userMenuOpen && (
                    <div
                      className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 ring-1 ring-black ring-opacity-5"
                      role="menu"
                      aria-orientation="vertical"
                    >
                      <button
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => {
                          setUserMenuOpen(false);
                          router.push("/profile");
                        }}
                        role="menuitem"
                      >
                        Your Profile
                      </button>
                      <button
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => {
                          setUserMenuOpen(false);
                          router.push("/settings");
                        }}
                        role="menuitem"
                      >
                        Settings
                      </button>
                      <button
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => {
                          setUserMenuOpen(false);
                          handleLogout();
                        }}
                        role="menuitem"
                      >
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto bg-gray-50">{children}</main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 py-4 px-6 text-center text-sm text-gray-600">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center">
            <p>
              &copy; {new Date().getFullYear()} Spilled Network Observability
              Platform
            </p>
            <div className="flex space-x-4 mt-2 sm:mt-0">
              <button
                onClick={() => router.push("/privacy")}
                className="hover:text-green-600"
              >
                Privacy Policy
              </button>
              <button
                onClick={() => router.push("/terms")}
                className="hover:text-green-600"
              >
                Terms of Service
              </button>
              <button
                onClick={() => router.push("/contact")}
                className="hover:text-green-600"
              >
                Contact
              </button>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
