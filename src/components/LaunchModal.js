import React from "react";
import { formatUTCDate } from "../utils/format";
import { ExternalLink, Youtube, Globe, BookOpen } from "lucide-react";

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm">
      <div className="bg-white rounded-xl p-6 w-[90%] max-w-2xl relative shadow-2xl border border-gray-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-xl"
        >
          &times;
        </button>

        {/* Header */}
        <div className="flex items-center gap-4 mb-4">
          <img
            src={launch.links?.patch?.small || ""}
            alt={launch.name}
            className="w-16 h-16 object-contain rounded-md border border-gray-300"
          />
          <div className="flex-1">
            <h2 className="text-xl font-semibold">{launch.name}</h2>
            <p className="text-sm text-gray-600">{rocket}</p>
          </div>
          <div>
            {launch.success ? (
              <span className="bg-green-100 text-green-800 text-xs font-medium px-3 py-1 rounded-full">
                Success
              </span>
            ) : launch.upcoming ? (
              <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-3 py-1 rounded-full">
                Upcoming
              </span>
            ) : (
              <span className="bg-red-100 text-red-800 text-xs font-medium px-3 py-1 rounded-full">
                Failed
              </span>
            )}
          </div>
        </div>

        {/* Media Icons */}
        <div className="flex items-center gap-3 text-gray-500 mb-3 ml-16 mt-2">
          {launch.links?.wikipedia && (
            <a
              href={launch.links.wikipedia}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-500"
              title="Wikipedia"
            >
              <Globe size={16} />
            </a>
          )}
          {launch.links?.article && (
            <a
              href={launch.links.article}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-500"
              title="Article"
            >
              <BookOpen size={16} />
            </a>
          )}
          {launch.links?.webcast && (
            <a
              href={launch.links.webcast}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-red-500"
              title="Webcast"
            >
              <Youtube size={16} />
            </a>
          )}
        </div>

        {/* Description */}
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

        {/* Details Grid */}
        <div className="text-sm text-gray-800 divide-y divide-gray-200 border border-gray-200 rounded-lg overflow-hidden">
          {[
            ["Flight Number", launch.flight_number],
            ["Mission Name", launch.name],
            ["Rocket Type", rocket || "-"],
            ["Rocket Name", rocket || "-"],
            ["Manufacturer", payload?.manufacturers || "-"],
            [
              "Nationality",
              payload?.nationalities?.[0] || payload?.nationality || "-",
            ],
            ["Launch Date", formatUTCDate(launch.date_utc)],
            ["Payload Type", payload?.type || "-"],
            ["Orbit", payload?.orbit || "-"],
            ["Launch Site", launchpad || "-"],
          ].map(([label, value], idx) => (
            <div key={idx} className="flex justify-between px-4 py-2">
              <span className="text-gray-500">{label}</span>
              <span className="font-medium">{value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LaunchModal;

