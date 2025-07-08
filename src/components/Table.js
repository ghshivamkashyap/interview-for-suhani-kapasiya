import React from "react";


const Table = ({ data }) => {
  return (
    <div className="overflow-x-auto rounded-lg shadow">
      <table className="min-w-full divide-y divide-gray-200 bg-white">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
              No
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
          {data && data.length > 0 ? (
            data.map((launch, idx) => (
              <tr key={launch.id || idx}>
                <td className="px-4 py-2 whitespace-nowrap">{idx + 1}</td>
                <td className="px-4 py-2 whitespace-nowrap">
                  {launch.date_utc
                    ? new Date(launch.date_utc).toLocaleString("en-GB", {
                        timeZone: "UTC",
                      })
                    : "-"}
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
                  {launch.upcoming ? (
                    <span className="px-2 py-1 rounded bg-yellow-100 text-yellow-800 text-xs font-semibold">
                      Upcoming
                    </span>
                  ) : launch.success ? (
                    <span className="px-2 py-1 rounded bg-green-100 text-green-800 text-xs font-semibold">
                      Success
                    </span>
                  ) : (
                    <span className="px-2 py-1 rounded bg-red-100 text-red-800 text-xs font-semibold">
                      Failed
                    </span>
                  )}
                </td>
                <td className="px-4 py-2 whitespace-nowrap">
                  {launch.rocket_name || "-"}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="px-4 py-2 text-center text-gray-400">
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
