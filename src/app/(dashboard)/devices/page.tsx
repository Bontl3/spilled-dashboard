// src/app/(dashboard)/devices/page.tsx
"use client";

import { useState, useEffect } from "react";
import {
  Search,
  Plus,
  MoreHorizontal,
  Download,
  RefreshCw,
  Server,
  Wifi,
  HardDrive,
  Network,
  Laptop,
} from "lucide-react";
import ResultsTable from "@/components/visualizations/ResultsTable";
import DashboardCard from "@/components/ui/DashboardCard";
import { Button } from "@/components/ui/Button";
import { generateMockDeviceData } from "@/lib/mockData";
import { formatBytes } from "@/lib/utils";

export default function DevicesPage() {
  const [devices, setDevices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Simulate loading devices data
    setLoading(true);
    setTimeout(() => {
      setDevices(generateMockDeviceData(12));
      setLoading(false);
    }, 500);
  }, []);

  const filteredDevices = searchTerm
    ? devices.filter(
        (device) =>
          device.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          device.ip.toLowerCase().includes(searchTerm.toLowerCase()) ||
          device.type.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : devices;

  const getDeviceIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "server":
        return <Server className="h-4 w-4 text-blue-600" />;
      case "router":
        return <Network className="h-4 w-4 text-purple-600" />;
      case "switch":
        return <HardDrive className="h-4 w-4 text-orange-600" />;
      case "access point":
        return <Wifi className="h-4 w-4 text-green-600" />;
      default:
        return <Laptop className="h-4 w-4 text-gray-600" />;
    }
  };

  const enhancedDevices = filteredDevices.map((device) => ({
    ...device,
    // Format values for display
    typeWithIcon: (
      <div className="flex items-center">
        <div className="mr-2">{getDeviceIcon(device.type)}</div>
        {device.type}
      </div>
    ),
    status: (
      <div className="flex items-center">
        <div
          className={`h-2 w-2 rounded-full mr-2 ${
            device.status === "Online"
              ? "bg-green-500"
              : device.status === "Offline"
              ? "bg-red-500"
              : "bg-yellow-500"
          }`}
        ></div>
        {device.status}
      </div>
    ),
    trafficIn: formatBytes(device.trafficIn),
    trafficOut: formatBytes(device.trafficOut),
  }));

  const columns = [
    { header: "Name", accessor: "name" },
    { header: "Type", accessor: "typeWithIcon" },
    { header: "IP Address", accessor: "ip" },
    { header: "Status", accessor: "status" },
    { header: "Traffic In", accessor: "trafficIn" },
    { header: "Traffic Out", accessor: "trafficOut" },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-1">
            Network Devices
          </h1>
          <p className="text-gray-600">
            All monitored devices in your network infrastructure
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button className="flex items-center">
            <Plus className="mr-2 h-4 w-4" />
            Add Device
          </Button>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
          <div className="text-sm text-gray-500 mb-1">Total Devices</div>
          <div className="text-2xl font-bold">{devices.length}</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
          <div className="text-sm text-gray-500 mb-1">Online</div>
          <div className="text-2xl font-bold text-green-600">
            {devices.filter((d) => d.status === "Online").length}
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
          <div className="text-sm text-gray-500 mb-1">Total Traffic</div>
          <div className="text-2xl font-bold">
            {formatBytes(
              devices.reduce(
                (total, device) => total + device.trafficIn + device.trafficOut,
                0
              )
            )}
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
          <div className="text-sm text-gray-500 mb-1">Device Categories</div>
          <div className="text-2xl font-bold">
            {new Set(devices.map((d) => d.type)).size}
          </div>
        </div>
      </div>

      <DashboardCard
        title="Network Devices"
        isLoading={loading}
        action={
          <div className="flex space-x-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search devices..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500 w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        }
      >
        <ResultsTable data={enhancedDevices} columns={columns} />
      </DashboardCard>
    </div>
  );
}
