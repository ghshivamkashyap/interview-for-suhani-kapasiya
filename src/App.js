import "./App.css";
import Table from "./components/Table";
import useLatestLaunch from "./utils/useLatestLaunch";

function App() {
  const { launch, loading, error } = useLatestLaunch();

  // Map API response to table row format
  const tableData = launch
    ? [
        {
          id: launch.id,
          date_utc: launch.date_utc,
          location: launch.launchpad || "-", // You can fetch launchpad details for name if needed
          name: launch.name,
          orbit:
            Array.isArray(launch.payloads) &&
            launch.payloads.length > 0 &&
            launch.payloads[0].orbit
              ? launch.payloads[0].orbit
              : "-",
          upcoming: launch.upcoming,
          success: launch.success,
          rocket_name: launch.rocket || "-", // You can fetch rocket details for name if needed
        },
      ]
    : [];

  return (
    <div className="App p-4">
      <h1 className="font-bold text-red-500 flex text-2xl mb-4">
        spacex-dashboard-challenge
      </h1>
      {loading && <div className="text-gray-500">Loading...</div>}
      {error && <div className="text-red-500">{error}</div>}
      {!loading && !error && <Table data={tableData} />}
    </div>
  );
}

export default App;
