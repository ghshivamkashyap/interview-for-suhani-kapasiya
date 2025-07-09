import React, { useState, useEffect } from "react";
import LaunchTable from "../components/LaunchTable";
import LaunchModal from "../components/LaunchModal";
import Pagination from "../components/Pagination";
import { formatUTCDate } from "../utils/format";
import useDashboardData from "../hooks/useDashboardData";
import Spinner from "../components/Spinner";
import { Filter, ChevronDown, Calendar } from "lucide-react";

const timeOptions = [
  "All Time",
  "Past Week",
  "Past Month",
  "Past 3 Months",
  "Past 6 Months",
  "Past Year",
  "Past 2 Years",
];

const filterOptions = [
  "All Launches",
  "Upcoming Launches",
  "Successful Launches",
  "Failed Launches",
];

const Dropdown = ({ value, setValue, options, icon: Icon, className = "" }) => {
  const [open, setOpen] = useState(false);
  const ref = React.useRef();

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <div className={`relative ${className}`} ref={ref}>
      <button
        type="button"
        className="flex items-center gap-2 border border-gray-300 rounded px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 min-w-[180px] transition"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        {Icon && <Icon size={16} className="text-gray-500" />}
        <span className="flex-1 text-left truncate">{value}</span>
        <ChevronDown size={16} className="text-gray-400" />
      </button>
      {open && (
        <ul className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded shadow-lg max-h-60 overflow-auto">
          {options.map((option) => (
            <li
              key={option}
              className={`px-4 py-2 cursor-pointer hover:bg-blue-50 ${
                value === option
                  ? "bg-blue-100 text-blue-700 font-semibold"
                  : "text-gray-700"
              }`}
              onClick={() => {
                setValue(option);
                setOpen(false);
              }}
              aria-selected={value === option}
              role="option"
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const Dashboard = () => {
  const { launches, rocketsMap, launchpadsMap, payloadsMap, loading } =
    useDashboardData();

  const [selectedLaunch, setSelectedLaunch] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [timeRange, setTimeRange] = useState("All Time");
  const [currentPage, setCurrentPage] = useState(1);

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

  // Fixed page size for all screens
  const pageSize = 10;

  const filteredLaunches = getFilteredLaunches();
  const totalPages = Math.ceil(filteredLaunches.length / pageSize) || 1;
  // Reset to page 1 if filter/timeRange changes and currentPage is out of bounds
  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(1);
    // eslint-disable-next-line
  }, [timeRange, filter, totalPages]);

  const paginatedLaunches = filteredLaunches.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );
  const tableData =
    paginatedLaunches.length > 0
      ? paginatedLaunches.map((launch, idx) => {
          // Get first payload id from launch
          const payloadId = Array.isArray(launch.payloads)
            ? launch.payloads[0]
            : null;
          // Get payload object from map
          const payload = payloadId ? payloadsMap[payloadId] : null;
          return {
            serial: (currentPage - 1) * pageSize + idx + 1,
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
          <Spinner size={40} />
        </div>
      ) : (
        <>
          <div className="w-full max-w-6xl flex flex-col md:flex-row md:items-center justify-between gap-4 mb-1">
            <Dropdown
              value={timeRange}
              setValue={setTimeRange}
              options={timeOptions}
              icon={Calendar}
            />
            <Dropdown
              value={filter}
              setValue={setFilter}
              options={filterOptions}
              icon={Filter}
            />
          </div>

          <LaunchTable
            data={tableData}
            onRowClick={openModal}
            loading={loading}
            filterActive={
              (filter !== "All Launches" || timeRange !== "All Time") &&
              !loading
            }
          />
          <LaunchModal
            isOpen={isModalOpen}
            onClose={closeModal}
            launch={selectedLaunch}
            rocket={selectedLaunch?.rocket}
            payload={selectedLaunch?.payload}
            launchpad={selectedLaunch?.launchpad}
          />
          <div className="w-full max-w-[1100px] flex justify-end mt-2 mb-2">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
