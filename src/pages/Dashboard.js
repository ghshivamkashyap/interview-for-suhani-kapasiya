import React, { useEffect, useState } from "react";
import LaunchTable from "../components/LaunchTable";
import {
  fetchAllLaunches,
  fetchAllRockets,
  fetchAllLaunchpads,
} from "../utils/api";
import { formatUTCDate } from "../utils/format";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [launches, setLaunches] = useState([]);
  const [rocketsMap, setRocketsMap] = useState({});
  const [launchpadsMap, setLaunchpadsMap] = useState({});

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

        setLoading(false);
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };

    fetchData();
  }, []);

  const tableData =
    launches.length > 0
      ? launches.map((launch, idx) => ({
          id: launch.id || idx,
          date_utc: launch.date_utc ? formatUTCDate(launch.date_utc) : "-",
          location: launchpadsMap[launch.launchpad] || "-",
          name: launch.name || "-",
          orbit: launch.payloads?.[0]?.orbit || "-", // orbit from payload
          status:
            launch.upcoming === true
              ? "Upcoming"
              : launch.success === true
              ? "Success"
              : "Failure",
          rocket: rocketsMap[launch.rocket] || "-",
        }))
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
