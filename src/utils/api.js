export const fetchAllPayloads = async () => {
  const res = await fetch("https://api.spacexdata.com/v4/payloads");
  return res.json();
};
// Utility functions for SpaceX API requests

const BASE_URL = "https://api.spacexdata.com/v4";

// export async function fetchAllLaunches() {
//   const res = await fetch(`${BASE_URL}/launches`);
//   if (!res.ok) throw new Error("Failed to fetch launches");
//   return res.json();
// }

export async function fetchRocketById(id) {
  const res = await fetch(`${BASE_URL}/rockets/${id}`);
  if (!res.ok) throw new Error("Failed to fetch rocket");
  return res.json();
}

// export async function fetchPayloadById(id) {
//   const res = await fetch(`${BASE_URL}/payloads/${id}`);
//   if (!res.ok) throw new Error("Failed to fetch payload");
//   return res.json();
// }

export async function fetchLaunchpadById(id) {
  const res = await fetch(`${BASE_URL}/launchpads/${id}`);
  if (!res.ok) throw new Error("Failed to fetch launchpad");
  return res.json();
}

// /utils/api.js

export const fetchAllLaunches = async () => {
  const res = await fetch("https://api.spacexdata.com/v5/launches");
  return res.json();
};

export const fetchAllRockets = async () => {
  const res = await fetch("https://api.spacexdata.com/v4/rockets");
  return res.json();
};

export const fetchAllLaunchpads = async () => {
  const res = await fetch("https://api.spacexdata.com/v4/launchpads");
  return res.json();
};

export async function fetchPayloadById(id) {
  const res = await fetch(`${BASE_URL}/payloads/${id}`);
  if (!res.ok) throw new Error("Failed to fetch payload");
  return res.json();
}
