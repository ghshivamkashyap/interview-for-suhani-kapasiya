import React from "react";
import StatusBadge from "./StatusBadge";
import Spinner from "./Spinner";

const LaunchTable = ({ data, onRowClick, loading, filterActive }) => {
  return (
    <div className="overflow-x-auto rounded-lg shadow border border-gray-200 mx-auto my-8 max-w-[1100px] w-full min-h-[500px] bg-white mb-1">
      <table className="min-w-full w-full divide-y divide-gray-200 bg-white rounded-lg">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
              No.
            </th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
              Launched (UTC)
            </th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
              Location
            </th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
              Mission
            </th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
              Orbit
            </th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
              Launch Status
            </th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
              Rocket
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {loading ? (
            <tr>
              <td colSpan="7" className="px-4 py-8 text-center">
                <Spinner size={40} />
              </td>
            </tr>
          ) : data && data.length > 0 ? (
            data.map((launch, idx) => (
              <tr
                key={launch.id || idx}
                className="cursor-pointer hover:bg-gray-100  h-10"
                onClick={() => onRowClick(launch.full)}
              >
                <td className="px-4 py-2 whitespace-nowrap">
                  {launch.serial ?? idx + 1}
                </td>
                <td className="px-4 py-2 whitespace-nowrap">
                  {launch.date_utc}
                </td>
                <td className="px-4 py-2 whitespace-nowrap">
                  {launch.location || "-"}
                </td>
                <td className="px-4 py-2 whitespace-nowrap">
                  {launch.name || "-"}
                </td>
                <td className="px-4 py-2 whitespace-nowrap">
                  {launch.orbit || "-"}
                </td>
                <td className="px-4 py-2 whitespace-nowrap">
                  <StatusBadge status={launch.status} />
                </td>
                <td className="px-4 py-2 whitespace-nowrap">
                  {launch.rocket || "-"}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="px-4 py-8 text-center text-gray-400">
                {filterActive
                  ? "No results found for the specified filter."
                  : "No data available"}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default LaunchTable;
