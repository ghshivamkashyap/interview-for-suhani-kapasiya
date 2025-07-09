import React from "react";
import { formatUTCDate } from "../utils/format";
const LaunchModal = ({
  isOpen,
  onClose,
  launch,
  rocket,
  payload,
  launchpad,
}) => {
  if (!isOpen || !launch) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 w-[90%] max-w-2xl relative shadow-lg">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-xl"
        >
          &times;
        </button>

        <div className="flex items-center gap-4 mb-4">
          <img
            src={launch.links?.patch?.small || ""}
            alt={launch.name}
            className="w-16 h-16 object-contain"
          />
          <div>
            <h2 className="text-lg font-semibold">{launch.name}</h2>
            <p className="text-sm text-gray-600">{rocket}</p>
            {launch.success ? (
              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                Success
              </span>
            ) : launch.upcoming ? (
              <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
                Upcoming
              </span>
            ) : (
              <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded">
                Failed
              </span>
            )}
          </div>
        </div>

        <p className="text-sm text-gray-700 mb-4">
          {launch.details || "No details available."}{" "}
          {launch.links?.wikipedia && (
            <a
              href={launch.links.wikipedia}
              className="text-blue-500 underline ml-1"
              target="_blank"
              rel="noopener noreferrer"
            >
              Wikipedia
            </a>
          )}
        </p>

        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-gray-800">
          <div>
            <strong>Flight Number:</strong> {launch.flight_number}
          </div>
          <div>
            <strong>Mission Name:</strong> {launch.name}
          </div>
          <div>
            <strong>Rocket Type:</strong> {rocket || "-"}
          </div>
          <div>
            <strong>Rocket Name:</strong> {rocket || "-"}
          </div>
          <div>
            <strong>Manufacturer:</strong> {payload?.manufacturers || "-"}
          </div>
          <div>
            <strong>Nationality:</strong>{" "}
            {payload?.nationalities?.[0] || payload?.nationality || "-"}
          </div>
          <div>
            <strong>Launch Date:</strong>{" "}
            {formatUTCDate(launch.date_utc)}
          </div>
          <div>
            <strong>Payload Type:</strong> {payload?.type || "-"}
          </div>
          <div>
            <strong>Orbit:</strong> {payload?.orbit || "-"}
          </div>
          <div>
            <strong>Launch Site:</strong> {launchpad || "-"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LaunchModal;
