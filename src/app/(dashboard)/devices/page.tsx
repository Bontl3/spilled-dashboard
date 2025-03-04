"use client";

import { useState, useEffect } from "react";
import ResultsTable from "@/components/visualizations/ResultsTable";
import { generateMockDeviceData } from "@/lib/mockData";

export default function DevicesPage() {
  const [devices, setDevices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading devices data
    setLoading(true);
    setTimeout(() => {
      setDevices(generateMockDeviceData(12));
      setLoading(false);
    }, 500);
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Network Devices</h1>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
          <h2 className="font-medium text-gray-700">Devices</h2>
          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="Search devices..."
              className="border border-gray-300 rounded-md px-3 py-1 text-sm"
            />
            <button className="bg-green-800 text-white px-3 py-1 rounded-md text-sm">
              Add Device
            </button>
          </div>
        </div>

        <div className="p-4">
          {loading ? (
            <div className="py-12 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-600"></div>
            </div>
          ) : (
            <ResultsTable
              data={devices}
              columns={[
                { header: "Name", accessor: "name" },
                { header: "Type", accessor: "type" },
                { header: "IP Address", accessor: "ip" },
                { header: "Status", accessor: "status" },
                { header: "Traffic In", accessor: "trafficIn" },
                { header: "Traffic Out", accessor: "trafficOut" },
              ]}
            />
          )}
        </div>
      </div>
    </div>
  );
}
