import React, { useState } from "react";
import LaunchTable from "../components/LaunchTable";
import LaunchModal from "../components/LaunchModal";
import { formatUTCDate } from "../utils/format";
import useDashboardData from "../hooks/useDashboardData";

const Dashboard = () => {
  const { launches, rocketsMap, launchpadsMap, payloadsMap, loading } =
    useDashboardData();

  const [selectedLaunch, setSelectedLaunch] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [timeRange, setTimeRange] = useState("All Time");

  // Dropdown filter state
  const [filter, setFilter] = useState("All Launches");

  // Filtered launches based on dropdown

  const getFilteredLaunches = () => {
    let filtered = [...launches];

    // Status filter
    if (filter === "Upcoming Launches") {
      filtered = filtered.filter((l) => l.upcoming === true);
    } else if (filter === "Successful Launches") {
      filtered = filtered.filter((l) => l.success === true);
    } else if (filter === "Failed Launches") {
      filtered = filtered.filter(
        (l) => l.success === false && l.upcoming === false
      );
    }

    // Time filter
    if (timeRange !== "All Time") {
      const daysMap = {
        "Past Week": 7,
        "Past Month": 30,
        "Past 3 Months": 90,
        "Past 6 Months": 180,
        "Past Year": 365,
        "Past 2 Years": 730,
      };

      const daysAgo = daysMap[timeRange];
      if (daysAgo) {
        const compareDate = new Date();
        compareDate.setHours(0, 0, 0, 0); // Start of today
        compareDate.setDate(compareDate.getDate() - daysAgo);

        filtered = filtered.filter((launch) => {
          const launchDate = new Date(launch.date_utc);
          return (
            !isNaN(launchDate.getTime()) &&
            launchDate.getTime() >= compareDate.getTime()
          );
        });
      }
    }

    return filtered;
  };

  const openModal = (launch) => {
    setSelectedLaunch(launch);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedLaunch(null);
    setIsModalOpen(false);
  };

  // ...existing code...

  const filteredLaunches = getFilteredLaunches();
  const tableData =
    filteredLaunches.length > 0
      ? filteredLaunches.map((launch, idx) => {
          // Get first payload id from launch
          const payloadId = Array.isArray(launch.payloads)
            ? launch.payloads[0]
            : null;
          // Get payload object from map
          const payload = payloadId ? payloadsMap[payloadId] : null;
          return {
            id: launch.id || idx,
            date_utc: launch.date_utc ? formatUTCDate(launch.date_utc) : "-",
            location: launchpadsMap[launch.launchpad] || "-",
            name: launch.name || "-",
            orbit: payload && payload.orbit ? payload.orbit : "-",
            status:
              launch.upcoming === true
                ? "Upcoming"
                : launch.success === true
                ? "Success"
                : "Failure",
            rocket: rocketsMap[launch.rocket] || "-",
            full: {
              ...launch,
              payload,
              rocket: rocketsMap[launch.rocket],
              launchpad: launchpadsMap[launch.launchpad],
            },
          };
        })
      : [];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      {loading ? (
        <div className="text-gray-500 text-lg font-medium">
          Loading launches...
        </div>
      ) : (
        <>
          <div className="w-full max-w-6xl flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <select
              className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
            >
              <option>All Time</option>
              <option>Past Week</option>
              <option>Past Month</option>
              <option>Past 3 Months</option>
              <option>Past 6 Months</option>
              <option>Past Year</option>
              <option>Past 2 Years</option>
            </select>
            <select
              className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option>All Launches</option>
              <option>Upcoming Launches</option>
              <option>Successful Launches</option>
              <option>Failed Launches</option>
            </select>
          </div>

          <LaunchTable data={tableData} onRowClick={openModal} />
          <LaunchModal
            isOpen={isModalOpen}
            onClose={closeModal}
            launch={selectedLaunch}
            rocket={selectedLaunch?.rocket}
            payload={selectedLaunch?.payload}
            launchpad={selectedLaunch?.launchpad}
          />
        </>
      )}
    </div>
  );
};

export default Dashboard;
