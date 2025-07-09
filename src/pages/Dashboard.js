import React, { useEffect, useState } from "react";
import LaunchTable from "../components/LaunchTable";
import {
  fetchAllLaunches,
  fetchAllRockets,
  fetchAllLaunchpads,
  fetchPayloadById,
} from "../utils/api";
import { formatUTCDate } from "../utils/format";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [launches, setLaunches] = useState([]);
  const [rocketsMap, setRocketsMap] = useState({});
  const [launchpadsMap, setLaunchpadsMap] = useState({});
  const [payloadsMap, setPayloadsMap] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [launchData, rocketData, launchpadData] = await Promise.all([
          fetchAllLaunches(),
          fetchAllRockets(),
          fetchAllLaunchpads(),
        ]);

        setLaunches(launchData);

        const rocketMap = {};
        rocketData.forEach((r) => {
          rocketMap[r.id] = r.name;
        });
        setRocketsMap(rocketMap);

        const launchpadMap = {};
        launchpadData.forEach((lp) => {
          launchpadMap[lp.id] = lp.name;
        });
        setLaunchpadsMap(launchpadMap);

        // Gather all unique payload IDs from launches
        const allPayloadIds = Array.from(
          new Set(
            launchData.flatMap((launch) =>
              Array.isArray(launch.payloads) ? launch.payloads : []
            )
          )
        );
        // Fetch all payloads in parallel
        const payloadResponses = await Promise.all(
          allPayloadIds.map((id) => fetchPayloadById(id).catch(() => null))
        );
        const payloadsMap = {};
        payloadResponses.forEach((payload) => {
          if (payload && payload.id) {
            payloadsMap[payload.id] = payload;
          }
        });
        setPayloadsMap(payloadsMap);

        setLoading(false);
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };
    fetchData();
  }, []);

  const tableData =
    launches.length > 0
      ? launches.map((launch, idx) => {
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
          };
        })
      : [];

  return (
    <div className="min-h-screen flex items-center justify-center">
      {loading ? (
        <div className="text-gray-500 text-lg font-medium">
          Loading launches...
        </div>
      ) : (
        <LaunchTable data={tableData} />
      )}
    </div>
  );
};

export default Dashboard;
